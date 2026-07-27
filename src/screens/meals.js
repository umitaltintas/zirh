/* ============================================================
   Öğün ekranı.

   Sabit bir liste göstermek yerine profildeki kalori ve protein
   hedefine göre bir gün kuruyor: her öğün yuvasına aday öğünler
   yerleştirilip toplamı hedefe en yakın olan kombinasyon seçiliyor.
   "Başka bir gün öner" aynı işi yeni bir çekilişle tekrarlar.
   ============================================================ */

import { $, esc, numOr0, buzz } from "../dom.js";
import { db, profile } from "../store.js";
import { MEALS, TIPS, SLOT_LABELS } from "../data/meals.js";
import { macros } from "../data/nutrition.js";
import { program } from "../data/programs.js";
import { openSheet } from "../ui/sheet.js";

let filter = "hepsi";
let plan = null;

/* ---------- hedef ---------- */

function target(){
  const p = profile();
  const days = parseInt(program(p.level).freq.replace(/\D+/g, ""), 10) || 2;
  return macros({
    h: numOr0(p.h), w: numOr0(p.w), age: numOr0(p.age),
    person: db.person, goal: p.goal, daysPerWeek: days
  });
}

/* ---------- gün kurucu ---------- */

const byType = t => MEALS.filter(m => m.type === t);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const sum = (list, k) => list.reduce((a, m) => a + m[k], 0);

/* Kalori arttıkça öğün sayısı artar; 1800 kcal'i dört öğüne bölmek
   ile 3000'i bölmek aynı şey değil. */
function slotsFor(kcal){
  const s = ["kahvalti", "ana", "ara", "ana"];
  if(kcal >= 2400) s.push("ara");
  if(kcal >= 2900) s.push("ara");
  return s;
}

function buildPlan(t){
  if(!t) return null;
  const slots = slotsFor(t.kcal);
  const pools = slots.map(byType).filter(p => p.length);
  if(pools.length < slots.length) return null;

  let best = null, bestScore = Infinity;

  /* Rastgele deneme: aday sayısı küçük olduğu için birkaç yüz çekiliş
     en iyiye fazlasıyla yaklaşıyor, kombinasyonların tamamını
     taramaya gerek yok. */
  for(let i = 0; i < 300; i++){
    const day = [];
    const used = new Set();
    pools.forEach(pool => {
      const fresh = pool.filter(m => !used.has(m.id));
      const m = pick(fresh.length ? fresh : pool);
      used.add(m.id);
      day.push(m);
    });

    const kcal = sum(day, "kcal"), pro = sum(day, "protein");
    const score =
      Math.abs(kcal - t.kcal) / t.kcal +
      2 * Math.max(0, t.protein - pro) / t.protein;

    if(score < bestScore){ bestScore = score; best = day; }
  }

  return best;
}

/* ---------- çizim ---------- */

function gauge(label, value, goal, unit){
  const pct = goal ? Math.min(140, Math.round(value / goal * 100)) : 0;
  const cls = pct >= 92 && pct <= 108 ? "ok" : pct > 115 ? "over" : "";
  return '<div class="gauge">' +
    '<div class="gaugerow"><span>' + esc(label) + '</span>' +
      '<b>' + value + ' / ' + goal + ' ' + esc(unit) + '</b></div>' +
    '<div class="gaugebar"><i class="' + cls + '" style="width:' + Math.min(100, pct) + '%"></i></div>' +
  '</div>';
}

/* Hedef ya da kişi değiştiyse eldeki plan artık başka birine ait;
   sekmeye her girişte değil, yalnızca o zaman yeniden kurulur. */
export function resetPlan(){
  plan = null;
  renderMeals();
}

export function renderMeals(){
  const t = target();

  if(!t){
    $("m-plan").innerHTML =
      '<div class="card"><p>Öğün önerisi için önce <b>Profil</b> sekmesinden boy ve kilonu gir. ' +
      'Kalori ve protein hedefin oradan hesaplanıyor.</p>' +
      '<p class="note">Bu bilgiler yalnızca bu telefonda saklanır.</p></div>';
    $("m-shuffle").style.display = "none";
  }else{
    $("m-shuffle").style.display = "";
    if(!plan) plan = buildPlan(t);
    paintPlan(t);
  }

  renderFilters();
  renderList();
  $("m-tips").innerHTML = TIPS.map(x => '<p>' + esc(x) + '</p>').join("");
}

