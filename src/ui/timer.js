/* ============================================================
   Dinlenme sayacı.

   Kalan süre her karede bitiş zaman damgasından hesaplanır. Telefon
   kilitlenip sekme dondurulsa bile geri dönüldüğünde doğru rakam
   görünür — setInterval'in kaç kez çalıştığı önemli değil.
   ============================================================ */

import { $, buzz } from "../dom.js";

let endsAt = 0, totalSec = 0, tick = null, audioCtx = null;

function beep(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    [0, .18].forEach((offset, idx) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      const t = audioCtx.currentTime + offset;
      o.type = "sine";
      o.frequency.setValueAtTime(idx ? 1046 : 784, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(.28, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + .16);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + .18);
    });
  }catch(e){}
  buzz([120, 70, 120]);
}

/* iOS ses bağlamını ancak bir dokunuş içinde açar. */
export function unlockAudio(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
  }catch(e){}
}

export function startTimer(sec, name, sub){
  totalSec = sec;
  endsAt = Date.now() + sec * 1000;
  $("t-name").textContent = name;
  $("t-sub").textContent = sub || "Dinlen, sonra sıradaki set";
  $("t-digits").classList.remove("up");
  $("timer").classList.add("on");
  clearInterval(tick);
  paint();
  tick = setInterval(paint, 250);
}

function paint(){
  const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
  $("t-digits").textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
  $("t-prog").style.width = (totalSec ? left / totalSec * 100 : 0) + "%";
  if(left <= 0){
    clearInterval(tick); tick = null;
    $("t-digits").classList.add("up");
    $("t-sub").textContent = "Süre doldu, sıradaki sete geç";
    beep();
    setTimeout(hideTimer, 6000);
  }
}

export function hideTimer(){
  clearInterval(tick); tick = null;
  $("timer").classList.remove("on");
}

export const timerRunning = () => !!tick;
export const repaintTimer = () => { if(tick) paint(); };

export function initTimer(){
  $("t-skip").onclick = hideTimer;
  $("t-plus").onclick = () => {
    if(!tick) return startTimer(30, $("t-name").textContent);
    endsAt += 30000; totalSec += 30; paint();
  };
}

/* ---------- ekranı açık tutma ---------- */

let wakeLock = null;

export async function keepAwake(){
  try{
    if("wakeLock" in navigator && !wakeLock){
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => { wakeLock = null; });
    }
  }catch(e){}
}

export function releaseAwake(){
  if(wakeLock){ try{ wakeLock.release(); }catch(e){} wakeLock = null; }
}
