/* ============================================================
   Antrenman ekranı — yatay sayfalayıcı, ekranda bir hareket.

   Aktif seansta dikey kaydırma yoktur: her hareket tam ekran bir
   sayfadır, setler başparmağın ulaştığı alt üçtedir. Sayfa geçişi
   CSS scroll-snap ile olur, JS yalnızca hangi sayfada olduğumuzu
   izler ve gerektiğinde kaydırır.
   ============================================================ */

import { $, esc, num, buzz, toast } from "../dom.js";
import { db, save, session, clearSession, buildRecord, lastFor, profile } from "../store.js";
import { programDay, totalSets, estimateMinutes, program } from "../data/programs.js";
import { openSheet } from "../ui/sheet.js";
import { startTimer, hideTimer, unlockAudio, keepAwake, releaseAwake } from "../ui/timer.js";
import { go } from "../ui/router.js";
import { videoFor } from "../data/videos.js";
import { warmupFor, cooldown, warmMove } from "../data/warmup.js";

let pager, day, pageIx = 0, rafPending = false;
let onSessionSaved = () => {};

export const currentDay = () => day;

/* ---------- bağlam ---------- */

export function setDay(dayIndex){
  const lvl = profile().level;
  day = programDay(lvl, dayIndex);
  document.documentElement.dataset.day = String(day.index);
  return day;
}

const cur = () => session(db.person, day.program.id, day.key, false);
const curW = () => session(db.person, day.program.id, day.key, true);

/* ---------- gün seçici ---------- */

function renderDays(){
  const p = day.program;
  $("days").innerHTML = p.days.map((d, i) => {
    const s = session(db.person, p.id, d.key, false);
    const started = Object.keys(s.sets).length > 0;
    return '<button data-day="' + i + '" aria-pressed="' + (i === day.index) + '" ' +
      'aria-label="' + esc(d.title) + '">' +
      '<b>' + esc(d.key) + '</b>' +
      (started ? '<i class="dot" aria-hidden="true"></i>' : '') +
      '</button>';
  }).join("");
}

/* ---------- "geçen sefer" satırı ---------- */

function hintHTML(e, i, s){
  if(e.bw) return "Süreyi tut, formu bozma";
  const prev = lastFor(db.person, e.name);
  if(!prev) return 'Başlangıç önerisi <b>' + esc(e.start[db.person]) + '</b>';

  const now = parseFloat(String(s.kg[i] || "").replace(",", "."));
  const old = parseFloat(String(prev.kg).replace(",", "."));
  let delta = "";
  if(!isNaN(now) && !isNaN(old) && now !== old){
    const diff = Math.round((now - old) * 10) / 10;
    delta = '<span class="delta ' + (diff > 0 ? "up" : "down") + '">' +
            (diff > 0 ? "+" : "") + num(diff) + ' kg</span>';
  }
  return 'Geçen sefer <b>' + esc(prev.kg) + ' kg</b> · ' + prev.done + '/' + prev.total + ' set' + delta;
}

/* Ağırlık değişince yalnızca o satırı tazele — sayfalayıcıyı yeniden kurma,
   yoksa kullanıcı yazarken sayfa altından kayar. */
function paintHint(i){
  const el = document.querySelector("#ex-" + i + " .plast");
  if(el) el.innerHTML = hintHTML(day.ex[i], i, cur());
}

/* ---------- sayfaları kur ---------- */

