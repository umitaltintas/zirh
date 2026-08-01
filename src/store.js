/* ============================================================
   Kalıcı kayıt.

   Tek kaynak: tarayıcının localStorage'ı. Hiçbir veri dışarı gitmez.
   Uygulamanın adı ve veri şeması zaman içinde değişti; buradaki
   göçler eski kayıtların kaybolmamasını sağlıyor.
   ============================================================ */

import { PROGRAMS, DEFAULT_LEVEL, applySwaps } from "./data/programs.js";
import { EXERCISES } from "./data/exercises.js";

const KEY = "zirh.v1";
const OLD_KEY = "fit216.v1";   /* uygulama Fit216 adıyla yayınlanmıştı */

export const PEOPLE = {
  erkek: { label: "Erkek" },
  kadin: { label: "Kadın" }
};

export const db = {
  person: "erkek",
  theme: null,
  schema: 2,
  active: {},    /* [person]["<seviye>:<gün>"] = {date, sets, kg, adj, swap, note, startedAt} */
  profile: {},   /* [person] = {h, w, goal, level, wlog} */
  history: []    /* [{ts, person, level, day, title, dur, items, note?}]
                    items[] = {n, done, total, reps, kg, sets?}
                    sets[]  = {kg, reps} — yalnız düz alanlardan
                              farklı bir şey söylüyorsa yazılır */
};

export function load(){
  try{
    let raw = localStorage.getItem(KEY);
    if(!raw){
      const old = localStorage.getItem(OLD_KEY);
      if(old){ raw = old; localStorage.setItem(KEY, old); }
    }
    if(raw) Object.assign(db, JSON.parse(raw));
  }catch(e){}

  if(!db.active || typeof db.active !== "object") db.active = {};
  if(!db.profile || typeof db.profile !== "object") db.profile = {};
  if(!Array.isArray(db.history)) db.history = [];

  migratePeople();
  migrateLevels();

  if(!PEOPLE[db.person]) db.person = "erkek";
}

/* Kişi anahtarları isimden cinsiyete taşındı. */
function migratePeople(){
  const map = { umit: "erkek", kadriye: "kadin" };
  ["active", "profile"].forEach(bag => {
    Object.keys(map).forEach(old => {
      if(db[bag] && db[bag][old]){
        db[bag][map[old]] = db[bag][old];
        delete db[bag][old];
      }
    });
  });
  db.history.forEach(rec => { if(map[rec.person]) rec.person = map[rec.person]; });
  if(map[db.person]) db.person = map[db.person];
}

/* Program seviyeleri geldi: gün anahtarı "A" iken "1:A" oldu.
   Eski kayıtların hepsi 1. seviyeden sayılır — o zaman tek program vardı. */
function migrateLevels(){
  if(db.schema >= 2) return;

  Object.keys(db.active).forEach(pk => {
    const bag = db.active[pk] || {};
    Object.keys(bag).forEach(dk => {
      if(dk.indexOf(":") > -1) return;
      bag[DEFAULT_LEVEL + ":" + dk] = bag[dk];
      delete bag[dk];
    });
  });

  db.history.forEach(rec => {
    if(rec.level == null) rec.level = DEFAULT_LEVEL;
  });

  Object.keys(db.profile).forEach(pk => {
    if(db.profile[pk] && db.profile[pk].level == null) db.profile[pk].level = DEFAULT_LEVEL;
  });

  db.schema = 2;
}

/* Seans notu sonradan geldi ama şema sürümü artmadı: alan isteğe bağlı,
   notu olmayan eski kayıt olduğu gibi geçerli ve geçmişte notsuz çizilir.
   Sürüm yalnızca eski kaydın yeniden yazılması gerektiğinde artar —
   boş bir göç yazmak sürümü de anlamsızlaştırır. */

export function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){}
}

/* ---------- kişi ve profil ---------- */

