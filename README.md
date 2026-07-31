# ZIRH

> Kas, vücudun zırhı. Her seans bir plaka daha.

İki kişilik bir antrenman uygulaması: beş seviyeli program setleri, hareket başına teknik anlatımı ve video, dinlenme sayacı, seans geçmişi ve kiloya göre hesaplanan öğün önerileri.

**https://umitaltintas.github.io/zirh/**

Program kadın ve erkek için ayrı başlangıç ağırlıkları ve ayrı kalori hedefi önerir; hareketler ve set sayıları aynıdır. Üstteki seçiciden geçiş yapılır, kayıtlar ayrı tutulur.

## Ne yapar

- **Antrenman** — Her hareket ayrı bir ekran, yatay kaydırarak geçilir. Setleri işaretlersin, ağırlığı girersin, dinlenme sayacı kendiliğinden başlar. Bir sonraki seansta her hareketin altında geçen sefer kaç kilo kaldırdığın yazar.
- **Öğün** — Profildeki kalori ve protein hedefine göre bir günlük öğün planı kurar. Beğenmezsen başka bir gün önerir.
- **Geçmiş** — Biten seanslar ve hareket başına ağırlık seyri: küçük bir çizgi grafik, en iyi ağırlık, tahmini tek tekrar maksimumu. Bir harekette üç seanstır ağırlık artmıyorsa bunu söyler ve ne yapılacağını yazar.
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
  progress.js           geçmişten seyir, tahmini 1RM, plato
  dom.js                küçük yardımcılar
  data/
    exercises.js        hareket kataloğu — teknik, ipuçları, sık hata
    programs.js         1-5 seviye program setleri
    videos.js           doğrulanmış YouTube kimlikleri
    warmup.js           güne göre ısınma, ısınma setleri, soğuma
    plates.js           bara hangi plakaların dizileceği
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
tools/
  video-check.sh        video kimlikleri hâlâ ayakta mı, yeterli mi
```

**Neden hareket ve program ayrı dosyada:** bir hareketin nasıl yapıldığı değişmez, kaç set yapılacağı programa göre değişir. `exercises.js` ilkini, `programs.js` ikincisini tutar. Aynı hareket beş programda geçebiliyor ve teknik anlatımı tek yerde duruyor.

**Neden ilerleme hesabı ekranın dışında:** `progress.js` geçmişten seyri, tahmini 1RM'i ve platoyu çıkarır ama DOM'a dokunmaz; çizim `screens/history.js`'te kalır. `nutrition.js` ile aynı gerekçe — sayılar tek yerde durursa testte de, ileride başka bir ekranda da aynı cevabı verirler. 1RM Epley formülüyle (`ağırlık × (1 + tekrar / 30)`) ve programdaki en düşük tekrar sayısıyla hesaplanır: kaç tekrar yapıldığı kaydedilmiyor, o yüzden tahmin bilerek düşük tutuluyor. Yalnızca serbest ağırlıkta gösterilir — makinede yazan kilo o makinenin kaldıraç oranına bağlı, başka bir salonda aynı sayı bambaşka bir yük demek; karşılaştırılamayan bir rakam yazmaktansa hiç yazmıyoruz.

**Isınma neden ayrı:** ısınma hareketlerinin ağırlığı ve seans kaydı yoktur, o yüzden `exercises.js`'e girmezler. Hangi ısınmanın hangi güne gideceğini programdaki `warm` alanı söyler: itiş gününde omuz açılır, bacak gününde kalça.

## Geliştirme

```
python3 -m http.server 8765
```

Service worker'ın çalışması için `file://` değil `http://` üzerinden açılmalı.

Testler: `http://localhost:8765/_test.html`. Gerçek bir iframe içinde, dört farklı ekran boyutunda çalışır — görünüm bindirmesi, sayfa taşması, seviye değişimi, seans kalıcılığı, plaka dizilimi, ısınma setleri, dinlenme sayacı, seans notu, geçmişteki ağırlık seyri, öğün planı ve masaüstü hizalaması.

Dar ekranda (320×568) yalnızca "taşmıyor" demek yetmiyor: `.page` bir flex sütunu olduğu için sığmayan içerik taşmak yerine büzülüyor ve `scrollHeight` denetiminden sessizce geçiyor. O yüzden kritik parçaların gerçek yüksekliğine ve ekranın içinde kalıp kalmadıklarına ayrıca bakılıyor.

Değişiklikten sonra `sw.js` içindeki `CACHE` sürümü artırılmalı; yoksa eski dosyalar önbellekte kalır.

Videolar zamanla çürür — kanal kapanır, video kaldırılır. Ara sıra:

```
sh tools/video-check.sh
```

Her kimliği YouTube'a sorar; `KIRIK` çıkan hemen değişmeli, `ZAYIF` çıkan (çok kısa ya da neredeyse hiç izlenmemiş) sırada bekler. Testlerin içinde değil, çünkü ağ ister.

## Uyarı

Ağrı — kas yorgunluğu değil, keskin ya da eklem içi ağrı — hissedilirse hareket bırakılmalı. Bilinen kalp, tansiyon, bel ya da diz sorunu olanlar programa başlamadan önce doktoruna danışmalı.
