/* ============================================================
   Hareket videoları.

   Her kimlik YouTube oembed uçları üzerinden doğrulandı: var olmayan
   ya da gömülmeye kapalı videolar buraya girmedi. Video ayrı dosyada,
   çünkü içerik en sık burası değişecek — kanal kapanır, video kalkar.
   ============================================================ */

export const VIDEOS = {};

export function videoFor(exerciseId){
  return VIDEOS[exerciseId] || null;
}
