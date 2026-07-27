/* ============================================================
   Öğün veritabanı.

   Türk mutfağından, markette bulunan malzemelerle yapılabilen
   öğünler. Değerler bir porsiyon içindir ve yaklaşıktır — amaç
   gram tutturmak değil, günün toplamını doğru aralıkta tutmak.

   kcal ≈ protein×4 + karbonhidrat×4 + yağ×9
   ============================================================ */

export const SLOT_LABELS = {
  kahvalti: "Kahvaltı",
  ara: "Ara öğün",
  ana: "Ana öğün"
};

export const MEALS = [

  /* ---------- kahvaltı ---------- */
  {
    id: "menemen", name: "Menemen", type: "kahvalti",
    kcal: 430, protein: 24, carb: 30, fat: 24, min: 15,
    items: ["3 yumurta", "2 domates", "1 sivri biber", "1 dilim tam buğday ekmek", "1 tatlı kaşığı tereyağı"],
    tags: ["ucuz", "hızlı"],
    note: "Domatesi suyunu salıp çekene kadar pişir, yumurtayı en son kır. Protein hedefin yüksekse yumurtayı dörde çıkar."
  },
  {
    id: "yumurta-peynir", name: "Haşlanmış yumurta ve peynir tabağı", type: "kahvalti",
    kcal: 450, protein: 32, carb: 22, fat: 26, min: 12,
    items: ["3 haşlanmış yumurta", "60 g beyaz peynir", "Domates, salatalık", "1 dilim tam buğday ekmek", "Birkaç zeytin"],
    tags: ["yüksek protein", "hazırlanabilir"],
    note: "Yumurtaları akşamdan haşlayıp buzdolabında tutarsan sabah iki dakikaya iner."
  },
  {
    id: "yulaf-sut", name: "Sütlü yulaf, muz ve fıstık ezmesi", type: "kahvalti",
    kcal: 550, protein: 24, carb: 72, fat: 18, min: 8,
    items: ["60 g yulaf", "250 ml süt", "1 muz", "1 yemek kaşığı fıstık ezmesi", "Tarçın"],
    tags: ["hızlı", "antrenman öncesi"],
    note: "Sabah antrenmanı yapıyorsan iyi bir seçim; karbonhidratı yüksek ama sindirimi ağır değil."
  },
  {
    id: "yogurt-granola", name: "Süzme yoğurt, yulaf ve ceviz", type: "kahvalti",
    kcal: 480, protein: 28, carb: 50, fat: 18, min: 5,
    items: ["250 g süzme yoğurt", "40 g yulaf", "1 tatlı kaşığı bal", "5-6 yarım ceviz"],
    tags: ["hızlı", "yüksek protein"],
    note: "Süzme yoğurt normal yoğurdun iki katı protein taşır; markette 'süzme' ya da 'Yunan usulü' yazana bak."
  },
  {
    id: "peynirli-tost", name: "Tam buğday tost", type: "kahvalti",
    kcal: 430, protein: 24, carb: 36, fat: 21, min: 8,
    items: ["2 dilim tam buğday ekmek", "60 g kaşar", "Domates", "Bir tutam kekik"],
    tags: ["ucuz", "hızlı"]
  },

  /* ---------- ara öğün ---------- */
  {
    id: "yogurt-meyve", name: "Yoğurt ve elma", type: "ara",
    kcal: 220, protein: 12, carb: 30, fat: 6, min: 2,
    items: ["200 g yoğurt", "1 elma"],
    tags: ["ucuz", "hızlı"]
  },
  {
    id: "ayran-badem", name: "Ayran ve badem", type: "ara",
    kcal: 250, protein: 11, carb: 8, fat: 19, min: 1,
    items: ["1 bardak ayran", "25 g badem (bir avuç)"],
    tags: ["hızlı", "düşük karbonhidrat"]
  },
  {
    id: "muz-ceviz", name: "Muz ve ceviz", type: "ara",
    kcal: 260, protein: 5, carb: 28, fat: 14, min: 1,
    items: ["1 muz", "20 g ceviz"],
    tags: ["hızlı", "vejetaryen"]
  },
  {
    id: "sut-protein", name: "Sütlü protein içeceği", type: "ara",
    kcal: 280, protein: 32, carb: 20, fat: 8, min: 2,
    items: ["300 ml süt", "1 ölçek protein tozu"],
    tags: ["yüksek protein", "hızlı", "antrenman sonrası"],
    note: "Protein hedefini yemekle tutturamadığın günler için. Şart değil — yemekten gelen protein de aynı işi görür."
  },
  {
    id: "lor-bal", name: "Lor peyniri ve bal", type: "ara",
    kcal: 220, protein: 24, carb: 12, fat: 8, min: 2,
    items: ["150 g lor peyniri", "1 tatlı kaşığı bal", "Tarçın"],
    tags: ["ucuz", "yüksek protein"],
    note: "Kilosu ucuz, proteini yüksek. Türkiye'de protein tozuna en yakın rakip."
  },
  {
    id: "yumurta-ekmek", name: "İki haşlanmış yumurta", type: "ara",
    kcal: 245, protein: 16, carb: 18, fat: 12, min: 10,
    items: ["2 haşlanmış yumurta", "1 dilim tam buğday ekmek", "Tuz, karabiber"],
    tags: ["ucuz", "hazırlanabilir"]
  },
  {
    id: "ton-kraker", name: "Ton balığı ve tam buğday kraker", type: "ara",
    kcal: 220, protein: 28, carb: 14, fat: 6, min: 3,
    items: ["1 kutu suda ton balığı", "4 tam buğday kraker", "Limon"],
    tags: ["yüksek protein", "hızlı", "hazırlanabilir"],
    note: "Suda olanı al, yağda olanın kalorisi iki katı."
  },

  /* ---------- ana öğün ---------- */
  {
    id: "tavuk-bulgur", name: "Izgara tavuk, bulgur pilavı, cacık", type: "ana",
    kcal: 590, protein: 48, carb: 58, fat: 18, min: 30,
    items: ["150 g tavuk göğsü", "1 kepçe bulgur pilavı", "1 kâse cacık", "Yeşil salata"],
    tags: ["yüksek protein", "hazırlanabilir"],
    note: "Haftanın en işe yarar tabağı. Tavuğu tek seferde 600 g pişirip üç güne bölebilirsin."
  },
  {
    id: "kofte-pilav", name: "Köfte, pirinç pilavı, salata", type: "ana",
    kcal: 690, protein: 40, carb: 60, fat: 32, min: 30,
    items: ["150 g köfte (4-5 adet)", "1 kepçe pilav", "Çoban salata"],
    tags: ["ucuz"]
  },
  {
    id: "mercimek-corba", name: "Mercimek çorbası, ekmek, salata", type: "ana",
    kcal: 370, protein: 18, carb: 52, fat: 10, min: 35,
    items: ["2 kâse mercimek çorbası", "1 dilim tam buğday ekmek", "Yeşil salata", "Limon"],
    tags: ["ucuz", "vejetaryen", "hazırlanabilir"],
    note: "Kalorisi düşük olduğu için yağ yakma dönemlerinde işe yarar. Yanına yoğurt eklersen proteini yükselir."
  },
  {
    id: "kuru-fasulye", name: "Kuru fasulye ve pilav", type: "ana",
    kcal: 640, protein: 26, carb: 92, fat: 18, min: 45,
    items: ["1 kâse kuru fasulye", "1 kepçe pilav", "Turşu"],
    tags: ["ucuz", "vejetaryen", "hazırlanabilir"],
    note: "Etli yaparsan protein 40 grama çıkar. Bir tencere pişirip dört öğüne bölmek en ekonomik yol."
  },
  {
    id: "etli-nohut", name: "Etli nohut ve bulgur pilavı", type: "ana",
    kcal: 600, protein: 32, carb: 78, fat: 18, min: 50,
    items: ["1 kâse etli nohut", "1 kepçe bulgur pilavı", "Yoğurt"],
    tags: ["ucuz", "hazırlanabilir"]
  },
  {
    id: "firin-somon", name: "Fırında somon ve sebze", type: "ana",
    kcal: 600, protein: 42, carb: 32, fat: 34, min: 30,
    items: ["150 g somon", "Fırında karışık sebze", "1 dilim tam buğday ekmek", "Limon, zeytinyağı"],
    tags: ["yüksek protein"],
    note: "Haftada bir-iki kez yağlı balık, omega-3 için en pratik yol. Somon pahalıysa uskumru ya da hamsi aynı işi görür."
  },
  {
    id: "tavuklu-salata", name: "Tavuklu büyük salata", type: "ana",
    kcal: 480, protein: 42, carb: 24, fat: 24, min: 15,
    items: ["150 g tavuk göğsü", "Marul, domates, salatalık, mısır", "1 yemek kaşığı zeytinyağı", "1 dilim tam buğday ekmek"],
    tags: ["yüksek protein", "hızlı", "düşük karbonhidrat"]
  },
  {
    id: "karniyarik", name: "Karnıyarık ve pilav", type: "ana",
    kcal: 685, protein: 28, carb: 62, fat: 36, min: 60,
    items: ["2 adet karnıyarık", "1 kepçe pilav", "Cacık"],
    tags: ["hazırlanabilir"]
  },
  {
    id: "tavuk-durum", name: "Yoğurtlu tavuk dürüm", type: "ana",
    kcal: 540, protein: 42, carb: 52, fat: 18, min: 15,
    items: ["1 tam buğday lavaş", "120 g tavuk göğsü", "2 yemek kaşığı yoğurt", "Marul, domates, soğan"],
    tags: ["yüksek protein", "hızlı"],
    note: "Dışarıda yerken en iyi seçeneklerden. Sos yerine yoğurt iste, kalori yarıya iner."
  },
  {
    id: "makarna-ton", name: "Ton balıklı sebzeli makarna", type: "ana",
    kcal: 580, protein: 38, carb: 76, fat: 14, min: 20,
    items: ["100 g tam buğday makarna", "1 kutu suda ton balığı", "Domates sos, biber, soğan"],
    tags: ["hızlı", "ucuz", "yüksek protein"]
  },
  {
    id: "kofte-salata", name: "Izgara köfte ve bol salata", type: "ana",
    kcal: 425, protein: 36, carb: 12, fat: 26, min: 25,
    items: ["150 g köfte", "Bol yeşil salata", "Közlenmiş biber", "Limon"],
    tags: ["düşük karbonhidrat", "yüksek protein"],
    note: "Yağ yakma dönemindeki akşam öğünü için. Karbonhidratı gündüze bırakmak uykuyu bozmuyor."
  },
  {
    id: "mercimek-kofte", name: "Mercimek köftesi ve salata", type: "ana",
    kcal: 370, protein: 14, carb: 56, fat: 10, min: 40,
    items: ["6-8 adet mercimek köftesi", "Marul yaprağı", "Limon", "Yeşil soğan"],
    tags: ["vejetaryen", "ucuz", "hazırlanabilir"]
  },
  {
    id: "izgara-balik", name: "Izgara balık ve salata", type: "ana",
    kcal: 435, protein: 38, carb: 26, fat: 20, min: 25,
    items: ["150 g levrek ya da çupra", "Roka, soğan salatası", "1 dilim tam buğday ekmek", "Limon"],
    tags: ["yüksek protein"]
  },
  {
    id: "sebzeli-omlet", name: "Sebzeli omlet ve salata", type: "ana",
    kcal: 490, protein: 34, carb: 26, fat: 28, min: 15,
    items: ["4 yumurta", "Mantar, biber, ıspanak", "40 g peynir", "1 dilim tam buğday ekmek"],
    tags: ["hızlı", "yüksek protein", "vejetaryen"],
    note: "Akşam yemeği hazırlamaya vaktin yoksa on beş dakikada tam bir öğün."
  },
  {
    id: "protein-muz", name: "Protein içeceği ve muz", type: "ara",
    kcal: 270, protein: 27, carb: 34, fat: 3, min: 2,
    items: ["1 ölçek protein tozu", "1 muz", "250 ml su ya da süt"],
    tags: ["antrenman sonrası", "hızlı", "yüksek protein"],
    note: "Antrenmandan sonra bir saat içinde yemek yiyemeyeceksen iyi bir köprü."
  },
  {
    id: "sutlu-yulaf-hizli", name: "Hızlı sütlü yulaf", type: "ara",
    kcal: 375, protein: 15, carb: 58, fat: 9, min: 5,
    items: ["40 g yulaf", "250 ml süt", "1 tatlı kaşığı bal"],
    tags: ["antrenman sonrası", "hızlı", "ucuz"]
  }
];

