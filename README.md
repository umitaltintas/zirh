# ZIRH

> Kas, vücudun zırhı. Her seans bir plaka daha.

İki kişilik bir antrenman uygulaması: beş seviyeli program setleri, hareket başına teknik anlatımı ve video, dinlenme sayacı, seans geçmişi ve kiloya göre hesaplanan öğün önerileri.

**https://umitaltintas.github.io/zirh/**

Program kadın ve erkek için ayrı başlangıç ağırlıkları ve ayrı kalori hedefi önerir; hareketler ve set sayıları aynıdır. Üstteki seçiciden geçiş yapılır, kayıtlar ayrı tutulur.

## Ne yapar

- **Antrenman** — Her hareket ayrı bir ekran, yatay kaydırarak geçilir. Setleri işaretlersin, ağırlığı girersin, dinlenme sayacı kendiliğinden başlar. Bir sonraki seansta her hareketin altında geçen sefer kaç kilo kaldırdığın yazar.
- **Öğün** — Profildeki kalori ve protein hedefine göre bir günlük öğün planı kurar. Beğenmezsen başka bir gün önerir.
- **Geçmiş** — Biten seanslar, en iyi ağırlıklar, hareket bazında ilerleme.
- **Rehber** — Ağırlık artırma kuralları, seviyeler arası geçiş, haftalık düzen, kreatin.
- **Profil** — Boy, kilo, yaş, hedef ve program seviyesi. Günlük makro hedefleri buradan hesaplanır.

### Seviyeler

| | Program | Sıklık | Ne zaman |
|---|---|---|---|
| 1 | Temel | 2 gün | Hiç ağırlık çalışmadıysan |
| 2 | Kuruluş | 3 gün | Makinede 6-8 hafta sonra, serbest ağırlığa geçiş |
| 3 | İtiş · Çekiş · Bacak | 3 gün | Squat, bench ve row oturduysa |
| 4 | Üst · Alt | 4 gün | Bir yıla yakın düzenli çalışma |
| 5 | Bölüm | 5 gün | Kas grubu başına bir gün |

## Telefonda kullanım

Tarayıcı menüsünden **Ana ekrana ekle** dendiğinde uygulama gibi açılır ve internet olmadan da çalışır. Salonda çekim zayıfsa sorun çıkarmaz.

iPhone'da otomatik kurulum önerisi çıkmaz; Safari'de **Paylaş → Ana Ekrana Ekle** demek gerekir.

## Veri

Boy, kilo, yaş, setler, ağırlıklar ve seans geçmişi yalnızca tarayıcının `localStorage` alanında, yani o cihazda tutulur. Hiçbir yere gönderilmez, sunucu yoktur. Kişisel ölçüler kaynak koda da yazılmaz — depo herkese açık olduğu için bu ayrım bilinçli. Profil ekranındaki **Yedek al** düğmesi bütün veriyi JSON olarak dışarı verir.

## Yapı

Derleme adımı yok, paket yöneticisi yok. Tarayıcı ES modüllerini olduğu gibi yükler; `git push` yapmak yayınlamaya yeter.

```
index.html              uygulama kabuğu — yalnızca iskelet
css/
  base.css              renk dili, tipografi, ortak parçalar
  shell.css             başlık, alt gezinme, panel, sayaç
  screens.css           ekranlara özgü yerleşimler
src/
  main.js               bağlantı noktası: kim kimi ne zaman tazeler
  store.js              localStorage, göçler, seans durumu
  dom.js                küçük yardımcılar
  data/
    exercises.js        hareket kataloğu — teknik, ipuçları, sık hata
    programs.js         1-5 seviye program setleri
    videos.js           doğrulanmış YouTube kimlikleri
    meals.js            öğün veritabanı
    nutrition.js        kalori ve makro hesabı
  ui/
    router.js           sekmeler
    sheet.js            alttan açılan panel
    timer.js            dinlenme sayacı, ekranı açık tutma
  screens/
    workout.js          yatay sayfalayıcı, set takibi
    history.js          seans kayıtları
    profile.js          ölçüler, hedef, seviye seçimi
    meals.js            günlük öğün planı
sw.js                   çevrimdışı önbellek
_test.html              tarayıcıda açılan gerileme testleri
```

**Neden hareket ve program ayrı dosyada:** bir hareketin nasıl yapıldığı değişmez, kaç set yapılacağı programa göre değişir. `exercises.js` ilkini, `programs.js` ikincisini tutar. Aynı hareket beş programda geçebiliyor ve teknik anlatımı tek yerde duruyor.

## Geliştirme

```
python3 -m http.server 8765
```

Service worker'ın çalışması için `file://` değil `http://` üzerinden açılmalı.

Testler: `http://localhost:8765/_test.html`. Gerçek bir iframe içinde, dört farklı ekran boyutunda çalışır — görünüm bindirmesi, sayfa taşması, seviye değişimi, seans kalıcılığı, öğün planı ve masaüstü hizalaması.

Değişiklikten sonra `sw.js` içindeki `CACHE` sürümü artırılmalı; yoksa eski dosyalar önbellekte kalır.

## Uyarı

Ağrı — kas yorgunluğu değil, keskin ya da eklem içi ağrı — hissedilirse hareket bırakılmalı. Bilinen kalp, tansiyon, bel ya da diz sorunu olanlar programa başlamadan önce doktoruna danışmalı.
