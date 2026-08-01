/* ============================================================
   iOS açılış görselleri.

   Ana ekrandan açılan bir PWA'da iOS, uygulama yüklenene kadar
   `apple-touch-startup-image` ile verilen kareyi gösterir. Verilmezse
   boş bir ekran çıkıyor — uygulamanın ilk izlenimi bir saniyelik
   hiçlik oluyordu.

   iOS bu görseli ÖLÇEKLEMİYOR: cihazın piksel ölçüsüyle birebir
   eşleşen bir dosya arıyor, bulamazsa hiçbirini kullanmıyor. O yüzden
   liste cihaz cihaz yazılıyor ve her biri ayrı üretiliyor.

   Görsel elle çizilmiyor, burada hesaplanıyor. Sebebi tek: marka
   başlıktaki SVG'nin aynısı olsun. Elle çizilen bir PNG, logonun
   payı değiştiğinde sessizce eskiyor; buradaki kalkan yolu ile
   index.html'deki kalkan yolu aynı karakter dizisi.

   Kullanımı:
       node tools/make-splash.mjs          (nişan tasarımı)
       node tools/make-splash.mjs sade     (başka bir tasarım)

   Araç index.html'deki link etiketlerini de kendisi yazıyor:
   dosya listesiyle etiket listesinin ayrı ellerde tutulması, eski
   sw.js'teki dosya listesiyle aynı sınıftan bir hataydı — biri
   güncellenip diğeri unutulduğunda hiçbir şey bağırmıyor.
   ============================================================ */

import puppeteer from "puppeteer-core";
import { mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIKTI = join(KOK, "public", "splash");

const CHROME = process.env.CHROME_PATH || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome"
].find(p => { try{ return statSync(p).isFile(); }catch(e){ return false; } });

/* base.css'teki koyu tema değerleri. Açılış karesi ile uygulamanın
   ilk karesi arasında renk sıçraması olmasın diye birebir aynı. */
const BG = "#0D0F12";
const ACCENT = "#2F6BE0";
const TEXT = "#F2F4F7";
const MUTED = "#666D79";

/* index.html'deki markanın yolu — kopyalanmadı, taşındı. */
const SHIELD = "M2.2 2.2h17.6v10.6c0 6.6-4.6 10.4-8.8 11.4-4.2-1-8.8-4.8-8.8-11.4z";
const BAND = "M2.2 12.6h17.6";

/* ---------- tasarımlar ----------

   Hepsi ekranın KISA kenarına (k) oranlı: aynı kalıp 640 pikselik
   eski SE'de de 2048 pikselik iPad'de de aynı görünüyor. */

export const TASARIMLAR = {
  /* Ad kalkanın içinde, kazanılan plakalar altında birikiyor.
     Uygulamanın cümlesinin tamamı tek nişanda: kas vücudun zırhı,
     her seans bir plaka daha. */
  nisan: k => {
    const W = k * 0.62, u = W / 22;
    const bands = [21.4, 18.9, 16.4].map((y, i) =>
      `<rect x="1" y="${y - 1.05}" width="20" height="2.1" ` +
      `fill="${i === 0 ? TEXT : ACCENT}" opacity="${(0.92 - i * 0.27).toFixed(2)}" ` +
      `clip-path="url(#in)"/>`).join("");
    return crest(W, u, bands);
  },

  /* Nişanın plakasız hâli. */
  arma: k => {
    const W = k * 0.60;
    return crest(W, W / 22, "");
  },

  /* Kalkan tümüyle plakalardan kuruluyor, ad altta. */
  plaka: k => {
    const bands = [5.6, 9.1, 12.6, 16.1, 19.4].map((y, i) =>
      `<rect x="1" y="${y - 1.15}" width="20" height="2.3" ` +
      `fill="${i >= 3 ? TEXT : ACCENT}" opacity="${(0.34 + i * 0.165).toFixed(2)}" ` +
      `clip-path="url(#in)"/>`).join("");
    return `
    <div class="stack">
      <svg viewBox="0 0 22 26" style="width:${k * 0.42}px">
        <defs><clipPath id="in"><path d="${SHIELD}"/></clipPath></defs>
        ${bands}
        <path d="${SHIELD}" fill="none" stroke="${ACCENT}" stroke-width="1.5"/>
      </svg>
      <div class="word" style="font-size:${k * 0.17}px">ZIRH</div>
    </div>`;
  },

  /* Marka üstte, ad altta — iOS uygulamalarının alışılmış kalıbı. */
  sade: k => `
    <div class="stack">
      <svg viewBox="0 0 22 26" style="width:${k * 0.27}px">
        <path d="${SHIELD}" fill="none" stroke="${ACCENT}" stroke-width="2.1"/>
        <path d="${BAND}" stroke="${TEXT}" stroke-width="2.3"/>
      </svg>
      <div class="word" style="font-size:${k * 0.155}px">ZIRH</div>
    </div>`
};

