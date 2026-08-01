/* ============================================================
   Beslenme hesabı.

   Boy, kilo, yaş ve haftalık antrenman sıklığından günlük kalori ve
   makro hedefi çıkarır. Kişisel ölçüler kodda yazmaz; uygulamada
   girilir ve yalnızca o telefonda saklanır.

   Kalori: Mifflin-St Jeor bazal metabolizma × hareket katsayısı.
   Protein: hedefe göre 1,6-2,2 g/kg — spor beslenmesi literatürünün
   ortak aralığı; yağ yakarken kası korumak için üst uç kullanılır.
   ============================================================ */

export const GOALS = {
  kas:  { label: "Kas kazan",  short: "Kas",  kcal: 1.10, protein: 1.8, fat: 0.9 },
  koru: { label: "Kiloyu koru", short: "Koru", kcal: 1.00, protein: 1.6, fat: 0.9 },
  yag:  { label: "Yağ yak",    short: "Yağ",  kcal: 0.82, protein: 2.2, fat: 0.8 }
};

/* Haftada kaç gün ağırlık çalışıldığına göre hareket katsayısı. */
function activity(daysPerWeek){
  if(daysPerWeek >= 5) return 1.55;
  if(daysPerWeek >= 4) return 1.50;
  if(daysPerWeek >= 3) return 1.45;
  return 1.375;
}

/* h cm · w kg · age yıl · person "erkek"|"kadin" */
export function macros({ h, w, age, person, goal, daysPerWeek }){
  if(!h || !w) return null;

  const a = age || 30;                    /* yaş girilmediyse makul varsayım */
  const g = GOALS[goal] || GOALS.koru;

  const bmr = 10 * w + 6.25 * h - 5 * a + (person === "kadin" ? -161 : 5);
  const kcal = Math.round(bmr * activity(daysPerWeek) * g.kcal / 10) * 10;

  const protein = Math.round(w * g.protein);
  const fat = Math.round(w * g.fat);
  const carb = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));

  return { kcal, protein, fat, carb, bmr: Math.round(bmr), goal: g };
}

export function daily(w){
  if(!w) return { cre: "—", water: "—" };
  const dec = n => (Math.round(n * 10) / 10).toString().replace(".", ",");
  return {
    cre: w < 65 ? "3 g" : "5 g",
    water: dec(w * 0.033) + "-" + dec(w * 0.042) + " L"
  };
}

export function bmi(h, w){
  if(!h || !w) return 0;
  return w / Math.pow(h / 100, 2);
}

export function bodyNote(h, w){
  if(!h || !w) return "Boyunu ve kilonu girersen kalori, protein ve su hedefleri buna göre hesaplanır. Bu bilgiler yalnızca bu telefonda saklanır.";
  const v = bmi(h, w);
  if(v < 21) return "İnce yapıdasın. Kas kazanmak istiyorsan kilo vermeye çalışma; günlük kalorinin biraz üstünde kal ve proteini kaçırma. Ayda 0,25-0,5 kg artış iyi bir hız.";
  if(v < 25) return "Kilon sağlıklı aralıkta. Kas kazanmak için kaloriyi çok oynatmana gerek yok; proteini tutturmak ve ağırlığı düzenli artırmak yeterli.";
  return "Kas kazanırken yağ oranını da düşürmek istiyorsan kaloriyi biraz kıs, proteini yüksek tut. Ağırlık antrenmanı bu süreçte kasını korur.";
}