export function profile(person = db.person){
  if(!db.profile[person]) db.profile[person] = {};
  const p = db.profile[person];
  if(p.h == null) p.h = "";
  if(p.w == null) p.w = "";
  if(p.goal == null) p.goal = "kas";
  if(p.level == null) p.level = DEFAULT_LEVEL;
  if(!PROGRAMS.some(x => x.id === p.level)) p.level = DEFAULT_LEVEL;
  return p;
}

export function level(person = db.person){
  return profile(person).level;
}

/* Kilo ölçümünü seyre işler. Günde tek kayıt: kilo gün içinde suyla,
   yemekle, tuzla bir buçuk kiloya kadar oynuyor; aynı gün üç kez
   tartılan birinin grafiği o gürültüyü ilerleme gibi gösterirdi.
   Aynı gün yeniden yazılırsa son değer geçerli sayılıyor.

   Tarih gün olarak tutuluyor, zaman damgası olarak değil — saat
   bilgisinin sorulacak bir sorusu yok, üstelik "aynı gün mü"
   karşılaştırmasını da kolaylaştırıyor.

   Geriye true dönerse çizilecek yeni bir şey var demektir. */
export function logWeight(w, person = db.person){
  if(!(w > 0)) return false;
  const p = profile(person);
  if(!Array.isArray(p.wlog)) p.wlog = [];

  const d = todayStr();
  const last = p.wlog[p.wlog.length - 1];
  if(last && last.d === d){
    if(last.w === w) return false;
    last.w = w;
  }else{
    p.wlog.push({ d, w });
  }
  save();
  return true;
}

/* ---------- aktif seans ---------- */

export const sessionKey = (lvl, dayKey) => lvl + ":" + dayKey;

export const todayStr = () =>
  new Date().getFullYear() + "-" +
  String(new Date().getMonth() + 1).padStart(2, "0") + "-" +
  String(new Date().getDate()).padStart(2, "0");

/* adj: yalnızca programdan SAPAN setler. "3. sette 5 kilo düşürdüm"
   ya da "hedef 8'di, 6 çıktı" burada duruyor; sapmayan setin kaydı
   yok, çünkü söyleyeceği bir şey yok. Bu seçim iki işe yarıyor —
   sete dokunmak tek adım olarak kalıyor ve kayıt şişmiyor. */
const blank = () => ({ date: todayStr(), sets: {}, kg: {}, adj: {}, swap: {}, note: "", startedAt: 0 });

export function session(person, lvl, dayKey, create){
  if(!db.active[person]) db.active[person] = {};
  const k = sessionKey(lvl, dayKey);
  let s = db.active[person][k];
  if(!s){
    if(!create) return blank();
    s = blank();
    db.active[person][k] = s;
  }
  /* Hareket değiştirme sonradan geldi; yarım kalmış eski bir seansta
     bu alan yok. Şema sürümü artmıyor — not alanıyla aynı gerekçe,
     alan isteğe bağlı ve eksikliği boş nesneye eşit. */
  if(!s.swap) s.swap = {};
  if(!s.adj) s.adj = {};
  return s;
}

export function clearSession(person, lvl, dayKey){
  if(db.active[person]) delete db.active[person][sessionKey(lvl, dayKey)];
}

/* ---------- geçmiş kaydı ---------- */

/* Bir setin gerçekte ne olduğu. Öntanımlı hâli "hareketin ağırlığı,
   programın hedef tekrarı" — sete dokunmak bunu söylemek demek.
   Kişi başka bir şey yaptıysa adj'de duruyor. */
export function setDetail(s, i, x, kgDefault){
  const a = s.adj && s.adj[i + "-" + x];
  return {
    kg: a && a.kg != null ? a.kg : (kgDefault || ""),
    reps: a && a.reps != null ? a.reps : null
  };
}

