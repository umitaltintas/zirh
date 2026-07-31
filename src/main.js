/* ============================================================
   ZIRH — bağlantı noktası.

   Modüller birbirini tanımaz; kim kimi ne zaman tazeleyecek burada
   kurulur. Böylece antrenman ekranı geçmişten, profil öğünden
   habersiz kalabiliyor.
   ============================================================ */

import { $, buzz, toast } from "./dom.js";
import { db, save, load, sweepStale, session, PEOPLE } from "./store.js";
import { findDay } from "./data/programs.js";

import { initRouter, go, whenEntering, currentView } from "./ui/router.js";
import { initSheet, sheetOpen } from "./ui/sheet.js";
import { initTimer, resumeTimer, hideTimer, releaseAwake, keepAwake } from "./ui/timer.js";

import * as workout from "./screens/workout.js";
import { renderHistory, wipeHistory } from "./screens/history.js";
import { initProfile, renderProfile, renderTargets } from "./screens/profile.js";
import { initMeals, renderMeals, resetPlan } from "./screens/meals.js";

/* ---------- tema ---------- */

function applyTheme(){
  const t = db.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.dataset.theme = t;
  const m = document.querySelector('meta[name="theme-color"]');
  if(m) m.setAttribute("content", t === "light" ? "#EFF0F3" : "#0D0F12");
}

/* ---------- kişi ---------- */

function paintPerson(){
  $("p-erkek").setAttribute("aria-pressed", String(db.person === "erkek"));
  $("p-kadin").setAttribute("aria-pressed", String(db.person === "kadin"));
}

function switchPerson(who){
  if(db.person === who) return;
  db.person = who;
  save();
  paintPerson();
  hideTimer();
  releaseAwake();
  rebuildWorkout();
  renderHistory();
  renderProfile();
  resetPlan();
  toast(PEOPLE[who].label + " programına geçildi");
}

/* Seviye, gün ya da kişi değiştiğinde antrenman ekranını sıfırdan kur. */
function rebuildWorkout(){
  workout.setDay(workout.suggestDay());
  workout.render();
  workout.goPage(0, true);
}

/* ---------- başlangıç ---------- */

load();
applyTheme();
paintPerson();

/* Gece yarısını geçip açık kalmış seanslar geçmişe alınır. */
sweepStale(findDay);

initRouter();
initSheet();
initTimer();

workout.initWorkout({
  onSessionSaved(){
    renderHistory();
    renderProfile();
  }
});

initProfile({
  onLevelChange(){
    hideTimer();
    rebuildWorkout();
  },
  onGoalChange(){
    resetPlan();
  }
});

initMeals();

$("theme").onclick = () => {
  db.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  save();
  applyTheme();
};
$("p-erkek").onclick = () => switchPerson("erkek");
$("p-kadin").onclick = () => switchPerson("kadin");
$("wipe").onclick = () => wipeHistory(rebuildWorkout);

/* Öğün hedefleri profildeki kiloya bağlı; sekmeye her girildiğinde tazelenir. */
whenEntering("ogun", renderMeals);
whenEntering("profil", renderTargets);

workout.setDay(workout.suggestDay());
workout.render();
renderHistory();
renderProfile();
renderMeals();

go((location.hash || "").replace("#/", ""), false);
workout.resumeWhereLeftOff();

/* ---------- ölçüm ve klavye ---------- */

/* Alt barın yüksekliği yalnızca bildirim balonunu konumlandırmak için gerekli.
   --nav-h buton yüksekliği, --nav-total ölçülen bar; ikisi ayrı tutulmazsa
   ölçüm her turda barı biraz daha büyütüyor. */
const tabsEl = document.querySelector(".tabs");
const sizeNav = () =>
  document.documentElement.style.setProperty("--nav-total", tabsEl.offsetHeight + "px");

sizeNav();
if(window.ResizeObserver) new ResizeObserver(sizeNav).observe(tabsEl);
window.addEventListener("load", sizeNav);

/* Yazı tipleri yüklenince yükseklikler değişebilir, sayfayı yeniden hizala. */
if(document.fonts && document.fonts.ready){
  document.fonts.ready.then(() => { sizeNav(); workout.goPage(workout.atPage(), true); });
}

document.addEventListener("keydown", ev => {
  if(currentView() !== "antrenman" || sheetOpen()) return;
  if(ev.target.matches("input")) return;
  if(ev.key === "ArrowRight") workout.goPage(workout.atPage() + 1);
  if(ev.key === "ArrowLeft") workout.goPage(workout.atPage() - 1);
});

document.addEventListener("visibilitychange", () => {
  if(document.visibilityState !== "visible") return;
  const d = workout.currentDay();
  if(d && Object.keys(session(db.person, d.program.id, d.key, false).sets).length) keepAwake();
  /* Sayaç arka planda bittiyse uyarısını burada verir, sesi de burada
     uyandırır — iOS bağlamı askıya almış olabilir. */
  resumeTimer();
});

/* ---------- servis çalışanı ---------- */

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(reg => {
      const check = () => { try{ reg.update(); }catch(e){} };
      document.addEventListener("visibilitychange", () => {
        if(document.visibilityState === "visible") check();
      });
      setInterval(check, 30 * 60 * 1000);
    }).catch(() => {});

    /* İlk kurulumda da controllerchange yayılır; o an yenilemek gereksiz. */
    const hadController = !!navigator.serviceWorker.controller;
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if(!hadController || reloading) return;
      const d = workout.currentDay();
      if(d && Object.keys(session(db.person, d.program.id, d.key, false).sets).length){
        toast("Yeni sürüm hazır, seanstan sonra geçilecek");
        return;
      }
      reloading = true;
      location.reload();
    });
  });
}