export const TIPS = [
  "Proteini güne yay. Tek öğünde 60 gram yerine dört öğünde 30'ar gram, kas yapımı için daha iyi çalışıyor.",
  "Her ana öğüne bir avuç kadar protein kaynağı koy: tavuk, kıyma, balık, yumurta, baklagil ya da süzme yoğurt. Gerisi kendiliğinden yerine oturur.",
  "Antrenmandan 1-2 saat önce karbonhidrat ağırlıklı bir öğün yeterli. Aç antrenmana girmek performansı düşürür, tok girmek mideyi rahatsız eder.",
  "Antrenmandan sonraki 'anabolik pencere' abartılmış bir kavram. Günün toplam proteini tuttuysa yemeği iki saat sonra yemenin bir zararı yok.",
  "Dışarıda yerken en iyi seçim genelde ızgara + salata + pilav ya da bulgur. Kızartma ve mayonezli soslardan kaçınmak kaloriyi kendiliğinden yarıya indiriyor.",
  "Bir tencere yemek pişirip üç güne bölmek, her gün 'ne yesem' diye düşünmekten hem ucuz hem de düzeni koruması kolay.",
  "Kilo verirken proteini artır, azaltma. Kalori açığındayken vücut kası da yakıyor; yüksek protein ve ağırlık antrenmanı onu koruyan iki şey.",
  "Tartıya haftada bir, aynı saatte, aç karnına çık. Günlük dalgalanma çoğunlukla su — haftalık ortalamaya bak."
];
