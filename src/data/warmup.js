/* ============================================================
   Isınma ve soğuma.

   Isınma eskiden index.html'e elle yazılmış üç satırdı: her seviyede,
   her günde aynı. Bacak gününden önce omuz açmak, itiş gününden önce
   kalça ısıtmak boşa harcanan dakikaydı. Artık günün ne olduğuna göre
   seçiliyor — hangi güne hangi ısınmanın gideceği programs.js'teki
   "warm" alanında yazılı.

   Buradaki hareketlerin set/ağırlık kaydı tutulmaz; ısınma antrenman
   değildir. Bu yüzden exercises.js'e değil buraya yazıldılar: orası
   ağırlığın arttığı hareketlerin yeri.

   Videolar yine data/videos.js üzerinden bağlanır, aynı kimliklerle.
   Kardiyo, yürüyüş ve "günün ilk hareketi" satırlarında video yoktur:
   izlenecek bir şey değiller. Bunlar noVideo ile işaretli, yoksa panel
   "video henüz yok" diye eksiklik bildirirdi — oysa eksik değil.
   ============================================================ */

export const WARM_MOVES = {

  "warm-cardio": {
    name: "Bisiklet ya da koşu bandı",
    dose: "5 dk",
    sub: "Konuşabileceğin tempoda",
    noVideo: true,
    why: "Isınan kas daha çok kan alır, eklem daha akışkan çalışır. Aynı ağırlık ısınmadan önce daha ağır gelir, sakatlanma payı da orada büyür.",
    cues: [
      "Nabzın yükselsin ama nefesin yetsin — yanındakiyle cümle kurabilmelisin.",
      "Hız değil süre önemli. Beş dakikayı doldur.",
      "Hafifçe terlemeye başladığın an ısındığının işaretidir."
    ],
    mistake: "Isınmayı antrenmanın parçası sanıp kendini yormak. Buradaki kardiyo yakıt değil, ısıtıcı; ilk ağır sete taze girmen gerekiyor."
  },

  "wall-angel": {
    name: "Wall angel",
    dose: "10 tk",
    sub: "Omuzları açar",
    why: "Gün boyu öne düşmüş omuzlarla bench'e yatmak, omuz ekleminin sıkışmasına açık bir kapı bırakır. Bu hareket ittirmeden önce o kapıyı kapatır.",
    cues: [
      "Sırtın, kalçan ve başın duvara değsin.",
      "Kolları duvardan ayırmadan yukarı kaydır, indir.",
      "Bel duvardan kalkıyorsa hareketi kısalt, zorlama."
    ],
    mistake: "Kolları duvardan koparıp havada tekrar saymak. Değmiyorsa hareket açıklığın oraya kadar; azıyla doğru yapmak çoğuyla yanlış yapmaktan iyidir."
  },

  "shoulder-mobility": {
    name: "Omuz açma ve çevirme",
    dose: "2 dk",
    sub: "Ağır itişten önce",
    why: "Omuz, vücudun en geniş açıklıkta çalışan eklemi. Soğukken doğrudan ağır bara girmek o açıklığın bir kısmını kilitler.",
    cues: [
      "Kolları büyük daireler çizerek öne ve arkaya çevir.",
      "Sonra bir sopa ya da havluyu geniş tutup baş üstünden arkaya geçir.",
      "Ağrı değil gerginlik hissi ara; ağrı çıktığı yerde dur."
    ],
    mistake: "Sallanarak hızlı yapmak. Mobilite hareketinde işi yapan tempo değil, kontrollü uçtaki o iki saniye."
  },

  "cat-cow": {
    name: "Kedi-deve",
    dose: "8 tk",
    sub: "Omurgayı uyandırır",
    why: "Çekiş ve kalça menteşesi hareketlerinde belin sabit kalması gerekir. Belin sabit kalabilmesi için önce hareket edebiliyor olması gerekir.",
    cues: [
      "Dört ayak üstünde, eller omuz, dizler kalça hizasında.",
      "Nefes verirken sırtı kambur yap, verirken çukurlaştır.",
      "Hareketi boyundan kuyruk sokumuna kadar yay, sadece belden kırma."
    ],
    mistake: "Yalnızca beli oynatıp sırtın üst kısmını hiç karıştırmamak. Asıl kilitli bölge çoğunlukla orası."
  },

  "bodyweight-squat": {
    name: "Ağırlıksız squat",
    dose: "10 tk",
    sub: "Kalıbı hatırlat",
    why: "Bara girmeden önce hareketin yolunu vücuda hatırlatır. İlk ağır set, tekniği düşündüğün set olmamalı.",
    cues: [
      "Ayaklar omuz genişliğinde, parmak uçları hafif dışa.",
      "Kalçayı geriye ve aşağıya götür, dizler ayak yönünde kalsın.",
      "Rahatça inebildiğin en alt noktaya kadar in, kontrollü kalk."
    ],
    mistake: "Bunu da sayarak, yorulana kadar yapmak. On tekrar hatırlatmak için yeter; yorulmak için değil."
  },

  "glute-bridge": {
    name: "Köprü",
    dose: "12 tk",
    sub: "Kalçayı devreye sokar",
    why: "Deadlift ve hip thrust'ta kalça çalışmazsa işi bel devralır. Bu hareket ağır sete girmeden önce doğru kasa haber verir.",
    cues: [
      "Sırtüstü yat, dizler bükülü, topuklar kalçaya yakın.",
      "Topuktan iterek kalçayı kaldır, yukarıda kalçayı bir saniye sık.",
      "Bel değil kalça kaldırsın — kaburgaları açma."
    ],
    mistake: "Yukarıda beli aşırı çukurlaştırmak. Yükseklik kalçadan gelmeli; bel bükerek kazanılan santimin faydası yok."
  },

  "hip-mobility": {
    name: "Kalça açma",
    dose: "2 dk",
    sub: "Squat ve kalça gününden önce",
    why: "Kalçası sıkı biri squat'ta dibe inemez, indiğinde de beli yuvarlanır. Birkaç dakikalık açma o açıklığı geri verir.",
    cues: [
      "Bacağı öne-arkaya ve yana-içe savur, her yönde 10 kez.",
      "Ardından tek diz üstünde öne uzanıp kalçanın ön yüzünü aç.",
      "Bir de derin squat pozisyonunda oturup dirsekle dizleri dışa it."
    ],
    mistake: "Soğuk kasa uzun statik esneme yapmak. Antrenmandan önce hareketli açma işe yarar; uzun germe kuvveti geçici olarak düşürür."
  },

  "first-move": {
    name: "Günün ilk hareketi, çok hafif",
    dose: "1 set",
    sub: "12 tekrar, sayılmaz",
    noVideo: true,
    why: "Genel ısınma vücudu ısıtır, bu set ise sinir sistemine o günkü hareketin yolunu gösterir. Asıl ağırlığa geçişin köprüsü.",
    cues: [
      "Çalışacağın ağırlığın yarısından azıyla yap.",
      "Tekrarları hızlı değil, teknik düşünerek geçir.",
      "Bu set kayda girmez; sayaç da başlatmaz."
    ],
    mistake: "Bu seti atlayıp doğrudan ağır sete girmek. En sık sakatlanılan set, günün ilk ağır setidir."
  }
};