/* ============================================================
   Hedefle gerçeğin karşılaştırması.

   Uygulama kiloya göre bir kalori hedefi hesaplıyor, öğün planını da
   ona göre kuruyordu — ama tutturulup tutturulmadığını hiç sormuyordu.
   Hedefi "kas kazan" olan biri üç ayda dört kilo verdiğinde ekranda
   hiçbir şey değişmiyordu.

   Cevap için kalori girmeye gerek yok: terazi zaten söylüyor. Kilo
   yönü hedefle çelişiyorsa yenen de hesaplananla çelişiyordur.

   Eşikler haftalık hıza göre:
     kas kazanmak   haftada +0,1 ile +0,4 kg — üstü büyük ölçüde yağ
     yağ yakmak     haftada -0,3 ile -0,9 kg — altı kas kaybı riski
     kiloyu korumak haftada ±0,25 kg
   Bunlar keskin sınırlar değil, yaygın aralıklar. O yüzden metin
   "yanlış yapıyorsun" demiyor, ne göründüğünü söyleyip ne
   yapılacağını yazıyor.
   ============================================================ */

const BANDS = {
  kas:  { lo:  0.10, hi:  0.40 },
  yag:  { lo: -0.90, hi: -0.30 },
  koru: { lo: -0.25, hi:  0.25 }
};

/* Üç haftadan kısa sürede karar verilmiyor: kilo suyla, tuzla ve
   bağırsak doluluğuyla günlerce oynuyor, iki ölçüm arası fark
   çoğunlukla gürültü. */
const MIN_GUN = 21;

/* Metin bandın hangi ucundan çıkıldığına göre. "alt" bandın altı,
   "ust" bandın üstü — hedefin ne olduğuna göre ikisi de iyi ya da
   kötü olabiliyor, o yüzden cümleler tek tek yazılı. bodyNote ile
   aynı yerde duruyorlar: tavsiye metni de beslenme bilgisi. */
const SOZ = {
  kas: {
    ok:  "Hedefinle gidişat uyumlu: kas kazanmak için makul bir hızda alıyorsun.",
    alt: "Hedefin kas kazanmak ama kilo artmıyor. Kas, açıkta kalan bir bütçeyle " +
         "kurulmuyor — yediğin hesaplanan hedefin altında. Günde 200-300 kcal ekle " +
         "ve iki hafta sonra tekrar bak.",
    ust: "Kilo hedeflenenden hızlı artıyor. Bu hızda gelenin büyük kısmı yağ olur; " +
         "kaloriyi biraz geri çek, ağırlıklar artmaya devam ettiği sürece kas gitmez."
  },
  yag: {
    ok:  "Hedefinle gidişat uyumlu: kası koruyan bir hızda veriyorsun.",
    alt: "Kilo çok hızlı düşüyor. Bu hızda giden yalnızca yağ olmaz, kas da gider " +
         "— üstelik salonda gücün düşer. Günde 200-300 kcal ekleyip proteini yerinde tut.",
    ust: "Hedefin yağ yakmak ama kilo inmiyor. Hesaplanan kalori hedefi " +
         "tutmuyor demektir; porsiyonları ölçmeden birkaç hafta gitmek çoğu zaman yeterli."
  },
  koru: {
    ok:  "Hedefinle gidişat uyumlu: kilon yerinde duruyor.",
    alt: "Hedefin kiloyu korumak ama düşüyorsun. Fark küçük görünse de aylara " +
         "yayılınca birikiyor; porsiyonları biraz büyüt.",
    ust: "Hedefin kiloyu korumak ama artıyorsun. Hesaplanan kalori hedefinin " +
         "üstüne çıkıyorsun demektir."
  }
};

export function goalCheck(wlog, goal){
  if(!Array.isArray(wlog) || wlog.length < 2) return null;
  const band = BANDS[goal], soz = SOZ[goal];
  if(!band || !soz) return null;

  const ilk = wlog[0], son = wlog[wlog.length - 1];
  const gun = Math.round((new Date(son.d) - new Date(ilk.d)) / 86400000);
  if(gun < MIN_GUN) return null;

  const fark = Math.round((son.w - ilk.w) * 10) / 10;
  const hiz = Math.round((fark / gun) * 7 * 100) / 100;   /* kg / hafta */

  const yan = hiz < band.lo ? "alt" : hiz > band.hi ? "ust" : "ok";
  return { ok: yan === "ok", yan, gun, fark, hiz, text: soz[yan] };
}