/* Kalkanın bandın üstünde kalan alanı zaten bir yazı alanı; arma
   geleneğinde ad oraya yazılıyor. u, viewBox biriminin piksel
   karşılığı — yazıyı SVG koordinatlarına oturtmaya yarıyor. */
function crest(W, u, bands){
  return `
    <div class="stack">
      <div class="crest" style="width:${W}px;height:${W * 26 / 22}px">
        <svg viewBox="0 0 22 26" style="width:100%;height:100%">
          <defs><clipPath id="in"><path d="${SHIELD}"/></clipPath></defs>
          ${bands}
          <path d="${SHIELD}" fill="none" stroke="${ACCENT}" stroke-width="1.6"/>
          <path d="${BAND}" stroke="${ACCENT}" stroke-width="1.7"/>
        </svg>
        <div class="word inword" style="font-size:${u * 7.2}px;top:${u * 7.4}px">ZIRH</div>
      </div>
    </div>`;
}

export function sayfa(tasarim, w, h){
  const k = Math.min(w, h);
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=Archivo:wght@500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden}
  body{background:${BG};position:relative;font-family:Archivo,sans-serif}
  .stack{
    position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    display:flex;flex-direction:column;align-items:center;gap:${k * 0.062}px;
  }
  .crest{position:relative}
  .inword{position:absolute;left:0;right:0;text-align:center;transform:translateY(-50%)}
  .word{
    font-family:'Big Shoulders Display',sans-serif;font-weight:800;color:${TEXT};
    letter-spacing:.055em;line-height:.9;text-transform:uppercase;
  }
  .tag{
    position:absolute;left:0;right:0;bottom:${h * 0.062}px;text-align:center;
    font-size:${k * 0.032}px;font-weight:500;color:${MUTED};letter-spacing:.02em;
  }
