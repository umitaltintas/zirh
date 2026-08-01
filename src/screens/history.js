/* Geçmiş — seans kayıtları, özet sayılar ve hareket başına ilerleme. */

import { $, esc, num, toast, trDate } from "../dom.js";
import { db, save, PEOPLE } from "../store.js";
import { program } from "../data/programs.js";
import { trends, deload, weekly, GROUPS } from "../progress.js";
import { sparkHTML } from "../ui/spark.js";

export function renderHistory(){
  const mine = db.history.filter(h => h.person === db.person).sort((a, b) => b.ts - a.ts);
  const now = new Date();

  $("g-who").textContent = PEOPLE[db.person].label;
  $("g-total").textContent = mine.length;
  $("g-month").textContent = mine.filter(h => {
    const d = new Date(h.ts);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if(mine.length){
    const days = Math.floor((Date.now() - mine[0].ts) / 86400000);
    $("g-last").textContent = days === 0 ? "Bugün" : days === 1 ? "Dün" : days + " gün";
  }else{
    $("g-last").textContent = "—";
  }

  renderWeekly();
  renderTrends();
  renderList(mine);
}

/* ---------- haftalık denge ---------- */

/* Çubuklar birbirine göre ölçekleniyor, mutlak bir hedefe göre değil:
   "haftada kaç set" sorusunun tek doğru cevabı yok ve olmayan bir
   hedefi çizmek uydurma olurdu. Gösterilen şey oran — hangi kalıp
   diğerlerinin önüne geçmiş. */
function renderWeekly(){
  const w = weekly(db.history, db.person);
  const box = $("g-week");

  if(!w.total){
    box.innerHTML = '<p class="note" style="margin:0">Son yedi günde kayıtlı set yok. ' +
      'Bir seans bitirdiğinde hangi kalıba ne kadar çalıştığın burada görünecek.</p>';
    return;
  }

  const max = Math.max(...w.groups.map(g => g.sets));
  const bars = w.groups.map(g =>
    '<div class="wgrow' + (w.note && g.key === w.note.less ? " low" : "") + '">' +
      '<span class="wgn">' + esc(g.label) + '</span>' +
      '<span class="wgbar"><i style="width:' +
        (max ? Math.round(g.sets / max * 100) : 0) + '%"></i></span>' +
      '<span class="wgv">' + g.sets + '</span>' +
    '</div>'
  ).join("");

  const label = k => (GROUPS.find(g => g.key === k) || {}).label.toLocaleLowerCase("tr");

  /* Uyarı değil öneri: ne olduğunu söyler, ne yapılacağını yazar.
     Rakamı da yazıyor, çünkü "dengesiz" demek tek başına ölçüsüz. */
  const note = w.note
    ? '<p class="tnote">Bu hafta ' + w.note.hi + ' set ' + esc(label(w.note.more)) +
      ', ' + w.note.lo + ' set ' + esc(label(w.note.less)) + '. ' + esc(w.note.why) +
      ' Sıradaki seansta ' + esc(label(w.note.less)) + ' hareketlerini atlama.</p>'
    : '';

  box.innerHTML =
    '<p class="wgtop">Son 7 gün · <b>' + w.sessions + '</b> seans, <b>' + w.total + '</b> set</p>' +
    bars + note;
}

/* ---------- hareket başına ilerleme ---------- */

/* Plato metni Rehber'in 2. ve 3. kurallarının aynısını söyler, tek
   farkı hareketin adını ve rakamı bilmesi. Uyarı değil öneri: ne
   olduğunu söyler, ne yapılacağını yazar, suçlamaz. */
function plateauText(t){
  return "Son üç seansta ağırlık artmadı. Aynı ağırlıkla bir tekrar fazlasını dene; " +
         "o da gelmiyorsa " + num(deload(t.name, t.last.kg)) +
         " kg'a inip birkaç seansta yeniden tırman.";
}

/* Eski "En iyi ağırlıklar" tablosunun yerine geçiyor. Tablo hareket
   başına tek sayı gösteriyordu ve o sayı zaten grafiğin en yüksek
   noktası; ikisini yan yana koymak aynı rakamı iki kez yazmak olurdu.
   En iyi ağırlık kayboluyor değil, grafiğin altına iniyor. */
function renderTrends(){
  const list = trends(db.history, db.person);

  if(!list.length){
    $("g-pr").innerHTML = '<p class="note" style="margin:0">Ağırlık girdiğin seanslar burada birikecek.</p>';
    return;
  }

  const rows = list.map(t => {
    const kgs = t.points.map(p => p.kg);
    /* Tek kayıtta "1 seans · en iyi 60 kg" demek yok: sayı zaten
       başlıkta duruyor, "en iyi"nin karşılaştıracağı bir şey yok.
       İkisi de düşerse alt satır hiç kurulmaz, boş şerit kalmasın. */
    const foot =
      (kgs.length > 1
        ? '<span>' + kgs.length + ' seans · en iyi <b>' + num(t.best) + ' kg</b></span>'
        : "") +
      (t.e1rm ? '<span class="t1rm">1RM ≈ <b>' + t.e1rm + ' kg</b></span>' : "");

    return '<div class="trend">' +
      '<div class="trendtop">' +
        '<span class="tn">' + esc(t.name) + '</span>' +
        '<span class="tv">' + num(t.last.kg) + ' kg</span>' +
      '</div>' +
      /* Tek noktanın seyri yok: çizgi çizmek yerine neden çizilmediğini
         söylüyoruz, boş bir kutu bırakmaktansa. */
      (kgs.length < 2
        ? '<p class="tsolo">Tek kayıt — seyrin görünmesi için birkaç seans daha gerek.</p>'
        : sparkHTML(kgs)) +
      (foot ? '<div class="tfoot">' + foot + '</div>' : "") +
      (t.plateau ? '<p class="tnote">' + esc(plateauText(t)) + '</p>' : '') +
    '</div>';
  }).join("");

  /* 1RM'in ne olduğu bir kez, listenin altında anlatılıyor: her satıra
     "tahmini" yazmak hem yer yiyor hem okunmaz hâle geliyordu. */
  const about = list.some(t => t.e1rm)
    ? '<p class="tabout">1RM ≈ tek tekrarda kaldırabileceğin <b>tahmini</b> ağırlık. ' +
      'En iyi setinden Epley formülüyle hesaplanır ve programdaki en düşük tekrar ' +
      'sayısını varsayar. Denemek için değil, ilerlemeyi karşılaştırmak için.</p>'
    : "";

  $("g-pr").innerHTML = rows + about;
}

function renderList(mine){
  if(!mine.length){
    $("g-list").innerHTML =
      '<div class="empty"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>' +
      '<p>Henüz kayıt yok. İlk seansını bitirip <b>Seansı kaydet</b> dediğinde burada görünecek.</p></div>';
    return;
  }

  $("g-list").innerHTML = mine.map(h => {
    const when = trDate(h.ts, { day: "numeric", month: "long" }) + " " +
                 trDate(h.ts, { weekday: "long" });
    const sets = (h.items || []).reduce((a, it) => a + it.done, 0);
    const p = program(h.level);
    return '<div class="hcard">' +
      '<div class="hhead">' +
        '<span class="badge" data-lvl="' + (h.level || 1) + '">' + esc(h.day) + '</span>' +
        '<span class="when">' + esc(when) + '</span>' +
        '<span class="sets">' + sets + ' set' + (h.dur ? ' · ' + h.dur + ' dk' : '') + '</span>' +
      '</div>' +
      '<p class="hsub">' + esc(p.name) + (h.title ? ' · ' + esc(h.title) : '') + '</p>' +
      (h.items || []).map(it =>
        '<div class="hitem"><span class="n">' + esc(it.n) + '</span>' +
        '<span class="v">' + it.done + '/' + it.total + (it.kg ? " · " + esc(it.kg) + " kg" : "") + '</span></div>'
      ).join("") +
      /* Notu olmayan kayıt — eski kayıtların hepsi öyle — hiç satır açmaz. */
      (h.note ? '<p class="hnote">' + esc(h.note) + '</p>' : '') +
    '</div>';
  }).join("");
}

export function wipeHistory(onDone){
  if(!confirm(PEOPLE[db.person].label + " programındaki tüm seans kayıtları silinsin mi? Bu geri alınamaz.")) return;
  db.history = db.history.filter(h => h.person !== db.person);
  save();
  renderHistory();
  onDone();
  toast("Kayıtlar silindi");
}