function paintPlan(t){
  if(!plan) return;
  const kcal = sum(plan, "kcal"), pro = sum(plan, "protein");
  const carb = sum(plan, "carb"), fat = sum(plan, "fat");

  $("m-plan").innerHTML =
    '<div class="plansum">' +
      '<div class="ptitle"><b>' + kcal.toLocaleString("tr-TR") + ' kcal</b>' +
        '<span>' + plan.length + ' öğün · ' + t.goal.label.toLowerCase() + '</span></div>' +
      gauge("Kalori", kcal, t.kcal, "kcal") +
      gauge("Protein", pro, t.protein, "g") +
      gauge("Karbonhidrat", carb, t.carb, "g") +
      gauge("Yağ", fat, t.fat, "g") +
    '</div>' +
    plan.map((m, i) =>
      '<p class="mealslot">' + esc(SLOT_LABELS[m.type] || m.type) + '</p>' + mealCard(m, "plan-" + i)
    ).join("");
}

function mealCard(m, key){
  return '<button class="meal" data-meal="' + esc(m.id) + '" data-key="' + esc(key || m.id) + '">' +
    '<span class="mealtext"><b>' + esc(m.name) + '</b>' +
      '<small>' + m.min + ' dk · ' + esc(m.tags.slice(0, 2).join(" · ")) + '</small></span>' +
    '<span class="mealnums"><b>' + m.kcal + '</b><span>' + m.protein + ' g protein</span></span>' +
  '</button>';
}

function renderFilters(){
  const types = ["hepsi", ...Object.keys(SLOT_LABELS)];
  $("m-filters").innerHTML = types.map(t =>
    '<button class="chip" data-filter="' + t + '" aria-pressed="' + (t === filter) + '">' +
      esc(t === "hepsi" ? "Hepsi" : SLOT_LABELS[t]) + '</button>'
  ).join("");
}

function renderList(){
  const list = filter === "hepsi" ? MEALS : MEALS.filter(m => m.type === filter);
  $("m-list").innerHTML = list
    .slice()
    .sort((a, b) => b.protein - a.protein)
    .map(m => mealCard(m, "list-" + m.id))
    .join("");
}

/* ---------- öğün ayrıntısı ---------- */

function openMeal(id){
  const m = MEALS.find(x => x.id === id);
  if(!m) return;
  openSheet({
    title: m.name,
    sub: (SLOT_LABELS[m.type] || m.type) + " · " + m.min + " dakika",
    html:
      '<div class="mealbody">' +
        '<div class="macro" style="margin-bottom:16px">' +
          '<div><b>' + m.kcal + '</b><span>kcal</span></div>' +
          '<div><b>' + m.protein + '</b><span>Protein g</span></div>' +
          '<div><b>' + m.carb + '</b><span>Karb. g</span></div>' +
          '<div><b>' + m.fat + '</b><span>Yağ g</span></div>' +
        '</div>' +
        '<h4>Malzemeler</h4>' +
        '<ul>' + m.items.map(x => '<li>' + esc(x) + '</li>').join("") + '</ul>' +
        (m.note ? '<h4>Not</h4><p class="why">' + esc(m.note) + '</p>' : '') +
        '<div class="taglist">' + m.tags.map(x => '<span class="tag">' + esc(x) + '</span>').join("") + '</div>' +
      '</div>'
  });
}

/* ---------- kurulum ---------- */

export function initMeals(){
  $("m-shuffle").onclick = () => {
    const t = target();
    if(!t) return;
    plan = buildPlan(t);
    paintPlan(t);
    buzz(12);
  };

  $("m-filters").addEventListener("click", ev => {
    const b = ev.target.closest("[data-filter]");
    if(!b || b.dataset.filter === filter) return;
    filter = b.dataset.filter;
    renderFilters();
    renderList();
  });

  document.getElementById("v-ogun").addEventListener("click", ev => {
    const b = ev.target.closest("[data-meal]");
    if(b) openMeal(b.dataset.meal);
  });
}
