/*
   _test.html'i başsız tarayıcıda koşturur ve sonucu çıkış koduna
   çevirir.

   Testlerin kendisi tarayıcıda yaşıyor — gerçek bir iframe'de, gerçek
   yerleşim ölçüleriyle. Burada yapılan tek şey onları bir insan
   olmadan çalıştırmak: yayın öncesi kapıyı bu tutuyor.

       npm run dev          # ayrı bir kabukta
       npm test http://localhost:5173/_test.html

   ya da derlenmiş sürüm için:

       npm run build && npm run preview
       npm test http://localhost:4173/_test.html

   Chrome yolu CHROME_PATH ile verilebilir; verilmezse bilinen yerlere
   bakılır.
*/

const URL = process.argv[2] || "http://localhost:5173/_test.html";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium"
].filter(Boolean);

let puppeteer;
try {
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  console.error("puppeteer-core bulunamadı.  npm install");
  process.exit(2);
}

const { existsSync } = await import("node:fs");
const chrome = CANDIDATES.find(p => existsSync(p));
if(!chrome){
  console.error("Chrome bulunamadı. CHROME_PATH ile yolunu ver.");
  process.exit(2);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"]
});

let broke = false;
const page = await browser.newPage();
/* Minify edilmiş kodda sessizce ölen bir modül, testlerin hiç
   başlamaması demek. Sayfa hatasını yakalayıp ayrıca bildiriyoruz;
   yoksa tek göreceğimiz zaman aşımı olurdu. */
page.on("pageerror", e => { broke = true; console.error("SAYFA HATASI:", e.message); });
page.on("console", m => { if(m.type() === "error") console.error("KONSOL:", m.text()); });

let text = "";
try {
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(
    () => /SONUÇ|HATA/.test(document.getElementById("out").textContent),
    { timeout: 120000, polling: 500 }
  );
  text = await page.$eval("#out", el => el.textContent);
} catch (e) {
  console.error("Testler tamamlanmadı:", e.message);
} finally {
  await browser.close();
}

console.log(text);

const m = text.match(/SONUÇ\s+(\d+) geçti, (\d+) kaldı/);
if(!m || +m[2] > 0 || broke) process.exit(1);
console.log(`\n${m[1]} test geçti.`);
