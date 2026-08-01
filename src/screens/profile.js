/* ============================================================
   Profil — kişi ölçüleri, hedef ve program seviyesi.

   Boy, kilo ve yaş koda yazılmaz. Buradan girilir, localStorage'da
   kalır, hiçbir yere gönderilmez. Depo herkese açık olduğu için
   bu ayrım önemli.
   ============================================================ */

import { $, esc, num, numOr0, toast, buzz } from "../dom.js";
import { db, save, profile, PEOPLE, logWeight } from "../store.js";
import { PROGRAMS, program } from "../data/programs.js";
import { macros, daily, bodyNote, bmi, goalCheck } from "../data/nutrition.js";
import { levelHint } from "../progress.js";
import { sparkHTML } from "../ui/spark.js";

let onLevelChange = () => {};

const FIELDS = { "pf-h": "h", "pf-w": "w", "pf-age": "age" };

export function renderProfile(){
  const p = profile();
  $("pr-who").textContent = PEOPLE[db.person].label;

  Object.keys(FIELDS).forEach(id => { $(id).value = p[FIELDS[id]] || ""; });

  $("goals").querySelectorAll("[data-goal]").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.goal === p.goal)));

  renderWeightLog();
  renderLevels();
  renderTargets();
}

/* ---------- kilo seyri ---------- */

/* Kilo hedefe bağlı bir sayı: "kilo ver" diyen biri için tek bir
   güncel değer, işe yarayıp yaramadığını söylemiyor. Seyir söylüyor.

   Günde tek kayıt tutuluyor. Kilo gün içinde bir buçuk kiloya kadar
   oynar — suyla, yemekle, tuzla. Aynı gün üç kez tartılan birinin
   grafiği o gürültüyü ilerleme gibi gösterirdi. */
function renderWeightLog(){
  const log = profile().wlog || [];
  const box = $("pf-wlog");
  if(!box) return;

  if(log.length < 2){
    box.innerHTML = '<p class="note" style="margin:0">Kilonu her ölçtüğünde ' +
      'buraya yaz; birkaç kayıttan sonra seyri burada çizilecek.</p>';
    return;
  }

  const vals = log.map(e => e.w);
  const first = vals[0], last = vals[vals.length - 1];
  const diff = Math.round((last - first) * 10) / 10;
  const days = Math.round((new Date(log[log.length - 1].d) - new Date(log[0].d)) / 86400000);

  /* Asıl mesele grafiğin kendisi değil, hedefle uyup uymadığı.
     Uygulama kiloya göre bir kalori hedefi hesaplıyordu ama
     tutturulup tutturulmadığını hiç sormuyordu; terazi zaten
     söylüyorken sormaya gerek de yok. */
  const chk = goalCheck(log, profile().goal);

  box.innerHTML =
    sparkHTML(vals, "Kilo seyri") +
    '<div class="tfoot">' +
      '<span>' + vals.length + ' ölçüm · ' + days + ' gün</span>' +
      '<span class="t1rm">' +
        (diff === 0
          ? "değişmedi"
          : '<b class="delta ' + (diff > 0 ? "up" : "down") + '">' +
            (diff > 0 ? "+" : "") + num(diff) + ' kg</b>') +
      '</span>' +
    '</div>' +
    (chk
      ? '<p class="tnote' + (chk.ok ? " good" : "") + '">' +
        '<b>Haftada ' + (chk.hiz > 0 ? "+" : "") + num(chk.hiz) + ' kg.</b> ' +
        esc(chk.text) + '</p>'
      : "");
}

