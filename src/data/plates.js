/* ============================================================
   Ağırlık dizimi.

   "60 kg için her tarafa ne koyacağım" hesabı salonda kafadan
   yapılıyor ve en çok da acele ederken yanlış yapılıyor. Barın kendi
   ağırlığını hesaba katmamak da aynı kapıya çıkıyor.

   Plaka takımı Türkiye'deki salonların ortak paydası: 25'ten 1,25'e.
   Daha küçüğü (0,5 · 1 kg) her salonda bulunmadığı için hesaba
   girmiyor — olmayan plakayla dizilim önermek hiç önermemekten kötü.

   Dambılda ve makinede dizilecek plaka yok: dambılın üstünde yazan
   kilo elindekinin kendisi, makinede pim kaçıncı deliğe girerse o.
   Hesap bu yüzden yalnızca bar hareketlerinde çalışır.
   ============================================================ */

import { num } from "../dom.js";

/* Büyükten küçüğe: dizilim en ağır plakadan başlar, bara en yakın
   duran o olmalı. */
export const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

/* Barın kendi ağırlığı. Anahtarlar exercises.js'teki "gear" alanı. */
export const BARS = { bar: 20, ez: 10 };

export const barWeight = gear => BARS[gear] || 0;

/* En küçük plaka iki tarafa birden konur, yani tutturulabilen en küçük
   fark 2,5 kg. Hesabı bu kademe üzerinden tam sayıyla yapmak kayan
   noktada ondalık birikmesini de önlüyor. */
const UNIT = 1.25;

/* Bir tarafa dizilecek plakalar. Bar hareketi değilse ya da ağırlık
   girilmemişse null döner: gösterilecek bir şey yok demektir. */
export function plateSetup(kg, gear){
  const bar = barWeight(gear);
  if(!bar || !(kg > 0)) return null;
  if(kg < bar) return { bar, side: [], total: bar, rounded: false, light: true };

  let units = Math.round((kg - bar) / 2 / UNIT);
  const side = [];
  PLATES.forEach(p => {
    const u = p / UNIT;
    while(units >= u){ side.push(p); units -= u; }
  });

  const total = bar + side.reduce((a, p) => a + p, 0) * 2;
  return { bar, side, total, rounded: Math.abs(total - kg) > 0.01, light: false };
}

/* "20 + 5" — dizilimin okunur hâli. */
export const sideText = s => s.side.map(num).join(" + ");

/* Hareket sayfasındaki tek satır. Gösterilecek bir şey yoksa boş döner;
   satır CSS'te :empty ile tamamen kaybolur, yer bile kaplamaz.
   Plakalarla tam tutturulamayan ağırlıkta toplam da yazılır — sessizce
   yuvarlayıp doğru sayı göstermiş gibi yapmak salonda yanıltıcı olur. */
export function plateLine(kg, gear){
  const s = plateSetup(kg, gear);
  if(!s) return "";
  if(s.light) return "Sadece bar · boş bar " + num(s.bar) + " kg";
  if(!s.side.length) return "Sadece bar · " + num(s.total) + " kg";
  return "Her tarafa " + sideText(s) + " kg" +
    (s.rounded ? " · en yakını " + num(s.total) + " kg" : "");
}