</style></head><body>
${TASARIMLAR[tasarim](k)}
<p class="tag">Kas, vücudun zırhı</p>
</body></html>`;
}

/* ---------- cihaz listesi ----------

   w ve h CSS pikseli, r cihaz piksel oranı; dosyanın gerçek ölçüsü
   w*r × h*r. Medya sorgusu da bu üçlüden kuruluyor.

   Yalnızca dikey: manifest uygulamayı "portrait"e kilitliyor.
   Cihaz eklemek bir satır — dosya da etiket de buradan üretiliyor. */
const CIHAZLAR = [
  { w: 440, h: 956, r: 3 },   /* 16 Pro Max */
  { w: 402, h: 874, r: 3 },   /* 16 Pro */
  { w: 430, h: 932, r: 3 },   /* 15 Pro Max · 14 Pro Max */
  { w: 393, h: 852, r: 3 },   /* 15 · 15 Pro · 14 Pro */
  { w: 428, h: 926, r: 3 },   /* 14 Plus · 13 Pro Max · 12 Pro Max */
  { w: 390, h: 844, r: 3 },   /* 14 · 13 · 12 */
  { w: 375, h: 812, r: 3 },   /* 13 mini · 12 mini · X · XS · 11 Pro */
  { w: 414, h: 896, r: 3 },   /* XS Max · 11 Pro Max */
  { w: 414, h: 896, r: 2 },   /* XR · 11 */
  { w: 414, h: 736, r: 3 },   /* 8 Plus · 7 Plus · 6s Plus */
  { w: 375, h: 667, r: 2 },   /* SE 2. ve 3. nesil · 8 · 7 */
  { w: 320, h: 568, r: 2 },   /* SE 1. nesil */
  { w: 834, h: 1210, r: 2 },  /* iPad Pro 11" */
  { w: 1024, h: 1366, r: 2 }, /* iPad Pro 12.9" */
  { w: 820, h: 1180, r: 2 },  /* iPad Air */
  { w: 744, h: 1133, r: 2 }   /* iPad mini */
];

const adi = d => `splash-${d.w * d.r}x${d.h * d.r}.png`;

const sorgu = d =>
  `(device-width:${d.w}px) and (device-height:${d.h}px) and ` +
  `(-webkit-device-pixel-ratio:${d.r}) and (orientation:portrait)`;

/* ---------- index.html'deki etiketler ---------- */

const BAS = "<!-- splash:start -->";
const SON = "<!-- splash:end -->";

function etiketleriYaz(){
  const yol = join(KOK, "index.html");
  const html = readFileSync(yol, "utf8");
  const i = html.indexOf(BAS), j = html.indexOf(SON);
  if(i < 0 || j < 0) throw new Error("index.html'de splash:start/end işareti yok");

  const satirlar = CIHAZLAR.map(d =>
    `<link rel="apple-touch-startup-image" href="./splash/${adi(d)}"\n` +
    `      media="${sorgu(d)}">`).join("\n");

  writeFileSync(yol,
    html.slice(0, i + BAS.length) + "\n" + satirlar + "\n" + html.slice(j), "utf8");
}

/* Karesi çekilmiş bir tasarım. Tasarımları başka bir yerden (örneğin
   bir karşılaştırma sayfasından) da üretebilmek için ayrı duruyor. */
export async function cek(liste, klasor){
  if(!CHROME) throw new Error("Chrome bulunamadı. CHROME_PATH ile yol verilebilir.");
  const tarayici = await puppeteer.launch({
    executablePath: CHROME, headless: "new", args: ["--no-sandbox"]
  });
  const p = await tarayici.newPage();
  for(const { tasarim, w, h, dosya } of liste){
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await p.setContent(sayfa(tasarim, w, h), { waitUntil: "load" });
    /* Yazı tipi gelmeden çekilen kare yedek fontla çıkıyor. */
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await p.screenshot({ path: join(klasor, dosya), type: "png" });
  }
  await tarayici.close();
}

/* ---------- üretim ----------

   Yalnızca doğrudan çalıştırıldığında; içe aktarıldığında yukarıdaki
   dışa aktarımlar kullanılabilsin diye yan etki üretmiyor. */

if(process.argv[1] === fileURLToPath(import.meta.url)){
  const tasarim = process.argv[2] || "nisan";
  if(!TASARIMLAR[tasarim]){
    console.error("Bilinmeyen tasarım: " + tasarim +
                  "  (" + Object.keys(TASARIMLAR).join(", ") + ")");
    process.exit(1);
  }

  /* Klasör baştan kuruluyor: cihaz listesinden çıkarılan bir ölçünün
     dosyası ortalıkta kalmasın. */
  rmSync(CIKTI, { recursive: true, force: true });
  mkdirSync(CIKTI, { recursive: true });

  await cek(CIHAZLAR.map(d => ({
    tasarim, w: d.w * d.r, h: d.h * d.r, dosya: adi(d)
  })), CIKTI);

  etiketleriYaz();

  const toplam = readdirSync(CIKTI)
    .reduce((a, f) => a + statSync(join(CIKTI, f)).size, 0);
  console.log(`${CIHAZLAR.length} açılış görseli (${tasarim}) · ` +
              `${Math.round(toplam / 1024)} KB · index.html güncellendi`);
}
