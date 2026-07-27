/* ============================================================
   Sekmeler arası gezinme.

   Her sekme kendi kaydırma konumunu hatırlar. Geçiş yönü sekme
   sırasından çıkarılır; sağa gidiyorsan içerik soldan girer.
   ============================================================ */

import { $, buzz } from "../dom.js";

export const VIEWS = ["antrenman", "ogun", "gecmis", "rehber", "profil"];

const scrollMemo = {};
const onEnter = {};
let scroller = null;
let current = "antrenman";

export const currentView = () => current;

/* Bir sekmeye her girildiğinde çalışacak iş. */
export function whenEntering(name, fn){
  (onEnter[name] || (onEnter[name] = [])).push(fn);
}

export function go(name, push){
  if(VIEWS.indexOf(name) < 0) name = "antrenman";
  if(name === current && push !== false) return;

  scrollMemo[current] = scroller.scrollTop;
  const dir = VIEWS.indexOf(name) > VIEWS.indexOf(current) ? "in-left" : "in-right";

  VIEWS.forEach(v => {
    const el = $("v-" + v);
    el.classList.remove("on", "in-left", "in-right");
    if(v === name){
      el.classList.add("on", dir);
      /* Animasyon bitince sınıfı bırak; yarıda kesilirse dönüşüm takılı kalmasın. */
      el.addEventListener("animationend", () => el.classList.remove("in-left", "in-right"), { once: true });
    }
    $("tab-" + v).setAttribute("aria-selected", v === name ? "true" : "false");
  });

  $("rail").style.display = name === "antrenman" ? "" : "none";
  current = name;
  document.body.dataset.tab = name;
  if(push !== false && location.hash !== "#/" + name) location.hash = "#/" + name;

  /* Yeni görünümün yüksekliği hesaplansın; yoksa geri dönüşte kaydırma kırpılıyor. */
  void scroller.offsetHeight;
  scroller.scrollTop = scrollMemo[name] || 0;

  (onEnter[name] || []).forEach(fn => fn());
}

export function initRouter(){
  scroller = document.querySelector("main");
  VIEWS.forEach(v => {
    scrollMemo[v] = 0;
    $("tab-" + v).onclick = () => {
      if(current !== v) buzz(10);
      go(v);
    };
  });
  window.addEventListener("hashchange", () => go((location.hash || "").replace("#/", ""), false));
}
