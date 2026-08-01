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
import { PROGRAMS } from "./data/programs.js";

const WEEK = 7 * 86400000;

/* Kayıtta hareketin yalnızca adı duruyor, kimliği durmuyor —
   katalog ada göre tersten kuruluyor ki step ve gear alanlarına
   bakabilelim. Katalogdan çıkmış eski bir ad için undefined döner;
   çağıranlar bunu bekliyor. */
const BY_NAME = {};
Object.keys(EXERCISES).forEach(id => { BY_NAME[EXERCISES[id].name] = EXERCISES[id]; });

/* 1RM yalnızca serbest ağırlıkta anlamlı. Makinede yazan kilo, o
   makinenin kaldıraç oranıyla birlikte bir şey ifade eder; başka
   marka bir leg press'te aynı sayı bambaşka bir yüktür. Epley oraya
   da uygulanabilir ama çıkan rakam ne karşılaştırılabilir ne de
   denenebilir — "1RM ≈ 147 kg" gören yeni başlayan bunu bench'inin
   iki katı sanıyor, oysa iki sayının ortak birimi yok.

   Tahmin dışında kalanlar sessizce kalır: satırda grafik ve en iyi
   ağırlık zaten duruyor, eksik olan tek şey denenmemesi gereken bir
   rakam. */
const freeWeight = name => {
  const g = BY_NAME[name] && BY_NAME[name].gear;
  return g === "bar" || g === "ez" || g === "dambil";
};

/* "10-12" → 10 · "10 / taraf" → 10 · "20-40 sn" ve
   "yapabildiğin kadar" → null

   Aralığın ALT ucu alınıyor: bu, kişinin ne yaptığını söylemediği
   durumda kullanılan tahmin. Alt uçtan hesaplamak tahmini olduğundan
   az gösterir — olmayan bir gücü vadetmekten iyidir. Süreyle ölçülen
   hareketlerde tekrar diye bir şey yok.

   Gerçekten yapılan tekrar girildiyse bu fonksiyona hiç gelinmiyor;
   bkz. topSet. */
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
  /* Tekrar sayıları ancak aynı kaynaktan geliyorsa karşılaştırılabilir:
     ikisi de girilmiş ya da ikisi de programın hedefinden tahmin
     edilmiş olmalı. Biri gerçek biri tahminse artış, kişinin daha çok
     tekrar yapmasından da tahminin düşük tutulmasından da gelebilir —
     ayırt edilemeyen bir artışa bakıp plato kararını değiştirmiyoruz. */
  if(a.said === c.said && (c.reps || 0) > (a.reps || 0)) return false;
  if(c.done > a.done) return false;
  return true;
}

/* Tahmini 1RM, kişinin en iyi setinden. Son seanstan değil: kötü
   geçen bir gün rekoru silmesin, rakam karşılaştırılabilir kalsın.
   Serbest ağırlık dışında hiç hesaplanmaz — gerekçesi freeWeight'te. */