export function render(){
  const s = cur();
  const p = day.program;

  renderDays();
  renderWarm();
  $("h-kicker").textContent = p.id + ". " + p.name + " · " + day.key + " günü";
  $("h-title").textContent = day.title;
  $("h-desc").textContent = day.desc;
  $("h-dur").textContent = estimateMinutes(day) + " dk";
  $("h-count").textContent = day.ex.length;
  $("h-sets").textContent = totalSets(day);

  pager.querySelectorAll(".page.dyn").forEach(el => el.remove());

  const html = day.ex.map((e, i) => {
    const setBtns = Array.from({ length: e.sets }, (_, x) => {
      const k = i + "-" + x;
      return '<button class="setbtn" data-set="' + k + '" data-ex="' + i + '" ' +
        'aria-pressed="' + (s.sets[k] ? "true" : "false") + '" aria-label="' + (x + 1) + '. set">' +
        (x + 1) + '</button>';
    }).join("");

    const weight = e.bw
      ? '<div class="bwnote">Vücut ağırlığı — ek yük yok</div>'
      : '<div class="kgbig">' +
          '<button type="button" data-step="' + i + '" data-dir="-1" aria-label="Ağırlığı azalt">−</button>' +
          '<span class="kgval">' +
            '<input class="kg" type="text" inputmode="decimal" placeholder="—" ' +
              'aria-label="Kullandığın ağırlık" data-kg="' + i + '" value="' + esc(s.kg[i] || "") + '">' +
            '<span class="kgunit">kg</span>' +
          '</span>' +
          '<button type="button" data-step="' + i + '" data-dir="1" aria-label="Ağırlığı artır">+</button>' +
        '</div>';

    return '<section class="page dyn" data-ix="' + i + '" id="ex-' + i + '" aria-label="' + esc(e.name) + '">' +
      '<div class="peyebrow"><b>' + String(i + 1).padStart(2, "0") + '</b> / ' +
        String(day.ex.length).padStart(2, "0") +
        ' <span aria-hidden="true">·</span> ' + esc(e.target) + '</div>' +
      '<h2 class="pname">' + esc(e.name) + '</h2>' +
      '<p class="palt">' + esc(e.alt) + '</p>' +
      '<div class="pmeta">' +
        '<div><b>' + e.sets + ' × ' + esc(e.reps) + '</b><span>Set × tekrar</span></div>' +
        '<div><b>' + e.rest + ' sn</b><span>Dinlenme</span></div>' +
      '</div>' +
      '<div class="plast">' + hintHTML(e, i, s) + '</div>' +
      '<ul class="pcues">' + e.cues.slice(0, 3).map(c => "<li>" + esc(c) + "</li>").join("") + '</ul>' +
      '<div class="pspacer"></div>' +
      '<div class="pctl"><p class="plabel">Ağırlık</p>' + weight + '</div>' +
      '<div class="pctl"><p class="plabel">Setler · son 2 tekrar zorlansın</p>' +
        '<div class="setrow-big">' + setBtns + '</div></div>' +
      '<button type="button" class="techrow" data-tech="' + i + '">Teknik, sık hata ve video</button>' +
    '</section>';
  }).join("");

  $("page-finish").insertAdjacentHTML("beforebegin", html);
  refresh();
}

/* Her dokunuşta güncellenen hafif kısım: ray, ilerleme çubuğu, bitiş sayfası. */
export function refresh(){
  const s = cur();
  let done = 0, total = 0, exDone = 0;
  const rail = [];

  day.ex.forEach((e, i) => {
    let n = 0;
    const cells = [];
    for(let x = 0; x < e.sets; x++){
      const on = !!s.sets[i + "-" + x];
      if(on) n++;
      cells.push('<i class="' + (on ? "on" : "") + '"></i>');
    }
    done += n; total += e.sets;
    if(n === e.sets) exDone++;
    rail.push('<button class="railgroup" style="flex:' + e.sets + '" data-jump="' + i +
              '" aria-label="' + esc(e.name) + ', ' + n + '/' + e.sets + ' set">' + cells.join("") + '</button>');
    const pg = $("ex-" + i);
    if(pg) pg.classList.toggle("done", n === e.sets);
  });

  /* Rayın sonundaki bitiş segmenti: seansı kaydetmek için bütün
     hareketleri kaydırarak geçmek gerekmesin. */
  rail.push(
    '<button class="railgroup railend" data-jump="end" aria-label="Seansı bitir">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7"/></svg>' +
    '</button>'
  );

  $("rail").innerHTML = rail.join("") + '<span class="railcount"><b>' + done + '</b>/' + total + '</span>';
  markRail();

  $("h-bar").style.width = (total ? done / total * 100 : 0) + "%";
  $("h-prog").textContent =
    done === 0 ? "Henüz başlamadın" :
    done === total ? "Tamamlandı, seansı kaydet" :
    done + " / " + total + " set bitti";
  $("begin").textContent = done === 0 ? "Antrenmana başla" : "Antrenmana devam et";
  /* Bitiş yalnızca kaydedilecek bir şey varken anlamlı. */
  $("tofinish").hidden = done === 0;

  $("f-sets").textContent = done + "/" + total;
  $("f-ex").textContent = exDone + "/" + day.ex.length;
  $("f-title").textContent = done === total && total > 0 ? "Hepsi bitti" : "Seansı kaydet";
  $("finish").disabled = done === 0;
}

