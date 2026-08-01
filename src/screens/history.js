/* Geçmiş — seans kayıtları, özet sayılar ve hareket başına ilerleme. */

import { $, esc, num, numOr0, toast, trDate } from "../dom.js";
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
  renderCalendar(mine);
  renderTrends();
  renderList(mine);
}

/* ---------- takvim ---------- */

/* "Düzenli miyim" sorusunun cevabı listede var ama okunmuyor: on iki
   kartı tarayıp aralarındaki boşlukları kafada hesaplamak gerekiyor.
   Izgara aynı veriyi tek bakışta veriyor.

   Sekiz hafta gösteriliyor, takvim ayı değil. Ay ızgarası ayın
   birinde neredeyse boş kalıyor ve "bu ay az çalıştım" gibi
   görünüyor; oysa geçen haftanın kayıtları hemen yukarıda duruyor.
   Sabit pencere bu yanılmayı ortadan kaldırıyor.

   En uzun ara da yazılıyor: seans sayısı yüksek olup arası açık olan
   biriyle düzenli çalışan biri aynı sayıya sahip olabiliyor. Farkı
   söyleyen şey aralar. */
const HAFTA = 8;

function renderCalendar(mine){
  const box = $("g-cal");
  if(!mine.length){
    box.innerHTML = '<p class="note" style="margin:0">İlk seansından sonra ' +
      'hangi günlerde çalıştığın burada bir ızgarada görünecek.</p>';
    return;
  }

  /* Bugünün haftasının Pazar'ıyla bitiyor; Pazartesi başlangıçlı
     satırlar için gün numarası tr düzenine kaydırılıyor. */
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const kaydir = (bugun.getDay() + 6) % 7;          /* Pazartesi = 0 */
  const son = new Date(bugun);
  son.setDate(son.getDate() + (6 - kaydir));

  const gunler = [];
  for(let i = HAFTA * 7 - 1; i >= 0; i--){
    const d = new Date(son);
    d.setDate(d.getDate() - i);
    gunler.push(d);
  }

  const anahtar = d => d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");

  const calisilan = {};
  mine.forEach(h => { calisilan[anahtar(new Date(h.ts))] = h; });

  const hucreler = gunler.map(d => {
    const k = anahtar(d);
    const h = calisilan[k];
    const ileri = d > bugun;
    const cls = "cday" + (h ? " on" : "") + (ileri ? " off" : "") +
                (k === anahtar(bugun) ? " today" : "");
    return '<span class="' + cls + '"' +
      (h ? ' title="' + esc(trDate(h.ts, { day: "numeric", month: "long" }) +
                           " · " + h.title) + '"' : "") +
      '></span>';
  }).join("");

  /* Aralar yalnızca ilk seanstan bugüne kadar sayılıyor: uygulamayı
     kullanmaya başlamadan önceki günler bir "ara" değil. */
  const ts = mine.map(h => h.ts).sort((a, b) => a - b);
  let enUzun = Math.round((Date.now() - ts[ts.length - 1]) / 86400000);
  for(let i = 1; i < ts.length; i++){
    const ara = Math.round((ts[i] - ts[i - 1]) / 86400000);
    if(ara > enUzun) enUzun = ara;
  }

  const sonSekiz = mine.filter(h => h.ts >= gunler[0].getTime()).length;

  box.innerHTML =
    '<div class="cgrid" role="img" aria-label="Son ' + HAFTA +
      ' haftada ' + sonSekiz + ' seans">' + hucreler + '</div>' +
    '<div class="tfoot">' +
      '<span>Son ' + HAFTA + ' hafta · <b>' + sonSekiz + '</b> seans</span>' +
      '<span class="t1rm">en uzun ara <b>' + enUzun + ' gün</b></span>' +
    '</div>';
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

/* Set dökümü yalnızca setler ayrıştığında kaydediliyor; ayrıştığında
   da görünmesi gerekiyor. "60 kg" yazıp son sette 55'e düştüğünü
   saklamak, kaydı olduğundan iyi gösterirdi.

   Tek satır, virgülle: üç sete üç satır açmak geçmiş listesini
   taranamaz hâle getiriyordu. */
function setLine(it){
  if(!Array.isArray(it.sets) || !it.sets.length) return "";
  const parts = it.sets.map(d =>
    (d.kg ? num(numOr0(d.kg)) + " kg" : "") +
    (d.reps != null ? (d.kg ? " × " : "") + d.reps : ""));
  return '<div class="hsets">' + esc(parts.join(" · ")) + '</div>';
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
        '<span class="v">' + it.done + '/' + it.total + (it.kg ? " · " + esc(it.kg) + " kg" : "") + '</span></div>' +
        setLine(it)
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