function bestOneRepMax(name, pts){
  if(!freeWeight(name)) return null;
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
/* Bir kaydın en ağır seti ve o setin tekrarı.

   Kayıtta set dökümü varsa (setler ayrıştığı için yazılmış) en ağır
   set oradan seçiliyor ve tekrarı GERÇEKTEN yapılan sayı oluyor.
   Yoksa eski davranış: düz kg alanı ve programın hedef tekrarı.

   said, sayının nereden geldiğini söylüyor. Plato tespiti buna
   bakıyor: tahmin edilmiş iki tekrar sayısını karşılaştırmak,
   ikisi de aynı programdan geldiği için hiçbir şey öğretmez. */
function topSet(it){
  const kg = numOr0(it.kg);
  if(!Array.isArray(it.sets) || !it.sets.length){
    return { kg, reps: repsOf(it.reps), said: false };
  }
  let best = null, bestKg = -1;
  it.sets.forEach(d => {
    const v = numOr0(d.kg);
    if(v > bestKg){ bestKg = v; best = d; }
  });
  if(!best) return { kg, reps: repsOf(it.reps), said: false };
  return best.reps != null
    ? { kg: bestKg || kg, reps: best.reps, said: true }
    : { kg: bestKg || kg, reps: repsOf(it.reps), said: false };
}

export function trends(history, person){
  const bag = {};

  history
    .filter(h => h.person === person)
    .sort((a, b) => a.ts - b.ts)
    .forEach(h => (h.items || []).forEach(it => {
      const t = topSet(it);
      if(!t.kg) return;
      if(!bag[it.n]) bag[it.n] = [];
      bag[it.n].push({ ts: h.ts, kg: t.kg, reps: t.reps, said: t.said,
                       done: it.done, total: it.total });
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

/* ============================================================
   Haftalık denge.

   Yeni başlayanın en sık yaptığı hata bir hareketi yanlış yapmak
   değil, haftanın tamamına bakmayı hiç akıl etmemek. Aynada görünen
   kaslar (göğüs, omuz, ön kol) fazla, görünmeyenler (üst sırt, arka
   bacak) az çalışılıyor. Bunun bedeli aylar sonra omuzun öne
   düşmesiyle ya da belin ağrımasıyla ödeniyor.

   Sayım son yedi güne bakıyor, takvim haftasına değil: Pazar akşamı
   sayacın sıfırlanması, o gün antrenman yapmış birine "bu hafta hiç
   çalışmadın" dedirtirdi.

   Tamamlanan set sayılıyor, ağırlık değil. Hacim karşılaştırması
   ancak aynı ölçüyle anlamlı; 40 kg'lık çekiş setiyle 100 kg'lık
   bacak setini kilo üzerinden yan yana koymak yanıltıcı olurdu.
   ============================================================ */

export const GROUPS = [
  { key: "itis",  label: "İtiş" },
  { key: "cekis", label: "Çekiş" },
  { key: "bacak", label: "Bacak" },
  { key: "kalca", label: "Kalça ve arka bacak" },
  { key: "govde", label: "Gövde" }
];

/* Birbirini dengelemesi gereken çiftler ve dengesizliğin bedeli.
   İtiş/çekiş omuz sağlığının, bacak/kalça diz ve belin meselesi. */
const PAIRS = [
  { a: "itis", b: "cekis",
    why: "Çekiş itişin gerisinde kalınca omuz zamanla öne düşer." },
  { a: "bacak", b: "kalca",
    why: "Ön bacak öne geçince diz ve bel yükün fazlasını taşır." }
];

/* 1,6 kat: altında kalan fark haftanın akışından da doğabilir, üstü
   ise artık bir eğilim. Altı setin altında hiç konuşulmuyor — iki
   sete karşı dört set, oran olarak iki kat ama söylenecek bir şey
   değil. */
function balanceNote(sets){
  for(const p of PAIRS){
    const hi = Math.max(sets[p.a], sets[p.b]);
    const lo = Math.min(sets[p.a], sets[p.b]);
    if(hi < 6) continue;
    if(lo > 0 && hi / lo < 1.6) continue;
    const more = sets[p.a] > sets[p.b] ? p.a : p.b;
    return { more, less: more === p.a ? p.b : p.a, hi, lo, why: p.why };
  }
  return null;
}

export function weekly(history, person, now = Date.now()){
  const since = now - WEEK;
  const sets = {};
  GROUPS.forEach(g => { sets[g.key] = 0; });

  let sessions = 0;
  history.forEach(h => {
    if(h.person !== person || h.ts < since) return;
    sessions++;
    (h.items || []).forEach(it => {
      /* Katalogdan çıkmış eski bir ad, ya da hacim sayımına girmeyen
         mobilite hareketi: ikisi de sessizce atlanıyor. */
      const g = BY_NAME[it.n] && BY_NAME[it.n].group;
      if(sets[g] != null) sets[g] += it.done || 0;
    });
  });

  const groups = GROUPS.map(g => ({ ...g, sets: sets[g.key] }));
  const total = groups.reduce((a, g) => a + g.sets, 0);
  return { sessions, total, groups, note: total ? balanceNote(sets) : null };
}

/* ============================================================
   Seviye atlama zamanı geldi mi.

   Rehber sekmesi seviyelerin nasıl ilerlediğini anlatıyor ama
   uygulama kişinin kendisine hiç "hazırsın" demiyordu; seviye elle
   seçilen bir şey ve yeni başlayan ne zaman geçeceğini bilmiyor.

   Üç koşul birden aranıyor: yeterince zaman (4 hafta), yeterince
   tekrar (8 seans) ve gerçekten ilerleme (hareketlerin çoğunda
   ağırlık artmış). Üçü de tutmuyorsa susuyoruz — erken atlamak,
   hiç atlamamaktan daha pahalıya mal oluyor.

   Öneri, karar değil: seviyeyi yine kişi seçiyor.
   ============================================================ */
export function levelHint(history, person, lvl, now = Date.now()){
  const top = PROGRAMS[PROGRAMS.length - 1].id;
  if(lvl >= top) return null;

  const mine = history
    .filter(h => h.person === person && h.level === lvl)
    .sort((a, b) => a.ts - b.ts);
  if(mine.length < 8) return null;

  const weeks = Math.floor((now - mine[0].ts) / WEEK);
  if(weeks < 4) return null;

  /* Ağırlığı olan ve bu seviyede en az iki kez çalışılmış hareketler:
     tek kayıtlı bir hareketin artıp artmadığı bilinemez. */
  const bag = {};
  mine.forEach(h => (h.items || []).forEach(it => {
    const kg = numOr0(it.kg);
    if(kg) (bag[it.n] = bag[it.n] || []).push(kg);
  }));
  const seen = Object.values(bag).filter(v => v.length >= 2);
  if(seen.length < 2) return null;

  const up = seen.filter(v => v[v.length - 1] > v[0]).length;
  if(up * 2 < seen.length) return null;

  return { next: lvl + 1, weeks, sessions: mine.length, up, total: seen.length };
}