function renderLevels(){
  const cur = profile().level;
  $("levels").innerHTML = PROGRAMS.map(p =>
    '<button class="lvl" data-level="' + p.id + '" aria-pressed="' + (p.id === cur) + '">' +
      '<span class="lvlno">' + p.id + '</span>' +
      '<span class="lvltext">' +
        '<b>' + esc(p.name) + '</b>' +
        '<small>' + esc(p.tagline) + '</small>' +
        '<em>' + esc(p.freq) + ' · ' + esc(p.focus) + '</em>' +
      '</span>' +
    '</button>'
  ).join("");

  const p = program(cur);
  $("lvl-note").innerHTML = '<b>' + esc(p.who) + '</b> ' + esc(p.note);

  /* Seviye yine elle seçiliyor; burada yapılan tek şey "hazırsın"
     demek. Rehber sekmesi seviyelerin nasıl ilerlediğini anlatıyordu
     ama kişinin kendisine hiç dokunmuyordu. */
  const hint = levelHint(db.history, db.person, cur);
  $("lvl-hint").innerHTML = hint
    ? '<p class="tnote">' + hint.weeks + ' haftadır ' + cur + '. seviyedesin ve ' +
      hint.total + ' hareketin ' + hint.up + ' tanesinde ağırlık arttı — ' +
      hint.next + '. seviyeye (' + esc(program(hint.next).name) + ') bakabilirsin. ' +
      'Acele yok: bu seviyede kalmak da bir seçim.</p>'
    : "";
}

export function renderTargets(){
  const p = profile();
  const h = numOr0(p.h), w = numOr0(p.w), age = numOr0(p.age);
  const days = parseInt(program(p.level).freq.replace(/\D+/g, ""), 10) || 2;

  const m = macros({ h, w, age, person: db.person, goal: p.goal, daysPerWeek: days });
  const d = daily(w);

  if(m){
    $("t-kcal").textContent = m.kcal.toLocaleString("tr-TR");
    $("t-pro").textContent = m.protein + " g";
    $("t-carb").textContent = m.carb + " g";
    $("t-fat").textContent = m.fat + " g";
  }else{
    ["t-kcal", "t-pro", "t-carb", "t-fat"].forEach(id => { $(id).textContent = "—"; });
  }

  $("t-cre").textContent = d.cre;
  $("t-water").textContent = d.water;

  const v = bmi(h, w);
  $("t-bmi").textContent = v ? (Math.round(v * 10) / 10).toString().replace(".", ",") : "—";
  $("pr-note").textContent = bodyNote(h, w);
}

export function initProfile(hooks){
  onLevelChange = hooks.onLevelChange || (() => {});

  Object.keys(FIELDS).forEach(id => {
    $(id).addEventListener("input", ev => {
      profile()[FIELDS[id]] = ev.target.value;
      /* Kilo yazılırken her tuş vuruşu bir ölçüm değil: "8" yazıp
         "80"e tamamlayan biri 8 kiloya düşmüş sayılmamalı. Kayıt
         alan bırakılırken alınıyor. */
      save();
      renderTargets();
    });
  });

  $("pf-w").addEventListener("change", () => {
    if(logWeight(numOr0(profile().w))) renderWeightLog();
  });

  $("goals").addEventListener("click", ev => {
    const b = ev.target.closest("[data-goal]");
    if(!b) return;
    profile().goal = b.dataset.goal;
    save();
    $("goals").querySelectorAll("[data-goal]").forEach(x =>
      x.setAttribute("aria-pressed", String(x === b)));
    renderTargets();
    /* Hedef değişti: kilo seyrinin altındaki değerlendirme de
       değişmeli, "kas kazan" için iyi olan "yağ yak" için kötü. */
    renderWeightLog();
    buzz(10);
    hooks.onGoalChange && hooks.onGoalChange();
  });

  $("levels").addEventListener("click", ev => {
    const b = ev.target.closest("[data-level]");
    if(!b) return;
    const next = +b.dataset.level;
    if(next === profile().level) return;
    profile().level = next;
    save();
    renderLevels();
    renderTargets();
    buzz(14);
    onLevelChange();
    toast(next + ". seviye · " + program(next).name + " programına geçildi");
  });

  $("export").onclick = exportData;
}

/* Kayıtlar yalnızca bu telefonda; telefon değişirse elde bir yedek kalsın. */
async function exportData(){
  const blob = JSON.stringify(db, null, 2);
  try{
    if(navigator.share && navigator.canShare && navigator.canShare({
      files: [new File([blob], "zirh-yedek.json", { type: "application/json" })]
    })){
      await navigator.share({
        files: [new File([blob], "zirh-yedek.json", { type: "application/json" })],
        title: "ZIRH yedeği"
      });
      return;
    }
    const url = URL.createObjectURL(new Blob([blob], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "zirh-yedek.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Yedek indirildi");
  }catch(e){
    if(e && e.name === "AbortError") return;
    toast("Yedek alınamadı");
  }
}
