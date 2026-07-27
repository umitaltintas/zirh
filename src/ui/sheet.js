/* ============================================================
   Alttan açılan panel.

   Görünürlük CSS'in visibility'siyle yönetilir, requestAnimationFrame
   ile değil — böylece animasyon çalışmayan ortamlarda da açılır.
   Geri tuşu paneli kapatır, sayfadan çıkmaz.
   ============================================================ */

import { $, buzz } from "../dom.js";

let sheet, scrim, open = false;

export const sheetOpen = () => open;

export function openSheet({ title, sub, html }){
  $("sheet-title").textContent = title;
  $("sheet-sub").textContent = sub || "";
  $("sheet-body").innerHTML = html;
  $("sheet-body").scrollTop = 0;
  sheet.style.transform = "";
  sheet.setAttribute("aria-hidden", "false");
  sheet.classList.add("on");
  scrim.classList.add("on");
  open = true;
  buzz(12);
  history.pushState({ sheet: 1 }, "");
}

export function closeSheet(fromPop){
  if(!open) return;
  open = false;
  sheet.classList.remove("on", "dragging");
  sheet.style.transform = "";
  sheet.setAttribute("aria-hidden", "true");
  scrim.classList.remove("on");
  /* Video iframe'i sussun diye içerik boşaltılıyor — ama panel kapanma
     animasyonunu bitirdikten sonra, yoksa içerik gözümüzün önünde siliniyor. */
  setTimeout(() => { if(!open) $("sheet-body").innerHTML = ""; }, 340);
  if(!fromPop && history.state && history.state.sheet) history.back();
}

export function initSheet(){
  sheet = $("sheet");
  scrim = $("scrim");

  scrim.addEventListener("click", () => closeSheet());
  document.addEventListener("keydown", ev => { if(ev.key === "Escape") closeSheet(); });
  window.addEventListener("popstate", () => { if(open) closeSheet(true); });

  /* Video ancak istendiğinde yüklenir; panel açılınca değil. */
  $("sheet-body").addEventListener("click", ev => {
    const vb = ev.target.closest(".vbtn");
    if(!vb) return;
    const slot = vb.closest(".videoslot"), id = slot.dataset.vid;
    slot.innerHTML =
      '<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
      '?rel=0&autoplay=1" title="Hareket videosu" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>' +
      '<a class="fallback" href="https://www.youtube.com/watch?v=' + id +
      '" target="_blank" rel="noopener">Açılmadıysa YouTube\'da aç →</a>';
  });

  dragToClose();
}

/* Aşağı sürükleyip bırakınca kapanır. */
function dragToClose(){
  let y0 = 0, dy = 0, on = false;

  const grab = ev => {
    if(!open) return;
    on = true; dy = 0;
    y0 = ev.touches ? ev.touches[0].clientY : ev.clientY;
    sheet.classList.add("dragging");
  };
  const move = ev => {
    if(!on) return;
    const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
    dy = Math.max(0, y - y0);
    sheet.style.transform = "translateY(" + dy + "px)";
    if(ev.cancelable) ev.preventDefault();
  };
  const drop = () => {
    if(!on) return;
    on = false;
    sheet.classList.remove("dragging");
    sheet.style.transform = "";
    if(dy > 90) closeSheet();
  };

  [$("sheetgrip"), sheet.querySelector(".sheethead")].forEach(el => {
    el.addEventListener("touchstart", grab, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", drop);
    el.addEventListener("mousedown", grab);
  });
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", drop);
}
