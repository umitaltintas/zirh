/* Küçük yardımcılar. Kütüphane yerine bunlar. */

export const $ = id => document.getElementById(id);
export const qs = sel => document.querySelector(sel);

export const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Türkçe ondalık: 2.5 → "2,5" */
export const num = n => String(n).replace(".", ",");

/* "2,5" → 2.5 · boş ya da bozuksa 0 */
export const numOr0 = v => {
  const n = parseFloat(String(v == null ? "" : v).replace(",", "."));
  return isNaN(n) ? 0 : n;
};

/* Titreşim — iPhone'da HİÇ çalışmaz. Safari navigator.vibrate'i hiçbir
   iOS sürümünde uygulamadı, dolayısıyla bu satır orada sessizce hiçbir şey
   yapmaz. Android'de dokunuşu tatlandıran bir süs olarak kalsın, ama
   kaçırılmaması gereken hiçbir olay yalnızca buna emanet edilmesin:
   dinlenme sayacının bitişi gibi anlar sesle ve ekrandaki değişimle de
   bildirilmeli (bkz. src/ui/timer.js). */
export const buzz = ms => { if(navigator.vibrate) navigator.vibrate(ms); };

let toastT = null;
export function toast(msg){
  const t = $("toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("on"), 2400);
}

export const trDate = (ts, opts) =>
  new Date(ts).toLocaleDateString("tr-TR", opts);