/* Kategoriler günün hangi kalıba yaslandığını söyler; programs.js'teki
   her gün bunlardan birini seçer. */
export const WARMUPS = {
  full:  ["warm-cardio", "wall-angel", "bodyweight-squat", "first-move"],
  push:  ["warm-cardio", "shoulder-mobility", "wall-angel", "first-move"],
  pull:  ["warm-cardio", "cat-cow", "shoulder-mobility", "first-move"],
  legs:  ["warm-cardio", "hip-mobility", "bodyweight-squat", "first-move"],
  hinge: ["warm-cardio", "cat-cow", "glute-bridge", "first-move"]
};

export const COOL_MOVES = {

  "cool-walk": {
    name: "Hafif yürüyüş",
    dose: "4 dk",
    sub: "Nabzı indir",
    noVideo: true,
    why: "Son setten sonra nabız yüksek, kan çalışan kaslarda birikmiş durumda. Birkaç dakika yürümek toparlanmayı erken başlatır.",
    cues: [
      "Konuşabildiğinden de yavaş bir tempo yeterli.",
      "Nefesin normale dönene kadar sürdür.",
      "Doğrudan oturup telefona bakmaktan iyidir."
    ],
    mistake: "Seansı son setle bitirip salondan koşarak çıkmak. Dört dakikanın maliyeti düşük, faydası gerçek."
  },

  "chest-stretch": {
    name: "Göğüs esnetme",
    dose: "30 sn",
    sub: "Her iki tarafa",
    why: "İtiş hareketleri göğsü kısaltır. Esnetilmezse omuz zamanla öne düşer; duruş bozukluğunun en yaygın sebeplerinden biri budur.",
    cues: [
      "Kolu bir kapı kenarına ya da kafese dayayıp gövdeni karşı yöne çevir.",
      "Göğsün ön yüzünde gerginlik hissedeceksin, omuzda değil.",
      "Otuz saniye tut, nefesini tutma."
    ],
    mistake: "Zorlayıp omuzda ağrı hissedene kadar itmek. Esneme gerginlik hissidir; ağrı başladığı yerde çoktan geçilmiştir."
  },

  "hip-flexor-stretch": {
    name: "Kalça ön yüzü esnetme",
    dose: "30 sn",
    sub: "Her iki tarafa",
    why: "Gün boyu oturmak kalçanın ön yüzünü kısaltır, squat ve deadlift onu bir de yorar. Kısa kalan bu kas beli öne çeker.",
    cues: [
      "Tek diz üstüne çök, öndeki ayak düz.",
      "Kalçayı öne it, kuyruk sokumunu hafifçe içeri al.",
      "Arkadaki bacağın kalça ön yüzünde gerginlik hissetmelisin."
    ],
    mistake: "Öne uzanırken beli çukurlaştırmak. O zaman gerginlik kalçada değil belde hissedilir ve hareket amacını kaybeder."
  }
};

export const COOLDOWN = ["cool-walk", "chest-stretch", "hip-flexor-stretch"];

/* Bir güne hangi ısınmanın gideceğini çözer. Tanımsız bir kategori
   gelirse tüm vücut ısınması güvenli varsayılan. */
export function warmupFor(day){
  return (WARMUPS[day && day.warm] || WARMUPS.full).map(id => ({ id, ...WARM_MOVES[id] }));
}

export function cooldown(){
  return COOLDOWN.map(id => ({ id, ...COOL_MOVES[id] }));
}

export function warmMove(id){
  return WARM_MOVES[id] || COOL_MOVES[id] || null;
}
