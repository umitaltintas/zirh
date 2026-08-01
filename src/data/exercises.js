/* ============================================================
   Hareket kataloğu.

   Burada bir hareketin DEĞİŞMEYEN yanı durur: ne işe yarar, nasıl
   yapılır, hangi hatayla bozulur. Kaç set kaç tekrar yapılacağı
   programa aittir — o bilgi programs.js'te.

   step  : ağırlığın artacağı en küçük makul kademe (kg)
   start : hiç kaydı olmayan biri için başlangıç önerisi
   bw    : vücut ağırlığı — ağırlık alanı yerine not gösterilir
   gear  : ağırlığın bindiği alet; plaka dizilimi buna göre hesaplanır
           "bar" olimpik bar 20 kg · "ez" EZ bar 10 kg ·
           "dambil" ve "makine" plakasız, kilo doğrudan · "vucut" ek yük yok
   group : hareket kalıbı — haftalık dengeyi bununla sayıyoruz
           "itis" · "cekis" · "bacak" · "kalca" · "govde" · "mobilite"
   swap  : bu hareketin yerine geçebilecekler, yakından uzağa
   video : YouTube kimliği (data/videos.js üzerinden bağlanır)

   Neden target değil de ayrı bir group alanı: target ("Sırt · Kanat ·
   Biceps") insana okunsun diye yazılmış bir cümle ve otuz farklı
   değeri var. Haftalık dengeyi ondan saymak, aynı işi yapan iki
   hareketi iki ayrı kutuya düşürürdü. group ise beş kaba kalıp —
   yeni başlayanın gözden kaçırdığı asıl dengesizlik bu ölçekte
   oluyor: itiş çok, çekiş az.

   Mobilite hareketi (wall-angel) hacim sayımının dışında: ısınma
   niteliğinde, çekiş hacmi diye sayılırsa haftalık denge olduğundan
   iyi görünür.

   swap listesi yalnızca aynı kalıptan hareket içerir ve alet
   çeşitliliğine göre sıralanır: makine doluysa serbest ağırlık
   karşılığı, bar yoksa dambıl karşılığı önce gelsin.
   ============================================================ */

