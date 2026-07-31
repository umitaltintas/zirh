/* ============================================================
   Dinlenme sayacı.

   Kalan süre her karede bitiş zaman damgasından hesaplanır. Telefon
   kilitlenip sekme dondurulsa bile geri dönüldüğünde doğru rakam
   görünür — setInterval'in kaç kez çalıştığı önemli değil.
   ============================================================ */

import { $, buzz } from "../dom.js";

let endsAt = 0, totalSec = 0, tick = null, hideT = null, audioCtx = null, owed = false;

/* Bitiş sesi salonda, müziğin ve demirin arasında duyulmalı; ama kulaklıkla
   çalışanı da yerinden sıçratmamalı. Tek bip yerine yükselen üç nota var:
   yükselen desen ortam gürültüsünde tek sesten çok daha kolay seçiliyor ve
   alarm gibi bağırmadan "bitti" diyor. */
const NOTES = [784, 988, 1319];   /* sol · si · mi */

/* Üçgen dalga sinüsten daha çok üst harmonik taşıdığı için aynı ses
   yüksekliğinde daha kesici duyulur; bir oktav üstteki sinüs de zil
   parlaklığını veriyor. Yalnız sinüs, gürültüde boğuluyordu. */
function tone(freq, at, dur, vol, type){
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + .015);
  g.gain.exponentialRampToValueAtTime(.0001, at + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(at); o.stop(at + dur + .02);
}

function beep(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    NOTES.forEach((freq, i) => {
      const at = audioCtx.currentTime + i * .17;
      /* Son nota biraz daha uzun ve dolgun: cümlenin noktası o. */
      const last = i === NOTES.length - 1;
      tone(freq, at, last ? .5 : .26, last ? .38 : .3, "triangle");
      tone(freq * 2, at, last ? .4 : .2, last ? .16 : .12, "sine");
    });
  }catch(e){}
}

/* Süre doldu: ses, titreşim ve ekran birlikte. Titreşim iPhone'da hiç
   çalışmıyor (bkz. src/dom.js), ses de telefon sessizdeyken kısılabilir;
   bu yüzden kutunun tamamının yeşile dönmesi uyarının asıl gövdesi.

   Ayrı bir "sesi kapat" tercihi yok: uyarı yalnızca kullanıcının kendi
   başlattığı dinlenmenin sonunda, bir saniyeden kısa çalıyor ve "Atla"
   ile her an susturulabiliyor. Telefonun kendi ses düğmesi zaten var. */
function ring(){
  beep();
  buzz([120, 70, 120]);
  $("timer").classList.add("up");
  clearTimeout(hideT);
  hideT = setTimeout(hideTimer, 6000);
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
  owed = false;
  $("t-name").textContent = name;
  $("t-sub").textContent = sub || "Dinlen, sonra sıradaki set";
  $("timer").classList.remove("up");
  $("timer").classList.add("on");
  /* Önceki sayacın kapanma zamanlayıcısı iptal edilmezse, arka arkaya
     iki set işaretlendiğinde eskisi yenisini kapatıyordu. */
  clearTimeout(hideT);
  clearInterval(tick);
  paint();
  tick = setInterval(paint, 250);
}

function paint(){
  const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
  $("t-digits").textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
  $("t-prog").style.width = (totalSec ? left / totalSec * 100 : 0) + "%";
  if(left > 0) return;

  clearInterval(tick); tick = null;
  $("t-sub").textContent = "Süre doldu, sıradaki sete geç";
  /* Sayfa arka plandayken uyarı boşa gider: ses çalmaz, ekran görünmez,
     üstelik altı saniye sonra kutu kendini kapatır ve kullanıcı hiçbir
     şey görmeden döner. Uyarı öne dönene kadar bekliyor. */
  if(document.hidden){ owed = true; return; }
  ring();
}

export function hideTimer(){
  clearInterval(tick); tick = null;
  clearTimeout(hideT); hideT = null;
  owed = false;
  $("timer").classList.remove("on");
  $("timer").classList.remove("up");
}

export const timerRunning = () => !!tick;

/* Sayfa öne döndüğünde çağrılır. iOS uygulamayı arka plana alınca ses
   bağlamını askıya alıyor ve geri getirmiyor; her dönüşte uyandırılmazsa
   bir sonraki dinlenme sessiz bitiyor. */
export function resumeTimer(){
  unlockAudio();
  if(tick) return paint();
  if(!owed) return;
  owed = false;
  /* Dinlenmenin üstünden çok geçtiyse uyarmanın anlamı kalmıyor:
     kullanıcı çoktan sete başlamış olabilir, o an öten telefon yalnızca
     rahatsız eder. Sessizce kapanır. */
  if(Date.now() - endsAt < 45000) ring();
  else hideTimer();
}

export function initTimer(){
  $("t-skip").onclick = hideTimer;
  $("t-plus").onclick = () => {
    /* Dokunuş fırsatı: ses bağlamı burada da açılabiliyorsa açılsın. */
    unlockAudio();
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