/* ---------- sayfalayıcı ---------- */

const pageCount = () => pager.querySelectorAll(".page").length;

function markRail(){
  $("rail").querySelectorAll(".railgroup")
    .forEach((g, i) => g.classList.toggle("now", i === pageIx - 1));
}

export function goPage(i, instant){
  i = Math.max(0, Math.min(pageCount() - 1, i));
  pager.scrollTo({ left: i * pager.clientWidth, behavior: instant ? "auto" : "smooth" });
  pageIx = i;
  markPage();
  markRail();
}

/* Başlıktaki geri düğmesi buna bakıyor. */
function markPage(){
  document.body.dataset.page = pageIx > 0 ? "ex" : "start";
}

export const atPage = () => pageIx;

/* ---------- dinlenme kutusundaki "sırada ne var" ---------- */

function nextUp(exIndex){
  const s = cur(), e = day.ex[exIndex];
  for(let x = 0; x < e.sets; x++) if(!s.sets[exIndex + "-" + x]) return (x + 1) + ". set sırada";
  for(let i = exIndex + 1; i < day.ex.length; i++){
    for(let x = 0; x < day.ex[i].sets; x++) if(!s.sets[i + "-" + x]) return "Sırada: " + day.ex[i].name;
  }
  return "Son set bitti, seansı kaydet";
}

/* ---------- teknik paneli ---------- */

/* Panelin gövdesi. Antrenman hareketi de ısınma hareketi de aynı üç
   soruyu cevaplıyor, o yüzden kalıp ortak. */
function techBody(m, v){
  return '<div class="exbody">' +
    '<h4>Neden bu hareket</h4><p class="why">' + esc(m.why) + '</p>' +
    '<h4>Nasıl yapılır</h4><ol>' + m.cues.map(c => "<li>" + esc(c) + "</li>").join("") + '</ol>' +
    '<div class="warnbox"><b>En sık hata.</b> ' + esc(m.mistake) + '</div>' +
    (v
      ? '<div class="videoslot" data-vid="' + esc(v.id) + '">' +
          '<button type="button" class="vbtn">' +
            '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Tekniği izle</button>' +
          '<p class="vmeta">' + esc(v.channel) + '</p>' +
        '</div>'
      : m.noVideo
        ? ''
        : '<p class="note" style="margin-top:14px">Bu hareket için seçilmiş bir video henüz yok.</p>') +
  '</div>';
}

function openTech(i){
  const e = day.ex[i];
  openSheet({
    title: e.name,
    sub: e.alt + " · " + e.target,
    html: techBody(e, videoFor(e.id))
  });
}

/* ---------- ısınma ve soğuma ---------- */

/* Her satır düğme: videosu olmayanın da anlatacak bir şeyi var,
   hepsi aynı paneli açıyor. */
function warmHTML(list){
  return list.map(m =>
    '<li><button type="button" data-warm="' + esc(m.id) + '">' +
      '<span class="t">' + esc(m.dose) + '</span>' +
      '<span>' + esc(m.name) + '<span class="sub">' + esc(m.sub) + '</span></span>' +
    '</button></li>'
  ).join("");
}

/* "Günün ilk hareketi" satırı hangi hareket olduğunu söylesin —
   program değiştiğinde metin kendiliğinden doğru kalır. */
const firstMoveName = () => (day.ex[0] ? day.ex[0].name : "");

function renderWarm(){
  $("warm").innerHTML = warmHTML(warmupFor(day).map(m =>
    m.id === "first-move" && firstMoveName() ? { ...m, sub: firstMoveName() + " · sayılmaz" } : m
  ));
}

