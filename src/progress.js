/* ============================================================
   İlerleme çıkarımı — geçmişten hareket başına seyir, tahmini 1RM
   ve plato.

   DOM'a dokunmaz, ekran bilmez. Hesabı çizimden ayırmanın sebebi
   nutrition.js ile aynı: sayılar tek yerde durursa testte de,
   ileride başka bir ekranda da aynı cevabı verirler.

   Sınır: geçmiş kaydında hareket başına TEK ağırlık var, set
   başına değil. Buradaki hesapların hepsi o tek sayıyla yapılıyor;
   "üçüncü sette düşürdüm" gibi bilgi kayıtta hiç yok.
   ============================================================ */

import { numOr0 } from "./dom.js";
import { EXERCISES } from "./data/exercises.js";

/* Kayıtta hareketin yalnızca adı duruyor, kimliği durmuyor —
   katalog ada göre tersten kuruluyor ki step ve bw alanlarına
   bakabilelim. Katalogdan çıkmış eski bir ad için undefined döner;
   çağıranlar bunu bekliyor. */
const BY_NAME = {};
Object.keys(EXERCISES).forEach(id => { BY_NAME[EXERCISES[id].name] = EXERCISES[id]; });

export const isBodyweight = name => !!(BY_NAME[name] && BY_NAME[name].bw);

/* "10-12" → 10 · "10 / taraf" → 10 · "20-40 sn" ve
   "yapabildiğin kadar" → null

   Aralığın ALT ucu alınıyor: kaç tekrar yapıldığı kaydedilmiyor,
   elimizde yalnızca programın hedefi var. Alt uçtan hesaplamak
   tahmini olduğundan az gösterir — olmayan bir gücü vadetmekten
   iyidir. Süreyle ölçülen hareketlerde tekrar diye bir şey yok. */
export function repsOf(text){
  const s = String(text == null ? "" : text);
  if(/sn/i.test(s)) return null;
  const m = s.match(/\d+/);
  if(!m) return null;
  const r = +m[0];
  /* Epley yüksek tekrarda hızla saçmalıyor; 15'in üstünü tahmin
     etmiyoruz, 20 tekrarlık bir setten çıkan sayı işe yaramaz. */
  return r >= 1 && r <= 15 ? r : null;
}

/* Epley: 1RM ≈ ağırlık × (1 + tekrar / 30). */
export function epley(kg, reps){
  if(!(kg > 0) || !reps) return null;
  return kg * (1 + reps / 30);
}

/* Plato çıkışı için önerilecek ağırlık: yaklaşık %10 geri, hareketin
   kendi kademesine yuvarlanmış. Rehber'in 2. kuralı artışın küçük
   olmasını istiyor; inişin de aynı ölçekte kalması tırmanışın birkaç
   seansta bitmesini sağlıyor. */
export function deload(name, kg){
  const step = (BY_NAME[name] && BY_NAME[name].step) || 2.5;
  const back = Math.max(step, Math.round(kg * 0.1 / step) * step);
  return Math.max(step, Math.round((kg - back) * 10) / 10);
}

/* Plato: son üç kayıtta ağırlık hiç artmamış.

   Aynı ağırlıkta kalmak tek başına durgunluk değil — Rehber'in 3.
   kuralı "ağırlık artmıyorsa tekrar artsın" diyor. Hedef tekrar ya
   da tamamlanan set arttıysa bu ilerlemedir, ses çıkarmıyoruz.
   Yapılan tekrar kaydedilmediği için ayrım ancak bu kadar
   yapılabiliyor; şüphede kalınca susmayı seçiyoruz. */
function plateauOf(pts){
  if(pts.length < 3) return false;
  const a = pts[pts.length - 3], b = pts[pts.length - 2], c = pts[pts.length - 1];
  if(b.kg > a.kg || c.kg > a.kg) return false;
  if((c.reps || 0) > (a.reps || 0)) return false;
  if(c.done > a.done) return false;
  return true;
}

/* Tahmini 1RM, kişinin en iyi setinden. Son seanstan değil: kötü
   geçen bir gün rekoru silmesin, rakam karşılaştırılabilir kalsın. */
function bestOneRepMax(name, pts){
  if(isBodyweight(name)) return null;
  let best = 0;
  pts.forEach(p => {
    const e = epley(p.kg, p.reps);
    if(e && e > best) best = e;
  });
  /* Tam sayıya yuvarlanıyor: zaten tahmin, ondalık kesinlik iddiası
     yaratır. */
  return best ? Math.round(best) : null;
}

/* Bir kişinin geçmişini harekete göre toplar.

   Ağırlığı olmayan satırlar dışarıda kalır: vücut ağırlığı
   hareketlerinin çizecek bir seyri yok, boş bırakılmış ağırlığın da
   ne olduğu bilinmiyor. Noktalar eskiden yeniye sıralı — grafiğin
   ekseni zaman. Listenin kendisi ise en son çalışılan hareket başta
   olacak şekilde sıralanır: insan en son yaptığı işi arıyor. */
export function trends(history, person){
  const bag = {};

  history
    .filter(h => h.person === person)
    .sort((a, b) => a.ts - b.ts)
    .forEach(h => (h.items || []).forEach(it => {
      const kg = numOr0(it.kg);
      if(!kg) return;
      if(!bag[it.n]) bag[it.n] = [];
      bag[it.n].push({ ts: h.ts, kg, reps: repsOf(it.reps), done: it.done, total: it.total });
    }));

  return Object.keys(bag).map(name => {
    const pts = bag[name];
    return {
      name,
      points: pts,
      last: pts[pts.length - 1],
      best: pts.reduce((a, p) => p.kg > a ? p.kg : a, 0),
      e1rm: bestOneRepMax(name, pts),
      plateau: plateauOf(pts)
    };
  }).sort((a, b) => b.last.ts - a.last.ts);
}
