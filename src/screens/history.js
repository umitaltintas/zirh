/* Geçmiş — seans kayıtları, özet sayılar ve hareket başına ilerleme. */

import { $, esc, num, toast, trDate } from "../dom.js";
import { db, save, PEOPLE } from "../store.js";
import { program } from "../data/programs.js";
import { trends, deload } from "../progress.js";

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

  renderTrends();
  renderList(mine);
}

/* ---------- hareket başına ilerleme ---------- */

/* Sparkline sabit bir viewBox'a çizilir, genişliğe CSS uydurur:
   ölçü hesabı tek yerde kalır ve çizgi kalınlığı ekranla birlikte
   oransal büyür. Eksen etiketi yok — telefonda kalabalık yapıyor ve
   okunmuyor; anlamlı sayılar zaten grafiğin üstünde ve altında
   yazılı. Grafiğin işi rakam vermek değil, şekli göstermek. */
const SW = 240, SH = 44, PAD = 5;

const r1 = n => Math.round(n * 10) / 10;

function sparkHTML(kgs){
  const lo = Math.min(...kgs), hi = Math.max(...kgs);
  const inner = SH - PAD * 2;
  const x = i => PAD + i * (SW - PAD * 2) / (kgs.length - 1);
  /* Bütün kayıtlar aynı ağırlıktaysa aralık sıfır — çizgi ortadan
     düz geçsin, sıfıra bölme olmasın. */
  const y = v => hi === lo ? SH / 2 : PAD + inner - (v - lo) / (hi - lo) * inner;

  const pts = kgs.map((v, i) => r1(x(i)) + "," + r1(y(v)));
  const area = "M" + pts.join(" L") +
               " L" + r1(SW - PAD) + "," + SH + " L" + PAD + "," + SH + " Z";
  /* Nokta sayısı arttıkça işaretçiler çizgiyi yiyor; kalabalıkta
     yalnızca çizgi ve son nokta kalır. */
  const dots = kgs.length <= 10
    ? kgs.map((v, i) => '<circle class="pt" cx="' + r1(x(i)) + '" cy="' + r1(y(v)) + '" r="2.4"/>').join("")
    : "";

  return '<svg class="spark" viewBox="0 0 ' + SW + ' ' + SH + '" role="img" ' +
      'aria-label="Ağırlık seyri: ' + esc(kgs.map(num).join(", ")) + ' kg">' +
      '<path class="area" d="' + area + '"/>' +
      '<polyline class="line" points="' + pts.join(" ") + '"/>' + dots +
      '<circle class="now" cx="' + r1(x(kgs.length - 1)) + '" ' +
        'cy="' + r1(y(kgs[kgs.length - 1])) + '" r="3.4"/>' +
    '</svg>';
}

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