/* Soğuma tek panelde, üç hareket art arda: bitiş sayfasında liste
   olarak duracak yer yok, üç ayrı panel de gereksiz gidiş geliş. */
function openCool(){
  openSheet({
    title: "Soğuma",
    sub: "Seansı kaydetmeden önce 5 dakika",
    html: cooldown().map(m =>
      '<div class="coolpart">' +
        '<h3><span class="t">' + esc(m.dose) + '</span>' + esc(m.name) + '</h3>' +
        techBody(m, videoFor(m.id)) +
      '</div>'
    ).join("")
  });
}

function openWarm(id){
  const m = warmMove(id);
  if(!m) return;
  const sub = id === "first-move" && firstMoveName() ? firstMoveName() : m.sub;
  openSheet({
    title: m.name,
    sub: m.dose + " · " + sub,
    html: techBody(m, videoFor(id))
  });
}

/* ---------- seans kaydı ---------- */

function summaryText(){
  const s = cur();
  const date = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
  let out = day.program.name + " · " + day.key + " günü · " + date + "\n";
  let any = false;
  day.ex.forEach((e, i) => {
    let n = 0;
    for(let x = 0; x < e.sets; x++) if(s.sets[i + "-" + x]) n++;
    if(!n) return;
    any = true;
    const w = s.kg[i];
    out += "• " + e.name + " — " + n + "/" + e.sets + " set × " + e.reps + (w ? " @ " + w + " kg" : "") + "\n";
  });
  return any ? out : null;
}

function finishSession(){
  const s = cur();
  const done = Object.keys(s.sets).length;
  if(!done) return;

  const rec = buildRecord(db.person, day, s);
  if(s.startedAt) rec.dur = Math.max(1, Math.round((Date.now() - s.startedAt) / 60000));
  db.history.push(rec);
  clearSession(db.person, day.program.id, day.key);
  save();

  releaseAwake();
  hideTimer();
  render();
  onSessionSaved();

  goPage(0, true);
  buzz([30, 60, 30, 60, 90]);
  $("veil-sub").textContent = done + " set" + (rec.dur ? " · " + rec.dur + " dakika" : "") + " · kaydedildi";
  $("veil").classList.add("on");
  setTimeout(() => { $("veil").classList.remove("on"); go("gecmis"); }, 1900);
}

/* Yanlışlıkla başlatılan ya da yarıda bırakılacak seansı temizler.
   Geçmişe hiçbir şey yazmaz — kaydedilecek bir seans değil zaten. */
function discardSession(){
  const s = cur();
  if(!Object.keys(s.sets).length && !Object.keys(s.kg).length){
    goPage(0);
    return;
  }
  if(!confirm("Bu seansta işaretlediklerin silinsin mi? Geçmişe kaydedilmeyecek.")) return;

  clearSession(db.person, day.program.id, day.key);
  save();
  releaseAwake();
  hideTimer();
  render();
  goPage(0, true);
  toast("Seans silindi");
}

/* ---------- kurulum ---------- */

export function initWorkout(hooks){
  pager = $("pager");
  onSessionSaved = hooks.onSessionSaved || (() => {});

  pager.addEventListener("scroll", () => {
    if(rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const w = pager.clientWidth;
      if(!w) return;
      const i = Math.round(pager.scrollLeft / w);
      if(i !== pageIx){ pageIx = i; markPage(); markRail(); }
    });
  });

  pager.addEventListener("click", ev => {
    const sb = ev.target.closest(".setbtn");
    if(sb) return toggleSet(sb);

    const step = ev.target.closest("[data-step]");
    if(step) return stepWeight(+step.dataset.step, +step.dataset.dir);

    const tb = ev.target.closest("[data-tech]");
    if(tb) return openTech(+tb.dataset.tech);

    const wb = ev.target.closest("[data-warm]");
    if(wb) openWarm(wb.dataset.warm);
  });

  pager.addEventListener("input", ev => {
    if(!ev.target.classList.contains("kg")) return;
    curW().kg[ev.target.dataset.kg] = ev.target.value;
    save();
    paintHint(+ev.target.dataset.kg);
  });

  $("begin").onclick = () => goPage(1);
  $("tofinish").onclick = () => goPage(pageCount() - 1);
  $("tocool").onclick = openCool;
  $("finish").onclick = finishSession;
  $("share").onclick = share;
  $("discard").onclick = discardSession;

  $("back").onclick = () => { buzz(10); goPage(0); };

  $("rail").addEventListener("click", ev => {
    const g = ev.target.closest("[data-jump]");
    if(!g) return;
    goPage(g.dataset.jump === "end" ? pageCount() - 1 : +g.dataset.jump + 1);
  });

  $("days").addEventListener("click", ev => {
    const b = ev.target.closest("[data-day]");
    if(!b || +b.dataset.day === day.index) return;
    hideTimer();
    setDay(+b.dataset.day);
    render();
    goPage(0, true);
  });

  window.addEventListener("resize", () => goPage(pageIx, true));
  window.addEventListener("orientationchange", () => setTimeout(() => goPage(pageIx, true), 250));
}

