/* ============================================================
   Kalıcı kayıt.

   Tek kaynak: tarayıcının localStorage'ı. Hiçbir veri dışarı gitmez.
   Uygulamanın adı ve veri şeması zaman içinde değişti; buradaki
   göçler eski kayıtların kaybolmamasını sağlıyor.
   ============================================================ */

import { PROGRAMS, DEFAULT_LEVEL } from "./data/programs.js";

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
  active: {},    /* [person]["<seviye>:<gün>"] = {date, sets, kg, note, startedAt} */
  profile: {},   /* [person] = {h, w, goal, level} */
  history: []    /* [{ts, person, level, day, title, dur, items, note?}] */
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

/* ---------- aktif seans ---------- */

export const sessionKey = (lvl, dayKey) => lvl + ":" + dayKey;

export const todayStr = () =>
  new Date().getFullYear() + "-" +
  String(new Date().getMonth() + 1).padStart(2, "0") + "-" +
  String(new Date().getDate()).padStart(2, "0");

const blank = () => ({ date: todayStr(), sets: {}, kg: {}, note: "", startedAt: 0 });

export function session(person, lvl, dayKey, create){
  if(!db.active[person]) db.active[person] = {};
  const k = sessionKey(lvl, dayKey);
  let s = db.active[person][k];
  if(!s){
    if(!create) return blank();
    s = blank();
    db.active[person][k] = s;
  }
  return s;
}

export function clearSession(person, lvl, dayKey){
  if(db.active[person]) delete db.active[person][sessionKey(lvl, dayKey)];
}

/* ---------- geçmiş kaydı ---------- */

export function buildRecord(person, day, s){
  const items = day.ex.map((e, i) => {
    let done = 0;
    for(let x = 0; x < e.sets; x++) if(s.sets[i + "-" + x]) done++;
    return { n: e.name, done, total: e.sets, reps: e.reps, kg: (s.kg[i] || "") };
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
        if(day) db.history.push(buildRecord(pk, day, s));
      }
      delete db.active[pk][k];
    });
  });
  save();
}

/* Bir hareketin bu kişideki son kaydı — seviyeden bağımsız, çünkü
   aynı hareket birden çok programda geçebiliyor. */
export function lastFor(person, exName){
  for(let i = db.history.length - 1; i >= 0; i--){
    const h = db.history[i];
    if(h.person !== person) continue;
    const it = (h.items || []).find(x => x.n === exName && x.kg);
    if(it) return { kg: it.kg, ts: h.ts, done: it.done, total: it.total };
  }
  return null;
}
