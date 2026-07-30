/* ============================================================
   Hareket videoları.

   Her kimlik YouTube oembed ucundan doğrulandı: var olmayan ya da
   gömülmeye kapalı hiçbir video buraya girmedi. Öncelik Türkçe
   anlatımda; bulunamadığında konuşmaya ihtiyaç duymadan izlenebilen
   net görsel anlatım kabul edildi.

   İkinci ölçüt uzunluk. Hareketi 20 saniyede gösterip geçen klipler
   ayıklandı: tekniği yanlış yapınca sakatlanılan bir harekette o
   kadarı yetmiyor.

   video-check.sh dördünü hâlâ "zayıf" sayıyor, dördü de bilerek
   duruyor: calf-raise ve side-plank basit hareketler, anlatacak üç
   cümlelik iş var; hanging-leg-raise ve bulgarian-split-squat için
   daha iyi bir Türkçe anlatım bulunamadı. Bulunursa değişsin.

   Video ayrı dosyada, çünkü içerik en sık burası değişecek —
   kanal kapanır, video kalkar. Bozulanı değiştirmek için başka
   hiçbir dosyaya dokunmak gerekmiyor. Kimliklerin hâlâ ayakta ve
   yeterli olduğunu görmek için:  sh tools/video-check.sh
   ============================================================ */

export const VIDEOS = {
  /* --- makine · alt vücut --- */
  "leg-press":              { id: "2q7kXFKsIwY", channel: "Murat Tosun" },
  "leg-press-high":         { id: "2q7kXFKsIwY", channel: "Murat Tosun" },
  "seated-leg-curl":        { id: "Gjf0Ds-M6zc", channel: "Gel Gel Hoca" },
  "leg-extension":          { id: "0EwFf_3niAg", channel: "Gel Gel Hoca" },
  "calf-raise":             { id: "Je7M0ceHZGg", channel: "MACFit" },

  /* --- makine · üst vücut --- */
  "chest-press-machine":    { id: "FtUgjXsVOs0", channel: "Gel Gel Hoca" },
  "seated-cable-row":       { id: "32H5kW4YUSI", channel: "Murat Tosun" },
  "machine-row":            { id: "flmXPZ9I10w", channel: "Onur Kocausta" },
  "lat-pulldown":           { id: "hEt8rkd7-Gk", channel: "Murat Tosun" },
  "shoulder-press-machine": { id: "NqhVZXU-iLw", channel: "Onur Kocausta" },

  /* --- kablo --- */
  "face-pull":              { id: "1NSnmDZj_yI", channel: "Gel Gel Hoca" },
  "triceps-pushdown":       { id: "8lK9D16_kLo", channel: "Murat Tosun" },
  "cable-fly":              { id: "RYvQMNCnLJw", channel: "Murat Tosun" },
  "rear-delt-fly":          { id: "uesAXymf9R8", channel: "Murat Tosun" },

  /* --- serbest ağırlık · alt vücut --- */
  "goblet-squat":           { id: "T2V0-c5YbrY", channel: "Gel Gel Hoca" },
  "back-squat":             { id: "Rm1wRGvFnX4", channel: "Ağırsağlam" },
  "front-squat":            { id: "DJPm5vLtchA", channel: "Ağırsağlam" },
  "romanian-deadlift":      { id: "ptk2Mn-01SA", channel: "Gel Gel Hoca" },
  "db-romanian-deadlift":   { id: "ErjpMnPyj6E", channel: "HakanFitness" },
  "deadlift":               { id: "1VrZ1QLTdUs", channel: "Ağırsağlam" },
  "hip-thrust":             { id: "jqTP7GV3Yr0", channel: "Simge Topcu" },
  "walking-lunge":          { id: "8DB8VDgmIG8", channel: "Fit Yaşa" },
  "bulgarian-split-squat":  { id: "70oT3bD5rSI", channel: "Egzersiz Rehberim" },
  "back-extension":         { id: "YTbNdJKZT-U", channel: "Gel Gel Hoca" },

  /* --- serbest ağırlık · üst vücut --- */
  "db-bench-press":         { id: "_JEK8J5C3rs", channel: "Gel Gel Hoca" },
  "barbell-bench-press":    { id: "8W0-3l0ErSE", channel: "Ağırsağlam" },
  "incline-db-press":       { id: "HM44ZwO0djQ", channel: "Fit Yaşa" },
  "overhead-press":         { id: "EqoRkSAXgro", channel: "Murat Tosun" },
  "db-shoulder-press":      { id: "nSnVsYWs-wc", channel: "Gel Gel Hoca" },
  "lateral-raise":          { id: "weDBwj9Kuaw", channel: "Fit Yaşa" },
  "barbell-row":            { id: "eLhBRe8vmW0", channel: "Ağırsağlam" },
  "pull-up":                { id: "XoYfYgCKruQ", channel: "Workout Akademi" },
  "biceps-curl":            { id: "PhcbWcU9lTo", channel: "Murat Tosun" },
  "hammer-curl":            { id: "sg70NYEojP0", channel: "Murat Tosun" },
  "skull-crusher":          { id: "H0wbKheDTUE", channel: "Murat Tosun" },
  "barbell-shrug":          { id: "I06teI-rzCc", channel: "Berkay Türkkan" },

  /* --- gövde ve hareketlilik --- */
  "plank":                  { id: "zN4ztr3IFCI", channel: "Ayşegül Demirsoy" },
  "side-plank":             { id: "hYTF3EuvQVI", channel: "MACFit" },
  "dead-bug":               { id: "ZBMFwWSuVK0", channel: "Murat Tosun" },
  "hanging-leg-raise":      { id: "LteZy0NFGeM", channel: "MACFit" },
  "wall-angel":             { id: "1UU4VvklQ44", channel: "Vive Health" },

  /* --- ısınma ve soğuma (data/warmup.js) ---
     Isınmada wall-angel yukarıdaki kimliği paylaşır; aynı hareket,
     iki farklı bağlamda kullanılıyor. */
  "shoulder-mobility":      { id: "qcccnaQHHho", channel: "Ağırsağlam" },
  "hip-mobility":           { id: "QCe_2J3Z2gw", channel: "Simge Topcu" },
  "cat-cow":                { id: "j85WQ6idGvw", channel: "Haldun Seyhan" },
  "bodyweight-squat":       { id: "EI2kwv_jmMY", channel: "Ayşegül Demirsoy" },
  "glute-bridge":           { id: "lXsDFjiiIZU", channel: "Ayşegül Demirsoy" },
  "chest-stretch":          { id: "UlANFqnih1o", channel: "Haldun Seyhan" },
  "hip-flexor-stretch":     { id: "nIvd9qlbiHc", channel: "P4P Turkish" }
};

export function videoFor(exerciseId){
  return VIDEOS[exerciseId] || null;
}