function toggleSet(sb){
  unlockAudio();
  const s = curW(), k = sb.dataset.set, ix = +sb.dataset.ex;
  const wasOn = sb.getAttribute("aria-pressed") === "true";

  if(wasOn){
    delete s.sets[k];
    sb.setAttribute("aria-pressed", "false");
    hideTimer();
    save(); refresh();
    return;
  }

  if(!s.startedAt) s.startedAt = Date.now();
  s.sets[k] = 1;
  sb.setAttribute("aria-pressed", "true");
  buzz(18);
  keepAwake();

  const e = day.ex[ix];
  startTimer(e.rest, e.name, nextUp(ix));
  save(); refresh();

  /* Hareket bittiyse kendiliğinden sıradakine geç — elle kaydırma derdi olmasın.
     Kullanıcı bu arada başka sayfaya kaydıysa karışma. */
  let all = true;
  for(let x = 0; x < e.sets; x++) if(!s.sets[ix + "-" + x]) all = false;
  if(all && pageIx === ix + 1){
    setTimeout(() => { if(pageIx === ix + 1) goPage(ix + 2); }, 700);
  }
}

function stepWeight(i, dir){
  const inp = pager.querySelector('[data-kg="' + i + '"]');
  const inc = day.ex[i].step || 2.5;
  let v = parseFloat(String(inp.value).replace(",", "."));
  if(isNaN(v)) v = dir > 0 ? inc : 0;
  else v = Math.max(0, Math.round((v + dir * inc) * 10) / 10);
  inp.value = num(v);
  curW().kg[i] = inp.value;
  buzz(8);
  save();
  paintHint(i);
}

async function share(){
  const text = summaryText();
  if(!text) return toast("Önce birkaç set işaretle");
  try{
    if(navigator.share) return await navigator.share({ text });
    await navigator.clipboard.writeText(text);
    toast("Özet panoya kopyalandı");
  }catch(e){
    if(e && e.name === "AbortError") return;
    toast("Paylaşılamadı");
  }
}

/* Yarım kalan seans varsa o günü, yoksa sıradaki günü öner. */
export function suggestDay(){
  const p = program(profile().level);
  const bag = db.active[db.person] || {};

  for(let i = 0; i < p.days.length; i++){
    const s = bag[p.id + ":" + p.days[i].key];
    if(s && Object.keys(s.sets || {}).length) return i;
  }

  const last = db.history
    .filter(h => h.person === db.person && h.level === p.id)
    .sort((a, b) => b.ts - a.ts)[0];
  if(!last) return 0;

  const ix = p.days.findIndex(d => d.key === last.day);
  return ix < 0 ? 0 : (ix + 1) % p.days.length;
}

/* Yarım kalan seansta ilk bitmemiş harekete atla. */
export function resumeWhereLeftOff(){
  const s = cur();
  if(!Object.keys(s.sets).length) return;
  for(let i = 0; i < day.ex.length; i++){
    for(let x = 0; x < day.ex[i].sets; x++){
      if(!s.sets[i + "-" + x]) return goPage(i + 1, true);
    }
  }
  goPage(pageCount() - 1, true);
}
