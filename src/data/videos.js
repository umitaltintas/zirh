/* ============================================================
   Hareket videoları.

   Her kimlik YouTube oembed ucundan doğrulandı: var olmayan ya da
   gömülmeye kapalı hiçbir video buraya girmedi. Öncelik Türkçe
   anlatımda; bulunamadığında konuşmaya ihtiyaç duymadan izlenebilen
   net görsel anlatım kabul edildi.

   Video ayrı dosyada, çünkü içerik en sık burası değişecek —
   kanal kapanır, video kalkar. Bozulanı değiştirmek için başka
   hiçbir dosyaya dokunmak gerekmiyor.
   ============================================================ */

export const VIDEOS = {
  /* --- makine · alt vücut --- */
  "leg-press":              { id: "2q7kXFKsIwY", channel: "Murat Tosun" },
  "leg-press-high":         { id: "2q7kXFKsIwY", channel: "Murat Tosun" },
  "seated-leg-curl":        { id: "CoQaxQt_ffU", channel: "Ferhat Barlas" },
  "leg-extension":          { id: "0EwFf_3niAg", channel: "Gel Gel Hoca" },
  "calf-raise":             { id: "Je7M0ceHZGg", channel: "MACFit" },

  /* --- makine · üst vücut --- */
  "chest-press-machine":    { id: "FtUgjXsVOs0", channel: "Gel Gel Hoca" },
  "seated-cable-row":       { id: "32H5kW4YUSI", channel: "Murat Tosun" },
  "machine-row":            { id: "h_jfnCWuG4M", channel: "GAINZZZUP Academy" },
  "lat-pulldown":           { id: "hEt8rkd7-Gk", channel: "Murat Tosun" },
  "shoulder-press-machine": { id: "sn1tvHMoqas", channel: "MAC+" },

  /* --- kablo --- */
  "face-pull":              { id: "1NSnmDZj_yI", channel: "Gel Gel Hoca" },
  "triceps-pushdown":       { id: "8lK9D16_kLo", channel: "Murat Tosun" },
  "cable-fly":              { id: "RYvQMNCnLJw", channel: "Murat Tosun" },
  "rear-delt-fly":          { id: "6JKxjZvbP1g", channel: "GAINZZZUP Academy" },

  /* --- serbest ağırlık · alt vücut --- */
  "goblet-squat":           { id: "T2V0-c5YbrY", channel: "Gel Gel Hoca" },
  "back-squat":             { id: "V9xzZK3lN-M", channel: "MACFit" },
  "front-squat":            { id: "DJPm5vLtchA", channel: "Ağırsağlam" },
  "romanian-deadlift":      { id: "ptk2Mn-01SA", channel: "Gel Gel Hoca" },
  "db-romanian-deadlift":   { id: "xAL7lHwj30E", channel: "Onnit Academy" },
  "deadlift":               { id: "1VrZ1QLTdUs", channel: "Ağırsağlam" },
  "hip-thrust":             { id: "jqTP7GV3Yr0", channel: "Simge Topcu" },
  "walking-lunge":          { id: "8DB8VDgmIG8", channel: "Fit Yaşa" },
  "bulgarian-split-squat":  { id: "70oT3bD5rSI", channel: "Egzersiz Rehberim" },
  "back-extension":         { id: "YTbNdJKZT-U", channel: "Gel Gel Hoca" },

  /* --- serbest ağırlık · üst vücut --- */
  "db-bench-press":         { id: "_JEK8J5C3rs", channel: "Gel Gel Hoca" },
  "barbell-bench-press":    { id: "HQMumy_G4oo", channel: "GAINZZZUP Academy" },
  "incline-db-press":       { id: "eQ7mv6MJEhk", channel: "GAINZZZUP Academy" },
  "overhead-press":         { id: "mDXg9jkVX_E", channel: "GAINZZZUP Academy" },
  "db-shoulder-press":      { id: "nSnVsYWs-wc", channel: "Gel Gel Hoca" },
  "lateral-raise":          { id: "2QmmLQV81Pc", channel: "GAINZZZUP Academy" },
  "barbell-row":            { id: "-lGIRM-tbDk", channel: "MACFit" },
  "pull-up":                { id: "XoYfYgCKruQ", channel: "Workout Akademi" },
  "biceps-curl":            { id: "PhcbWcU9lTo", channel: "Murat Tosun" },
  "hammer-curl":            { id: "sg70NYEojP0", channel: "Murat Tosun" },
  "skull-crusher":          { id: "H0wbKheDTUE", channel: "Murat Tosun" },
  "barbell-shrug":          { id: "I06teI-rzCc", channel: "Berkay Türkkan" },

  /* --- gövde ve hareketlilik --- */
  "plank":                  { id: "dp6xCq2ASAY", channel: "Egzersiz Rehberim" },
  "side-plank":             { id: "hYTF3EuvQVI", channel: "MACFit" },
  "dead-bug":               { id: "ZBMFwWSuVK0", channel: "Murat Tosun" },
  "hanging-leg-raise":      { id: "LteZy0NFGeM", channel: "MACFit" },
  "wall-angel":             { id: "1UU4VvklQ44", channel: "Vive Health" }
};

export function videoFor(exerciseId){
  return VIDEOS[exerciseId] || null;
}
