/* ============================================================
   Hareket kütüphanesi.

   Kataloğun tamamı — 41 hareketin teknik anlatımı, sık hatası ve
   doğrulanmış videosu — zaten yazılıydı ama yalnızca o gün
   programında varsa görülebiliyordu. Dinlenme gününde "deadlift
   nasıl yapılıyordu" diye bakmanın yolu yoktu.

   Antrenman sekmesine değil Rehber'e konuldu: burası öğrenilecek
   şeylerin yeri, orası yapılacak şeylerin. Ayrı bir sekme açmak da
   alt barı altıya çıkarıp dar telefonda sıkıştırırdı.

   Süzgeçler hareket kalıbına ve alete göre. İkisi de salonda gerçekten
   sorulan sorular: "çekiş için ne var" ve "evde dambılla ne yaparım".
   ============================================================ */

import { $, esc } from "../dom.js";
import { EXERCISES } from "../data/exercises.js";
import { videoFor } from "../data/videos.js";
import { openSheet } from "../ui/sheet.js";
import { techBody } from "../ui/techsheet.js";
import { GROUPS } from "../progress.js";

const GEARS = [
  { key: "bar",    label: "Bar" },
  { key: "dambil", label: "Dambıl" },
  { key: "makine", label: "Makine" },
  { key: "vucut",  label: "Vücut" }
];

/* EZ bar kendi süzgecini hak etmiyor: katalogda tek hareket var ve
   arayan kişi onu "bar" altında bulmayı bekler. */
const gearOf = e => (e.gear === "ez" ? "bar" : e.gear);

let grup = "", alet = "", arama = "";

/* Türkçe arama, aksanlara takılmadan: "gogus" yazan da "göğüs"
   bulsun. toLocaleLowerCase("tr") olmadan "I" harfi yanlış küçülüyor. */
const sadelestir = s => s.toLocaleLowerCase("tr")
  .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
  .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c");

function eslesenler(){
  const q = sadelestir(arama.trim());
  return Object.keys(EXERCISES).map(id => ({ id, ...EXERCISES[id] })).filter(e => {
    if(grup && e.group !== grup) return false;
    if(alet && gearOf(e) !== alet) return false;
    if(!q) return true;
    /* Ad, Türkçe karşılığı ve hedef kas birlikte aranıyor: kimi
       "bench" diye arıyor, kimi "göğüs" diye. */
    return sadelestir(e.name + " " + e.alt + " " + e.target).indexOf(q) > -1;
  });
}

function renderChips(){
  $("lib-groups").innerHTML =
    ['<button class="chip" data-group="" aria-pressed="' + (grup === "") + '">Hepsi</button>']
      .concat(GROUPS.map(g =>
        '<button class="chip" data-group="' + g.key + '" aria-pressed="' + (grup === g.key) + '">' +
          esc(g.label) + '</button>'))
      .join("");

  $("lib-gears").innerHTML =
    ['<button class="chip" data-gear="" aria-pressed="' + (alet === "") + '">Her alet</button>']
      .concat(GEARS.map(g =>
        '<button class="chip" data-gear="' + g.key + '" aria-pressed="' + (alet === g.key) + '">' +
          esc(g.label) + '</button>'))
      .join("");
}

export function renderLibrary(){
  renderChips();
  const list = eslesenler();

  $("lib-count").textContent = list.length
    ? list.length + " hareket"
    : "Eşleşen hareket yok";

  $("lib-list").innerHTML = list.length
    ? '<ul class="swaplist">' + list.map(e =>
        '<li><button type="button" data-ex="' + esc(e.id) + '">' +
          '<span class="t">' + esc((GEARS.find(g => g.key === gearOf(e)) || {}).label ||
                                   gearOf(e)) + '</span>' +
          '<span>' + esc(e.name) + '<span class="sub">' + esc(e.alt) + '</span></span>' +
        '</button></li>').join("") + '</ul>'
    : '<p class="note" style="margin:0">Süzgeci gevşetmeyi ya da başka ' +
      'bir kelimeyle aramayı dene.</p>';
}

function openEx(id){
  const e = EXERCISES[id];
  if(!e) return;
  openSheet({
    title: e.name,
    sub: e.alt + " · " + e.target,
    html: techBody(e, videoFor(id))
  });
}

export function initLibrary(){
  $("lib-search").addEventListener("input", ev => {
    arama = ev.target.value;
    renderLibrary();
  });

  $("lib-groups").addEventListener("click", ev => {
    const b = ev.target.closest("[data-group]");
    if(!b) return;
    grup = b.dataset.group;
    renderLibrary();
  });

  $("lib-gears").addEventListener("click", ev => {
    const b = ev.target.closest("[data-gear]");
    if(!b) return;
    alet = b.dataset.gear;
    renderLibrary();
  });

  $("lib-list").addEventListener("click", ev => {
    const b = ev.target.closest("[data-ex]");
    if(b) openEx(b.dataset.ex);
  });
}