export const EXERCISES = {

  /* ---------- makine · alt vücut ---------- */

  "leg-press": {
    name: "Leg Press", alt: "Yatık bacak itiş makinesi", target: "Bacak · Kalça",
    step: 5, gear: "makine", start: {erkek: "40-60 kg", kadin: "20-40 kg"},
    group: "bacak", swap: ["goblet-squat", "back-squat", "walking-lunge"],
    why: "Bacağın tamamını tek harekette çalıştırır. Denge gerektirmediği için ilk günden anlamlı ağırlık kaldırabilirsin.",
    cues: [
      "Ayaklar omuz genişliğinde, platformun ortasında.",
      "Dizler göğse doğru yaklaşana kadar in, bel minderden kalkmasın.",
      "Yukarıda dizleri sertçe kilitleme, hafif bükülü bırak.",
      "İniş 2 saniye, itiş 1 saniye. Ağırlığı düşürme, indir."
    ],
    mistake: "Makineye devasa ağırlık koyup 5-10 cm oynatmak. Yarım hareket açıklığı, yarım sonuç verir; tam açıklık kas gelişimi için açık ara daha iyi."
  },

  "leg-press-high": {
    name: "Leg Press · yüksek ayak", alt: "Ayaklar platformda yukarıda", target: "Kalça · Arka bacak",
    step: 5, gear: "makine", start: {erkek: "A gününün %70'i", kadin: "A gününün %70'i"},
    group: "kalca", swap: ["hip-thrust", "romanian-deadlift", "seated-leg-curl"],
    why: "Ayakları yukarı almak yükü ön bacaktan kalça ve arka bacağa kaydırır. Aynı makine, farklı kas.",
    cues: [
      "Ayakları platformun üst yarısına yerleştir.",
      "Topuktan it, parmak uçlarından değil.",
      "Topukların platformdan kalkıyorsa ayakları biraz aşağı al.",
      "Tam açıklık, kontrollü iniş."
    ],
    mistake: "Ayakları çok yukarı alıp belin minderden kalkması. Bel kalkıyorsa hareket açıklığını kısalt."
  },

  "seated-leg-curl": {
    name: "Seated Leg Curl", alt: "Oturarak arka bacak makinesi", target: "Arka bacak",
    step: 2.5, gear: "makine", start: {erkek: "15-25 kg", kadin: "10-20 kg"},
    group: "kalca", swap: ["romanian-deadlift", "db-romanian-deadlift", "back-extension"],
    why: "Leg press ön bacağı çalıştırır, arkası boş kalır. Bu hareket dengeyi kurar, diz sağlığına da iyi gelir.",
    cues: [
      "Diz eklemin makinenin dönme ekseniyle aynı hizada olsun.",
      "Üst bacak pedini kalçan yerinden oynamayacak kadar sıkı ayarla.",
      "Aşağıda 1 saniye sık, geri bırakırken kontrolü bırakma."
    ],
    mistake: "Ağırlığı bacakla değil kalçayı sandalyeden kaldırarak çekmek."
  },

  "leg-extension": {
    name: "Leg Extension", alt: "Oturarak ön bacak makinesi", target: "Ön bacak",
    step: 2.5, gear: "makine", start: {erkek: "20-30 kg", kadin: "10-20 kg"},
    group: "bacak", swap: ["leg-press", "bulgarian-split-squat", "goblet-squat"],
    why: "Ön bacağı tek başına, yorulmuş kalça kaslarına bağlı kalmadan çalıştırır. Squat sonrası kalan boşluğu doldurur.",
    cues: [
      "Sırtını mindere yasla, kalçan koltuktan kalkmasın.",
      "Diz eklemin makinenin dönme ekseniyle aynı hizada.",
      "Yukarıda 1 saniye sık, sonra 2 saniyede indir.",
      "Ağırlığı sallayarak değil, kasla kaldır."
    ],
    mistake: "Ağırlığı yukarı fırlatıp serbest bırakmak. En çok kas gelişimi indirirken oluyor; o kısmı hızlı geçmek harcanmış bir set demek."
  },

  "calf-raise": {
    name: "Calf Raise", alt: "Ayakta baldır kaldırış", target: "Baldır",
    step: 5, gear: "makine", start: {erkek: "20-40 kg", kadin: "10-25 kg"},
    group: "bacak",
    why: "Baldır, günlük yürüyüşe alışık olduğu için ancak tam açıklık ve yüksek tekrarla uyarılır. Ayak bileği sağlamlığına da doğrudan katkısı var.",
    cues: [
      "Ayak parmak yastıkları basamakta, topuklar boşta.",
      "Topuğu esneme hissedene kadar aşağı bırak.",
      "Tepede parmak ucunda 1 saniye dur.",
      "Zıplayarak değil, yavaş ve kontrollü."
    ],
    mistake: "Kısa aralıkta hızlı hızlı zıplamak. Baldır yayı işi devralır, kas neredeyse hiç çalışmaz."
  },

  /* ---------- makine · üst vücut ---------- */

  "chest-press-machine": {
    name: "Machine Chest Press", alt: "Oturarak göğüs itiş makinesi", target: "Göğüs · Omuz · Triceps",
    step: 2.5, gear: "makine", start: {erkek: "20-30 kg", kadin: "10-15 kg"},
    group: "itis", swap: ["db-bench-press", "barbell-bench-press", "cable-fly"],
    why: "Bench press'in öğrenmesi kolay hâli. Spotter'a ihtiyacın yok, ağırlık üstüne düşmez.",
    cues: [
      "Koltuğu, tutamaklar göğsünün ortasına gelecek şekilde ayarla.",
      "Kürek kemiklerini geriye ve aşağı bastır, sırtın mindere yapışsın.",
      "Dirsekler gövdeden 45 derece açık; omuz hizasının çok arkasına geçme.",
      "İtişte kolları uzat ama dirseği kilitleme."
    ],
    mistake: "Koltuk ayarını atlamak. Tutamaklar omuz hizasında kalırsa yük göğüsten çıkıp omuz eklemine biner."
  },

  "seated-cable-row": {
    name: "Seated Cable Row", alt: "Oturarak kabloyla karna çekiş", target: "Sırt · Arka omuz · Biceps",
    step: 2.5, gear: "makine", start: {erkek: "25-35 kg", kadin: "15-25 kg"},
    group: "cekis", swap: ["machine-row", "barbell-row", "lat-pulldown"],
    why: "Gün boyu öne kapanan omuzların karşı ağırlığı. Duruş için programdaki en değerli hareket.",
    cues: [
      "Dizler hafif bükülü, gövde dik, sırt doğal kavisinde.",
      "Barı göbeğinin üstüne çek, göğsüne değil.",
      "Dirsekleri gövdene yakın tut, bitişte kürekleri birbirine yaklaştır.",
      "Geri bırakırken kürekleri açıp sırtını esnet."
    ],
    mistake: "Gövdeyi öne arkaya sallayarak çekmek. O zaman sırt değil bel çalışır ve ağırlık büyür ama kas büyümez."
  },

  "machine-row": {
    name: "Machine Row", alt: "Göğüs destekli makine çekiş", target: "Sırt · Arka omuz",
    step: 2.5, gear: "makine", start: {erkek: "25-40 kg", kadin: "15-25 kg"},
    group: "cekis", swap: ["seated-cable-row", "barbell-row", "lat-pulldown"],
    why: "Göğüs pede yaslandığı için bel tamamen devre dışı kalır. Sırtı yormadan çok set yapabileceğin en güvenli çekiş.",
    cues: [
      "Göğsün pede tam yaslansın, koltuk yüksekliğini buna göre ayarla.",
      "Önce kürekleri geri çek, sonra dirsek at.",
      "Bitişte 1 saniye sık, gövdeni pedden ayırma.",
      "Geri bırakırken kolları tam uzat."
    ],
    mistake: "Gövdeyi pedden kaldırarak çekmek. Makinenin tek amacı beli korumaktı, o an amaç kayboluyor."
  },

  "lat-pulldown": {
    name: "Lat Pulldown", alt: "Yukarıdan aşağı çekiş", target: "Sırt · Kanat · Biceps",
    step: 2.5, gear: "makine", start: {erkek: "25-35 kg", kadin: "15-25 kg"},
    group: "cekis", swap: ["pull-up", "seated-cable-row", "machine-row"],
    why: "Barfiksin ayarlanabilir hâli. Sırtın genişliğini ve omuz sağlığını birlikte kurar.",
    cues: [
      "Eller omuz genişliğinden biraz açık, diz pedi bacaklarına tam temas etsin.",
      "Barı köprücük kemiği hizasına çek, göğsünü aç.",
      "Önce kürekleri aşağı bastır, sonra dirsek at.",
      "Yukarıda kolları tam uzat, sırtını esnet."
    ],
    mistake: "Barı ensenin arkasına çekmek. Omuz için gereksiz risk, ekstra faydası yok."
  },

  "shoulder-press-machine": {
    name: "Machine Shoulder Press", alt: "Oturarak omuz itiş makinesi", target: "Omuz · Triceps",
    step: 2.5, gear: "makine", start: {erkek: "15-25 kg", kadin: "7-12 kg"},
    group: "itis", swap: ["db-shoulder-press", "overhead-press", "incline-db-press"],
    why: "Omuzun ön ve yan başını çalıştırır. Üst vücuda genişlik veren ve baş üstü işleri kolaylaştıran hareket.",
    cues: [
      "Koltuğu, tutamaklar omuz hizasına gelecek şekilde ayarla.",
      "Sırtın mindere yaslı, karnın sıkı.",
      "Yukarıda dirsekleri kilitleme.",
      "İnişte dirsekler omuz hizasının biraz altına insin, daha derine değil."
    ],
    mistake: "Beli minderden kaldırıp hareketi göğüs presine çevirmek."
  },

  /* ---------- kablo ---------- */

  "face-pull": {
    name: "Face Pull", alt: "Halatla yüze çekiş", target: "Arka omuz · Üst sırt",
    step: 2.5, gear: "makine", start: {erkek: "10-15 kg", kadin: "5-10 kg"},
    group: "cekis", swap: ["rear-delt-fly", "machine-row", "seated-cable-row"],
    why: "Duruş için wall angel'dan daha etkili. Öne dönen omuzları geri çeken kasları doğrudan güçlendirir.",
    cues: [
      "Halatı göz hizasına ayarla.",
      "Halatı yüzüne doğru çek, eller kulak hizasında birbirinden ayrılsın.",
      "Bitişte kürekleri sık ve 1 saniye bekle.",
      "Hafif ağırlıkla çalış. Bu hareket bir ağırlık yarışı değil."
    ],
    mistake: "Ağırlığı artırıp gövdeyi geriye yatırmak. Hedef kas devreden çıkar."
  },

  "triceps-pushdown": {
    name: "Triceps Pushdown", alt: "Kabloyla aşağı itiş", target: "Triceps",
    step: 2.5, gear: "makine", start: {erkek: "15-25 kg", kadin: "7-15 kg"},
    group: "itis", swap: ["skull-crusher"],
    why: "Kolun arka yüzünü doğrudan çalıştırır. Bench ve omuz presinde takıldığın nokta çoğu zaman burasıdır.",
    cues: [
      "Dirsekleri gövdene sabitle, hareket sadece dirsekten olsun.",
      "Aşağıda kolları tam uzat, 1 saniye sık.",
      "Yukarıya kontrollü bırak, ağırlık seni çekmesin.",
      "Gövdeni öne yatırıp üstüne abanma."
    ],
    mistake: "Dirsekleri yanlara açıp gövde ağırlığıyla bastırmak. O an hareketi göğüs devralıyor."
  },

  "cable-fly": {
    name: "Cable Fly", alt: "Kabloyla göğüs açış", target: "Göğüs",
    step: 2.5, gear: "makine", start: {erkek: "7-12 kg / taraf", kadin: "4-7 kg / taraf"},
    group: "itis", swap: ["incline-db-press", "db-bench-press", "chest-press-machine"],
    why: "Göğsü esnemenin en derin noktasında yükler — itiş hareketlerinin veremediği uyaran budur.",
    cues: [
      "Bir ayak önde, gövde hafif öne eğik.",
      "Dirsekler hafif bükülü ve sabit; kolları kucaklar gibi birleştir.",
      "Ortada 1 saniye sık, sonra kontrollü aç.",
      "Açarken göğsünde esneme hissedeceğin noktadan geri dönme."
    ],
    mistake: "Dirseği açıp kapatarak hareketi press'e çevirmek. Fly'da dirsek açısı baştan sona sabit kalır."
  },

  "rear-delt-fly": {
    name: "Rear Delt Fly", alt: "Öne eğilip arka omuz açış", target: "Arka omuz · Üst sırt",
    step: 2, gear: "dambil", start: {erkek: "5-8 kg", kadin: "2-5 kg"},
    group: "cekis", swap: ["face-pull", "machine-row"],
    why: "Omzun en çok ihmal edilen başı. Ön ve yan omuz büyürken burası zayıf kalırsa omuz öne dönmeye başlar.",
    cues: [
      "Gövde neredeyse yere paralel, sırt düz.",
      "Dirsekler hafif bükülü, kolları yanlara doğru aç.",
      "Eli değil dirseği yukarı götürmeye çalış.",
      "Çok hafif ağırlık kullan; 15 tekrar rahat gelmeli."
    ],
    mistake: "Ağır dambılla gövdeyi doğrultup hareketi çekişe dönüştürmek. Arka omuz o an hiç çalışmıyor."
  },

  /* ---------- serbest ağırlık · alt vücut ---------- */

  "goblet-squat": {
    name: "Goblet Squat", alt: "Göğüste dambılla squat", target: "Bacak · Kalça · Gövde",
    step: 2, gear: "dambil", start: {erkek: "10-16 kg", kadin: "6-10 kg"},
    group: "bacak", swap: ["back-squat", "leg-press", "bulgarian-split-squat"],
    why: "Squat öğrenmenin en kolay yolu. Ağırlık önde olduğu için gövde kendiliğinden dik kalır, form kendi kendini düzeltir.",
    cues: [
      "Dambılı göğsünün önünde dik tut, dirsekler aşağıda.",
      "Ayaklar omuz genişliğinde, parmak uçları hafif dışa.",
      "Kalçayı geriye ve aşağıya götür; dizler ayak parmaklarını takip etsin.",
      "Uyluk yere paralel olana kadar in, sonra topuktan it."
    ],
    mistake: "Topukların yerden kalkması. Kalkıyorsa ayakları biraz açıp derinliği kısalt; ağırlığı artırmak sorunu büyütür."
  },

  "back-squat": {
    name: "Back Squat", alt: "Ense arkası barla squat", target: "Bacak · Kalça · Gövde",
    step: 5, gear: "bar", start: {erkek: "boş bar, 20 kg", kadin: "boş bar, 20 kg"},
    group: "bacak", swap: ["goblet-squat", "front-squat", "leg-press"],
    why: "Alt vücudun temel taşı. Aynı anda en çok kas kütlesini yükleyen ve en çok güç kazandıran hareket.",
    cues: [
      "Bar ense değil, üst sırt kaslarının üstünde otursun.",
      "Nefes al, karnını sık, sonra kalçayı geriye götürerek in.",
      "Uyluk yere paralel ya da biraz altına insin.",
      "Kalkarken kalça ve göğüs aynı anda yükselsin."
    ],
    mistake: "Kalkışta kalçanın önden fırlaması ve gövdenin öne yatması. Bu, ağırlığın erken olduğunun işareti — beş kilo düş."
  },

  "front-squat": {
    name: "Front Squat", alt: "Bar önde squat", target: "Ön bacak · Gövde",
    step: 5, gear: "bar", start: {erkek: "boş bar, 20 kg", kadin: "boş bar, 20 kg"},
    group: "bacak", swap: ["back-squat", "goblet-squat", "leg-press"],
    why: "Bar önde olduğu için gövde dik kalmak zorunda. Ön bacağı back squat'tan daha çok yükler, karnı da baştan sona çalıştırır.",
    cues: [
      "Bar omuz önünde, parmak uçlarıyla desteklenir; dirsekler yukarıda.",
      "Dirsekler baştan sona yukarıda kalsın, düşerse bar kayar.",
      "Gövde dik, doğrudan aşağı in.",
      "Back squat'ın yaklaşık %70'i kadar ağırlıkla çalış."
    ],
    mistake: "Dirsekleri aşağı düşürmek. Bar öne kayar ve hareketi bırakmak zorunda kalırsın."
  },

  "romanian-deadlift": {
    name: "Romanian Deadlift", alt: "Barla romen deadlift", target: "Arka bacak · Kalça · Bel",
    step: 5, gear: "bar", start: {erkek: "boş bar, 20 kg", kadin: "boş bar, 20 kg"},
    group: "kalca", swap: ["db-romanian-deadlift", "hip-thrust", "seated-leg-curl"],
    why: "Arka bacak ve kalçayı esneme altında yükler — bu programda o bölgeyi geliştiren asıl hareket.",
    cues: [
      "Dizler hafif bükülü ve o açıda sabit kalır.",
      "Kalçayı geriye it, bar bacaklarına sürte sürte insin.",
      "Arka bacakta esneme hissettiğin yerde dur; yere değmesi gerekmez.",
      "Kalkarken kalçayı öne sık."
    ],
    mistake: "Sırtı yuvarlayıp yere kadar inmek. Hareketi bel bitirir ve sakatlık burada olur — sırt düz kalmıyorsa orası senin alt sınırın."
  },

  "db-romanian-deadlift": {
    name: "Dambıl Romanian Deadlift", alt: "İki dambılla romen deadlift", target: "Arka bacak · Kalça",
    step: 2, gear: "dambil", start: {erkek: "10-16 kg / el", kadin: "6-10 kg / el"},
    group: "kalca", swap: ["romanian-deadlift", "hip-thrust", "seated-leg-curl"],
    why: "Barlı hâlinin öğrenmesi kolay versiyonu. Dambıllar bacağın yanında gittiği için sırtı yuvarlama eğilimi daha az.",
    cues: [
      "Dambıllar bacakların önünde, kollar gergin ama omuzlar geride.",
      "Dizler hafif bükülü, kalçayı geriye it.",
      "Dambıllar bacağına yakın insin, ileri sarkmasın.",
      "Arka bacakta esneme hissettiğin noktada dur."
    ],
    mistake: "Hareketi squat gibi yapmak. Bu bir diz hareketi değil kalça hareketi — dizler neredeyse hiç kırılmaz."
  },

  "deadlift": {
    name: "Deadlift", alt: "Yerden bar kaldırma", target: "Sırt · Kalça · Arka bacak",
    step: 5, gear: "bar", start: {erkek: "40-50 kg", kadin: "30-40 kg"},
    group: "kalca", swap: ["romanian-deadlift", "db-romanian-deadlift", "hip-thrust"],
    why: "Vücudun arka zincirinin tamamını tek harekette yükler. Doğru yapıldığında bel için en koruyucu hareketlerden biri.",
    cues: [
      "Bar ayak ortasının üstünde, kaval kemiğine yakın.",
      "Nefes al, karnını sık, göğsünü yukarı ver — sırt düz.",
      "Baştan ayaklarla yere bas; bar bacaklarına sürterek yükselsin.",
      "Kalça ve omuz aynı anda yükselsin; tepede kalçayı sık, geriye yaslanma."
    ],
    mistake: "Ağırlığa erken geçmek. Deadlift affetmez — form bozulduğu ilk tekrarda seti bitir, gerisini zorlama."
  },

  "hip-thrust": {
    name: "Hip Thrust", alt: "Bench destekli kalça kaldırış", target: "Kalça · Arka bacak",
    step: 5, gear: "bar", start: {erkek: "boş bar, 20 kg", kadin: "10-20 kg"},
    group: "kalca", swap: ["romanian-deadlift", "leg-press-high", "back-extension"],
    why: "Kalça kaslarının en doğrudan çalıştığı hareket. Güçlü kalça, beli ve dizi koruyan yapının temeli.",
    cues: [
      "Kürek kemiklerin bench'in kenarına gelsin, ayaklar kalça genişliğinde.",
      "Tepede gövden yere paralel olsun; daha yukarı çıkmaya çalışma.",
      "Tepede kalçanı 1 saniye sık.",
      "Çeneni göğsüne yakın tut, bakışların ileride kalsın."
    ],
    mistake: "Tepede beli aşırı çukurlaştırıp kalçadan değil belden yükselmek. Bar kullanıyorsan ped ya da havlu sar."
  },

  "walking-lunge": {
    name: "Walking Lunge", alt: "Yürüyerek hamle", target: "Bacak · Kalça · Denge",
    step: 2, gear: "dambil", start: {erkek: "8-12 kg / el", kadin: "4-8 kg / el"},
    group: "bacak", swap: ["bulgarian-split-squat", "goblet-squat", "leg-press"],
    why: "Tek bacak çalıştığı için iki bacak arasındaki güç farkını ortaya çıkarır ve kapatır. Denge ve kalça istikrarı da birlikte gelişir.",
    cues: [
      "Uzun adım at, arka diz yere yaklaşana kadar in.",
      "Gövde dik, bakışlar ileride.",
      "Ön ayağın topuğundan iterek kalk.",
      "Ön diz ayak parmaklarını çok geçmesin."
    ],
    mistake: "Kısa adımla dizi öne fırlatmak. Adımı uzatınca yük dizden kalçaya geçer ve hareket rahatlar."
  },

  "bulgarian-split-squat": {
    name: "Bulgarian Split Squat", alt: "Arka ayak bench'te tek bacak squat", target: "Bacak · Kalça",
    step: 2, gear: "dambil", start: {erkek: "vücut ağırlığı → 8 kg / el", kadin: "vücut ağırlığı → 4 kg / el"},
    group: "bacak", swap: ["walking-lunge", "goblet-squat", "leg-press"],
    why: "Tek bacağa ağır yük bindiren, buna karşılık beli neredeyse hiç yormayan nadir hareketlerden. Zorluğu ağırlıktan değil pozisyondan alır.",
    cues: [
      "Arka ayağın üstü bench'te, ön ayak bir adım ileride.",
      "Gövde hafif öne eğik; kalçayı daha çok çalıştırır.",
      "Ön uyluk yere paralel olana kadar in.",
      "Ön topuktan it, arka bacağı iş yaptırmaya çalışma."
    ],
    mistake: "Ön ayağı çok yakın koymak. Diz öne fırlar ve tüm yük diz kapağına biner — bir adım daha ileri al."
  },

  "back-extension": {
    name: "Back Extension", alt: "Roma sandalyesinde bel ekstansiyonu", target: "Bel · Kalça · Arka bacak",
    step: 2.5, gear: "makine", start: {erkek: "vücut ağırlığı", kadin: "vücut ağırlığı"},
    group: "kalca", swap: ["romanian-deadlift", "hip-thrust"],
    why: "Beli güçlendirmek onu korumanın yoludur. Ağır kaldıran herkesin bu bölgeye ayrı bir çalışma borcu var.",
    cues: [
      "Kalça pedin kenarında olsun, kalçadan kırılabilesin.",
      "İnerken sırtını düz tut, kalçadan eğil.",
      "Gövden bacaklarınla aynı hizaya gelince dur.",
      "Tepede kalçayı sık, geriye aşırı yaslanma."
    ],
    mistake: "Tepede geriye doğru yaylanmak. Omurgayı gereksiz yere sıkıştırır, hiçbir faydası yok."
  },

  /* ---------- serbest ağırlık · üst vücut ---------- */

  "db-bench-press": {
    name: "Dambıl Bench Press", alt: "Düz bench'te dambılla itiş", target: "Göğüs · Omuz · Triceps",
    step: 2, gear: "dambil", start: {erkek: "10-16 kg / el", kadin: "5-8 kg / el"},
    group: "itis", swap: ["barbell-bench-press", "chest-press-machine", "incline-db-press"],
    why: "Barla yapılana göre omuz için daha nazik, hareket açıklığı daha geniş. Her kol kendi yükünü taşıdığı için zayıf taraf saklanamaz.",
    cues: [
      "Kürek kemiklerini geriye ve aşağı bastır, göğsünü yukarı ver.",
      "Dambıllar göğüs hizasında, dirsekler gövdeden 45 derece açık.",
      "İnişte dirsekler gövde hizasının biraz altına.",
      "Yukarıda dambıllar birbirine yaklaşsın ama çarpmasın."
    ],
    mistake: "Dambılları omuz hizasında değil yüz hizasında itmek. Yük göğüsten çıkıp omuz ekleminin önüne biner."
  },

  "barbell-bench-press": {
    name: "Bench Press", alt: "Düz bench'te barla itiş", target: "Göğüs · Omuz · Triceps",
    step: 2.5, gear: "bar", start: {erkek: "boş bar, 20 kg", kadin: "boş bar, 20 kg"},
    group: "itis", swap: ["db-bench-press", "chest-press-machine", "incline-db-press"],
    why: "Üst vücudun en çok ağırlık kaldırabildiğin hareketi. Güç ölçmenin de standardı.",
    cues: [
      "Gözlerin barın tam altında; kürekler geride ve aşağıda sıkışık.",
      "Barı göğsünün alt yarısına, meme hizasına indir.",
      "Ayaklar yere sabit bassın; bacaklardan destek al.",
      "Dirsekler 45 derece; tam yanlara açma."
    ],
    mistake: "Tek başına ağır set yapmak. Ya kafeste güvenlik demirleriyle çalış ya da yanına birini çağır."
  },

  "incline-db-press": {
    name: "Incline Dambıl Press", alt: "Eğik bench'te dambılla itiş", target: "Üst göğüs · Omuz",
    step: 2, gear: "dambil", start: {erkek: "8-14 kg / el", kadin: "4-7 kg / el"},
    group: "itis", swap: ["db-bench-press", "chest-press-machine", "cable-fly"],
    why: "Göğsün üst kısmı düz bench'te yeterince çalışmaz. Göğsün dolgun görünmesini sağlayan kısım burasıdır.",
    cues: [
      "Bench 30 derece olsun; daha dik açı hareketi omuz presine çevirir.",
      "Kürekler geride, göğüs yukarıda.",
      "Dambıllar köprücük kemiği hizasında hareket etsin.",
      "Düz bench'ten daha hafif başla, normal."
    ],
    mistake: "Bench'i 45 derecenin üstüne kurmak. O açıdan sonra iş göğüsten çıkıp omuza geçer."
  },

  "overhead-press": {
    name: "Overhead Press", alt: "Ayakta barla baş üstü itiş", target: "Omuz · Triceps · Gövde",
    step: 2.5, gear: "bar", start: {erkek: "boş bar, 20 kg", kadin: "15-20 kg"},
    group: "itis", swap: ["db-shoulder-press", "shoulder-press-machine", "incline-db-press"],
    why: "Ayakta yapıldığı için omuzla birlikte gövdenin tamamını çalıştırır. Baş üstü güç kazanmanın temel hareketi.",
    cues: [
      "Bar köprücük kemiğinin üstünde, dirsekler barın biraz önünde.",
      "Kalçayı ve karnını sık; bel çukurlaşmasın.",
      "Barı yüzünün önünden geçirmek için çeneni hafif geri çek.",
      "Tepede bar kulaklarının hizasında olsun, önünde değil."
    ],
    mistake: "Beli geriye yaslayarak itmek. Hareket eğik bench press'e döner ve bel yüklenir — ağırlığı düşür."
  },

  "db-shoulder-press": {
    name: "Dambıl Shoulder Press", alt: "Oturarak dambılla omuz itiş", target: "Omuz · Triceps",
    step: 2, gear: "dambil", start: {erkek: "8-12 kg / el", kadin: "4-6 kg / el"},
    group: "itis", swap: ["overhead-press", "shoulder-press-machine", "lateral-raise"],
    why: "Barlı hâlinden daha geniş hareket açıklığı verir ve omuz ekleminin doğal yolunu izlemene izin verir.",
    cues: [
      "Sırtını mindere yasla, karnını sık.",
      "Dambıllar kulak hizasından başlasın.",
      "Yukarıda dambıllar birbirine yaklaşsın, dirsekleri kilitleme.",
      "İnişte dirsek omuz hizasının biraz altına gelsin."
    ],
    mistake: "Dambılları çok aşağı indirip omuzu zorlamak. Omuz hizasının bir parmak altı yeterli derinlik."
  },

  "lateral-raise": {
    name: "Lateral Raise", alt: "Yanlara dambıl kaldırış", target: "Yan omuz",
    step: 2, gear: "dambil", start: {erkek: "5-8 kg", kadin: "2-4 kg"},
    group: "itis", swap: ["db-shoulder-press", "shoulder-press-machine"],
    why: "Omuzun yan başını çalıştıran neredeyse tek hareket. Omuz genişliğini bu kas belirler.",
    cues: [
      "Gövde dik, dirsekler hafif bükülü.",
      "Kolları omuz hizasına kadar kaldır, daha yukarı değil.",
      "Eli değil dirseği yukarı götürüyormuş gibi düşün.",
      "İndirirken 2 saniye say; serbest bırakma."
    ],
    mistake: "Ağır dambılla gövdeyi sallayarak kaldırmak. Bu harekette 4 kilo çok, 12 kilo hiçbir şey — hafif tut."
  },

  "barbell-row": {
    name: "Barbell Row", alt: "Öne eğilip barla çekiş", target: "Sırt · Arka omuz · Biceps",
    step: 2.5, gear: "bar", start: {erkek: "30-40 kg", kadin: "20-25 kg"},
    group: "cekis", swap: ["seated-cable-row", "machine-row", "lat-pulldown"],
    why: "Sırt kalınlığının temel hareketi. Aynı anda bel ve gövde sabitleyicilerini de çalıştırır.",
    cues: [
      "Kalçadan kırıl, gövde yere 45 dereceye yakın; sırt düz.",
      "Barı göbeğine doğru çek, göğsüne değil.",
      "Bitişte kürekleri sık, dirsekler gövdene yakın.",
      "Karnını baştan sona sıkı tut."
    ],
    mistake: "Her tekrarda gövdeyi doğrultup ağırlığı savurmak. Gövde açısı set boyunca sabit kalmalı."
  },

  "pull-up": {
    name: "Barfiks", alt: "Barda kendini yukarı çekme", target: "Sırt · Kanat · Biceps",
    step: 0, bw: true, gear: "vucut", start: {erkek: "vücut ağırlığı", kadin: "vücut ağırlığı"},
    group: "cekis", swap: ["lat-pulldown", "seated-cable-row", "machine-row"],
    why: "Üst vücut çekiş gücünün ölçüsü. Kendi ağırlığını kaldırabilmek başka hiçbir hareketin vermediği bir şey.",
    cues: [
      "Eller omuz genişliğinden biraz açık, avuç içleri ileri.",
      "Önce kürekleri aşağı bastır, sonra çek.",
      "Çenen barı geçene kadar çık.",
      "Aşağıda kolları tam uzat ama sallanma."
    ],
    mistake: "Yarım tekrar yapıp sayıyı büyütmek. Yapamıyorsan lastik bantla ya da destekli barfiks makinesiyle başla — yarım tekrar seni ileri götürmüyor."
  },

  "biceps-curl": {
    name: "Dambıl Biceps Curl", alt: "Ayakta dambılla kol bükme", target: "Biceps",
    step: 2, gear: "dambil", start: {erkek: "8-12 kg", kadin: "4-6 kg"},
    group: "cekis", swap: ["hammer-curl", "lat-pulldown"],
    why: "Çekiş hareketleri biceps'i çalıştırır ama doğrudan yüklemez. Kolun görünür kısmını bu hareket büyütür.",
    cues: [
      "Dirsekler gövdene sabit, sadece ön kol hareket etsin.",
      "Yukarıda 1 saniye sık.",
      "İndirirken 2 saniye say, serbest bırakma.",
      "Gövdeni geriye yaslama."
    ],
    mistake: "Ağırlığı kalçayla savurup yukarı fırlatmak. Curl'de hile yapmak en kolay iş, bu yüzden de en sık yapılan."
  },

  "hammer-curl": {
    name: "Hammer Curl", alt: "Çekiç tutuşla kol bükme", target: "Biceps · Ön kol",
    step: 2, gear: "dambil", start: {erkek: "8-12 kg", kadin: "4-6 kg"},
    group: "cekis", swap: ["biceps-curl", "lat-pulldown"],
    why: "Avuç içleri karşılıklıyken biceps'in altındaki kas ve ön kol devreye girer. Kola kalınlık veren kısım burası.",
    cues: [
      "Avuç içleri baştan sona birbirine baksın.",
      "Dirsekler gövdene sabit.",
      "Yukarıda 1 saniye sık, kontrollü indir.",
      "İki kolu aynı anda ya da sırayla — ikisi de olur."
    ],
    mistake: "Yukarıda bileği döndürmek. Hammer curl'ün tüm farkı sabit bilekte."
  },

  "skull-crusher": {
    name: "Skull Crusher", alt: "Yatarak alına doğru triceps", target: "Triceps",
    step: 2.5, gear: "ez", start: {erkek: "15-20 kg", kadin: "10-12 kg"},
    group: "itis", swap: ["triceps-pushdown"],
    why: "Triceps'in uzun başını esneme altında yükler. Pushdown'ın ulaşamadığı kısım burası.",
    cues: [
      "Üst kollar yere dik ve sabit; sadece dirsek açılıp kapansın.",
      "Barı alnının biraz arkasına indir.",
      "Dirsekleri yanlara açma.",
      "Z bar varsa kullan, bilek daha rahat eder."
    ],
    mistake: "Üst kolları öne devirip hareketi pullover'a çevirmek. Dirsek sabit kalmıyorsa ağırlık fazla."
  },

  "barbell-shrug": {
    name: "Shrug", alt: "Barla omuz silkme", target: "Trapez",
    step: 5, gear: "bar", start: {erkek: "40-60 kg", kadin: "20-30 kg"},
    group: "cekis",
    why: "Boyun ile omuz arasındaki kası doğrudan çalıştırır. Ağır kaldırırken omuz kuşağını sabitleyen yapının parçası.",
    cues: [
      "Kollar gergin, bar bacaklarının önünde.",
      "Omuzları kulaklara doğru düz yukarı kaldır.",
      "Tepede 1 saniye sık.",
      "Omuzları döndürme, sadece yukarı-aşağı."
    ],
    mistake: "Omuzları çember çizerek döndürmek. Fayda sağlamaz, omuz eklemini gereksiz sıkıştırır."
  },

  /* ---------- gövde ve hareketlilik ---------- */

  "plank": {
    name: "Plank", alt: "Dirsek üstü köprü", target: "Karın · Gövde",
    step: 0, bw: true, gear: "vucut", start: {erkek: "vücut ağırlığı", kadin: "vücut ağırlığı"},
    group: "govde", swap: ["dead-bug", "side-plank", "hanging-leg-raise"],
    why: "Karnı 'incelten' bir hareket değil — gövdeni sabit tutmayı öğretir, bu da diğer hareketlerin formunu düzeltir.",
    cues: [
      "Dirsekler omuzların tam altında.",
      "Kalçanı sık, karnını içeri çek; belin çukurlaşmasın.",
      "Kalça yukarı kaçmasın, vücut baştan topuğa düz bir çizgi olsun.",
      "Nefesini tutma, normal nefes al."
    ],
    mistake: "Süreyi uzatmak için formu bozmak. 20 saniye düzgün plank, 60 saniye çökük plank'tan iyidir."
  },

  "side-plank": {
    name: "Yan Plank", alt: "Side plank, her iki taraf", target: "Yan karın · Kalça yanı",
    step: 0, bw: true, gear: "vucut", start: {erkek: "vücut ağırlığı", kadin: "vücut ağırlığı"},
    group: "govde", swap: ["plank", "dead-bug"],
    why: "Gövdenin yana çökmesini engelleyen kaslar. Tek bacakla duruş ve yürüyüş kalitesini etkiler.",
    cues: [
      "Dirsek omzun tam altında.",
      "Kalçanı yukarı it, vücut düz bir çizgi olsun.",
      "Kalça yere doğru düşmeye başladığında seti bitir.",
      "Zor geliyorsa dizleri bükerek dizden destek al."
    ],
    mistake: "Gövdeyi öne ya da arkaya döndürmek. Omuz, kalça ve ayak bileği tek düzlemde kalmalı."
  },

  "dead-bug": {
    name: "Dead Bug", alt: "Sırtüstü çapraz kol-bacak uzatma", target: "Derin karın kasları",
    step: 0, bw: true, gear: "vucut", start: {erkek: "vücut ağırlığı", kadin: "vücut ağırlığı"},
    group: "govde", swap: ["plank", "side-plank"],
    why: "Kol ve bacak hareket ederken beli sabit tutmayı öğretir. Squat ve deadlift'te belini koruyan asıl beceri bu.",
    cues: [
      "Sırtüstü yat, belini yere yapıştır ve orada tut.",
      "Kollar tavana dik, dizler 90 derece.",
      "Karşıt kol ve bacağı yavaşça uzat, bel yerden kalkmasın.",
      "Bel kalkmaya başladığı noktada geri dön."
    ],
    mistake: "Hızlı yapmak. Bu bir kontrol hareketi — her tekrar 4-5 saniye sürmeli."
  },

  "hanging-leg-raise": {
    name: "Hanging Leg Raise", alt: "Barda asılıp bacak kaldırma", target: "Alt karın · Kalça ön yüzü",
    step: 0, bw: true, gear: "vucut", start: {erkek: "vücut ağırlığı", kadin: "diz çekerek başla"},
    group: "govde", swap: ["dead-bug", "plank"],
    why: "Karın kaslarını en uzun hareket açıklığında çalıştırır. Ayrıca tutuş gücünü de geliştirir.",
    cues: [
      "Bara asıl, omuzları aşağı çek — kulaklarına yapışmasın.",
      "Bacakları gergin ya da dizler bükülü kaldır.",
      "Kalçayı hafif yukarı kıvır; asıl iş orada.",
      "Sallanmayı durdur, her tekrar sıfırdan başlasın."
    ],
    mistake: "Sallanma hızıyla bacakları savurmak. Sallanıyorsan dizli versiyona dön."
  },

  "wall-angel": {
    name: "Wall Angel", alt: "Duvarda kol kaydırma", target: "Omuz hareketliliği · Üst sırt",
    step: 0, bw: true, gear: "vucut", start: {erkek: "vücut ağırlığı", kadin: "vücut ağırlığı"},
    group: "mobilite", swap: ["face-pull", "rear-delt-fly"],
    why: "Kas büyütmez, omuz hareket açıklığını açar. Masa başında geçen gün için iyi bir karşı hamle.",
    cues: [
      "Sırtın duvarda, topukların duvardan 10-15 cm ileride.",
      "Bel duvara tam yapışmasın; elini sokabileceğin kadar boşluk kalsın.",
      "Kollar duvardan ayrılmadan yukarı kaysın.",
      "Kollar duvardan kalkmaya başladığı noktada dur, zorlama."
    ],
    mistake: "Kolları duvardan koparıp havada oynatmak. O zaman hareketin bütün anlamı kalmıyor."
  }
};

/* Program dosyaları hareketleri kimlikle çağırır; olmayan bir kimlik
   sessizce boş sayfa üretmesin diye burada patlaması iyidir. */
export function exercise(id){
  const e = EXERCISES[id];
  if(!e) throw new Error("Tanımsız hareket: " + id);
  return e;
}