export function buildRecord(person, day, s){
  const items = day.ex.map((e, i) => {
    const detay = [];
    for(let x = 0; x < e.sets; x++){
      if(s.sets[i + "-" + x]) detay.push(setDetail(s, i, x, s.kg[i]));
    }
    if(!detay.length) return { n: e.name, done: 0 };

    /* kg alanı en ağır setten geliyor. Eskiden hareket başına tek
       ağırlık vardı ve bu alan onu tutuyordu; şimdi setler ayrışabilse
       de "o gün ne kaldırdın" sorusunun cevabı en ağır settir. Alanın
       kalması eski kayıtlarla yeni kayıtları aynı biçimde okunur
       tutuyor — geçmiş listesi ve ağırlık seyri değişmeden çalışıyor. */
    const enAgir = detay.reduce((a, d) => {
      const v = parseFloat(String(d.kg).replace(",", "."));
      return v > a.v ? { v, kg: d.kg } : a;
    }, { v: -1, kg: s.kg[i] || "" });

    const it = { n: e.name, done: detay.length, total: e.sets,
                 reps: e.reps, kg: enAgir.kg };

    /* Set dökümü ancak düz alanların söylemediği bir şey varsa
       yazılıyor: hepsi aynı ağırlıkta ve tekrarı girilmemişse
       eklenecek bilgi yok, boş not gibi kayda hiç girmiyor. */
    const ayrisan = detay.some(d => d.reps != null || d.kg !== enAgir.kg);
    if(ayrisan) it.sets = detay;
    return it;
  }).filter(it => it.done > 0);

  const rec = {
    ts: s.startedAt || new Date(s.date + "T18:00:00").getTime(),
    person,
    level: day.program.id,
    day: day.key,
    title: day.short,
    items
  };

  /* Boş not kayda hiç girmesin: geçmişte yer kaplamadığı gibi, notsuz
     kayıtla eskiden yazılmış kayıt da birebir aynı biçimde kalıyor. */
  const note = String(s.note || "").trim();
  if(note) rec.note = note;

  return rec;
}

/* Bir seans gece yarısını geçip açık kaldıysa kaybetme: geçmişe al. */
export function sweepStale(resolveDay){
  const today = todayStr();
  Object.keys(db.active).forEach(pk => {
    Object.keys(db.active[pk]).forEach(k => {
      const s = db.active[pk][k];
      if(!s || s.date === today) return;
      if(Object.keys(s.sets || {}).length > 0){
        const [lvl, dayKey] = k.split(":");
        const day = resolveDay(+lvl, dayKey);
        /* Değiştirilmiş hareket burada da uygulanmalı: gece yarısını
           geçen seans geçmişe gerçekten yaptığın hareketin adıyla
           girsin, programda yazan adla değil. */
        if(day) db.history.push(buildRecord(pk, applySwaps(day, s.swap), s));
      }
      delete db.active[pk][k];
    });
  });
  save();
}

/* Bir hareketin bu kişideki son kaydı — seviyeden bağımsız, çünkü
   aynı hareket birden çok programda geçebiliyor. */
/* Bir hareketin bu kişideki en iyi ağırlığı. Rekoru tam o anda —
   ağırlığı yazıp ilk seti işaretlediğinde — söyleyebilmek için.
   Vücut ağırlığı hareketlerinde kilo diye bir şey yok, 0 dönüyor.

   trends() de aynı sayıyı hesaplıyor ama bütün geçmişi hareket
   hareket topluyor; salonda tek bir hareket için tüm listeyi kurmak
   gereksiz iş. */
export function bestFor(person, exName){
  const e = EXERCISES[exName] || Object.values(EXERCISES).find(x => x.name === exName);
  if(e && e.bw) return 0;
  let best = 0;
  db.history.forEach(h => {
    if(h.person !== person) return;
    (h.items || []).forEach(it => {
      if(it.n !== exName || !it.done) return;
      const kg = parseFloat(String(it.kg).replace(",", "."));
      if(kg > best) best = kg;
    });
  });
  return best;
}

export function lastFor(person, exName){
  for(let i = db.history.length - 1; i >= 0; i--){
    const h = db.history[i];
    if(h.person !== person) continue;
    const it = (h.items || []).find(x => x.n === exName && x.kg);
    if(it) return { kg: it.kg, ts: h.ts, done: it.done, total: it.total };
  }
  return null;
}
