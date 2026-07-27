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
