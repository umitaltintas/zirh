/* Geçmiş — seans kayıtları, özet sayılar ve kişisel rekorlar. */

import { $, esc, num, toast, trDate } from "../dom.js";
import { db, save, PEOPLE } from "../store.js";
import { program } from "../data/programs.js";

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

  renderBests(mine);
  renderList(mine);
}

function renderBests(mine){
  const best = {};
  mine.forEach(h => (h.items || []).forEach(it => {
    const v = parseFloat(String(it.kg).replace(",", "."));
    if(isNaN(v)) return;
    if(!best[it.n] || v > best[it.n].v) best[it.n] = { v, ts: h.ts };
  }));

  const names = Object.keys(best);
  $("g-pr").innerHTML = names.length
    ? '<table class="tbl"><tr><th>Hareket</th><th>En iyi</th></tr>' +
      names.sort((a, b) => best[b].ts - best[a].ts)
        .map(n => '<tr><td>' + esc(n) + '</td><td>' + num(best[n].v) + ' kg</td></tr>').join("") +
      '</table>'
    : '<p class="note" style="margin:0">Ağırlık girdiğin seanslar burada birikecek.</p>';
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
