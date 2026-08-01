# ZIRH

> Kas, vücudun zırhı. Her seans bir plaka daha.

İki kişilik bir antrenman uygulaması: beş seviyeli program setleri, hareket başına teknik anlatımı ve video, dinlenme sayacı, seans geçmişi ve kiloya göre hesaplanan öğün önerileri.

**https://umitaltintas.github.io/zirh/**

Program kadın ve erkek için ayrı başlangıç ağırlıkları ve ayrı kalori hedefi önerir; hareketler ve set sayıları aynıdır. Üstteki seçiciden geçiş yapılır, kayıtlar ayrı tutulur.

## Ne yapar

- **Antrenman** — Her hareket ayrı bir ekran, yatay kaydırarak geçilir. Setleri işaretlersin, ağırlığı girersin, dinlenme sayacı kendiliğinden başlar. Bir sonraki seansta her hareketin altında geçen sefer kaç kilo kaldırdığın yazar. Makine doluysa ya da o alet salonda yoksa **Değiştir** aynı kalıptan bir karşılık önerir; set ve tekrar programdan kalır. Son sette ağırlığı düşürdüysen ya da hedeflenen tekrarı çıkaramadıysan **Düzenle** o seti tek tek yazmanı sağlar. Bir harekette rekorunu kırdığın an söylenir.
- **Öğün** — Profildeki kalori ve protein hedefine göre bir günlük öğün planı kurar. Beğenmezsen başka bir gün önerir.
- **Geçmiş** — Son sekiz haftanın **takvimi**: hangi günlerde çalıştığın ve en uzun aran. Altında biten seanslar ve hareket başına ağırlık seyri: küçük bir çizgi grafik, en iyi ağırlık, tahmini tek tekrar maksimumu. Bir harekette üç seanstır ağırlık artmıyorsa bunu söyler ve ne yapılacağını yazar. **Haftalık denge** son yedi günde hangi kalıba kaç set düştüğünü gösterir — itiş çekişin çok önüne geçtiyse uyarır, çünkü bedeli aylar sonra omuzda ödeniyor.
- **Rehber** — **Hareket kütüphanesi**: katalogdaki 41 hareketin tekniği ve videosu, kalıba ve alete göre süzülebilir hâlde. Yanında ağırlık artırma kuralları, seviyeler arası geçiş, haftalık düzen, kreatin.
- **Profil** — Boy, kilo, yaş, hedef ve program seviyesi. Günlük makro hedefleri buradan hesaplanır. Kilonu her yazdığında seyre işlenir; üç haftayı geçen bir seyir hedefinle çelişiyorsa — kas diyorsun ama kilo durmuşsa — söylenir. Seviye atlamaya hazırsan — yeterince zaman, yeterince seans ve gerçek ağırlık artışı — söylenir; seçim yine senin.

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

Kaynak kod, tarayıcının doğrudan çalıştırabileceği ES modülleri: çerçeve yok, derleyici sözdizimi yok, ürettiği kodu okumak için bir araca ihtiyaç duyulmuyor. Yayına giderken Vite bunları sıkıştırıp tek dosyada topluyor ve service worker'ı üretiyor. `git push` yapmak yine yayınlamaya yetiyor — derlemeyi GitHub Actions yapıyor, testler de yayından önce derlenmiş sürümün üstünde koşuyor.

Kod içindeki yorumlar bilerek uzun: bir formülün neden alt uçtan hesaplandığı, hangi CSS tuzağının neyi bozduğu yalnızca orada yazılı. Yayınlanan sürümde hiçbiri yok, kaynakta hepsi duruyor.

```
index.html              uygulama kabuğu — yalnızca iskelet
vite.config.js          yayın yapılandırması, service worker kuralları
css/
  base.css              renk dili, tipografi, ortak parçalar
  shell.css             başlık, alt gezinme, panel, sayaç
  screens.css           ekranlara özgü yerleşimler
src/
  main.js               bağlantı noktası: kim kimi ne zaman tazeler
  store.js              localStorage, göçler, seans durumu
  progress.js           geçmişten seyir, 1RM, plato, haftalık denge
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
    spark.js            küçük seyir çizgisi — ağırlıkta ve kiloda ortak
    techsheet.js        teknik paneli gövdesi — seansta ve kütüphanede ortak
    timer.js            dinlenme sayacı, ekranı açık tutma
  screens/
    workout.js          yatay sayfalayıcı, set takibi
    history.js          takvim, seans kayıtları, haftalık denge
    library.js          hareket kataloğunu arama ve süzme
    profile.js          ölçüler, hedef, seviye seçimi
    meals.js            günlük öğün planı
public/                 olduğu gibi kopyalananlar: manifest, ikonlar
_test.html              tarayıcıda açılan gerileme testleri
tools/
  run-tests.mjs         testleri başsız tarayıcıda koşturur
  video-check.sh        video kimlikleri hâlâ ayakta mı, yeterli mi
.github/workflows/
  deploy.yml            derle → test et → yayınla
```

**Service worker neden elle yazılmıyor:** eskiden `sw.js` depoda duruyordu ve içinde önbelleğe alınacak dosyaların listesi vardı. Yeni bir modül eklendiğinde o listeye de yazmak gerekiyordu; unutulduğu gün uygulama çevrimiçiyken sorunsuz görünüp çevrimdışı bozuluyordu — fark edilmesi en zor hata türü. Artık listeyi Workbox derleme anında dosya ağacından üretiyor. Kayıt kodu yine bizde (`main.js`): yeni sürüm hazır olduğunda seans ortasındaysan sayfa yenilenmiyor, "seanstan sonra geçilecek" deyip bekliyor.

**Neden hareket ve program ayrı dosyada:** bir hareketin nasıl yapıldığı değişmez, kaç set yapılacağı programa göre değişir. `exercises.js` ilkini, `programs.js` ikincisini tutar. Aynı hareket beş programda geçebiliyor ve teknik anlatımı tek yerde duruyor.

**Neden ilerleme hesabı ekranın dışında:** `progress.js` geçmişten seyri, tahmini 1RM'i ve platoyu çıkarır ama DOM'a dokunmaz; çizim `screens/history.js`'te kalır. `nutrition.js` ile aynı gerekçe — sayılar tek yerde durursa testte de, ileride başka bir ekranda da aynı cevabı verirler. 1RM Epley formülüyle (`ağırlık × (1 + tekrar / 30)`) hesaplanır. Tekrarı yazdıysan gerçek sayı, yazmadıysan programın alt ucu kullanılır: tahmin, tahmin olduğu sürece bilerek düşük tutuluyor. Yalnızca serbest ağırlıkta gösterilir — makinede yazan kilo o makinenin kaldıraç oranına bağlı, başka bir salonda aynı sayı bambaşka bir yük demek; karşılaştırılamayan bir rakam yazmaktansa hiç yazmıyoruz.

**Neden yalnızca sapan setler kaydediliyor:** her setin ağırlığını ve tekrarını tek tek sormak, salonda bir dokunuşluk işi üç dokunuşa çıkarırdı; setlerin çoğu zaten programda yazdığı gibi geçiyor. `active[...].adj` yalnızca farklı olanı tutar — "3. sette 5 kilo düştüm", "hedef 8'di, 6 çıktı". Boş bırakılan alan sıfır değil "programdaki gibi" demek, o yüzden yanlışlıkla açılan panel kaydı kirletmiyor. Geçmişe de aynı mantıkla giriyor: hepsi aynı ağırlıktaysa ve tekrar yazılmamışsa döküm hiç yazılmaz, düz alanlar zaten anlatıyor. Kazancı hesapta görünüyor — yapılan tekrar biliniyorsa 1RM tahmin yerine gerçek sayıyla, plato uyarısı da "ağırlık aynı ama tekrar artıyor" ayrımıyla çalışıyor.

**Neden kütüphane Rehber'de:** teknik anlatımları zaten yazılıydı ama yalnızca o gün programında olan hareket için açılabiliyordu; dinlenme gününde "deadlift nasıl yapılıyordu" diye bakmanın yolu yoktu. Antrenman sekmesi yapılacak şeylerin yeri, Rehber öğrenilecek şeylerin. Altıncı bir sekme açmak da alt barı dar telefonda sıkıştırırdı. Arama Türkçe aksanları yok sayar — "gogus" yazan da "göğüs" bulur — ve hareketin İngilizce adını, Türkçe karşılığını, hedef kasını birlikte tarar.

**Neden takvim sabit sekiz hafta:** takvim ayı ayın kaçında olduğunuza göre değişiyor; ayın ikisinde bakan biri neredeyse boş bir ızgara görüp "bu ay az çalışmışım" sanıyor, oysa geçen haftanın kayıtları hemen yukarıda duruyor. Sabit pencere bu yanılmayı ortadan kaldırıyor. Yanında en uzun ara da yazılı: aynı seans sayısına sahip iki kişiden biri düzenli çalışmış, diğeri üç hafta kaybetmiş olabilir — farkı söyleyen şey aralar.

**Neden kilo seyri hedefle karşılaştırılıyor:** uygulama kiloya göre bir kalori hedefi hesaplıyordu ama tutturulup tutturulmadığını hiç sormuyordu. Terazi zaten söylüyor. `goalCheck` haftalık değişim hızını hedefin makul aralığıyla karşılaştırır — kas için haftada +0,1 ile +0,4 kg, yağ için −0,3 ile −0,9. En az 21 gün ister: kilo gün içinde suyla ve tuzla bir buçuk kiloya kadar oynuyor, birkaç günlük aralıktan hız çıkarmak gürültüyü gidişat sanmak olur.

**Neden hareket kalıbı ayrı bir alan:** `target` alanı ("Sırt · Kanat · Biceps") insana okunsun diye yazılmış bir cümle ve otuz farklı değeri var. Haftalık dengeyi ondan saymak, aynı işi yapan iki hareketi iki ayrı kutuya düşürürdü. `group` ise beş kaba kalıp — itiş, çekiş, bacak, kalça, gövde. Yeni başlayanın gözden kaçırdığı asıl dengesizlik bu ölçekte oluyor: itiş çok, çekiş az. Mobilite hareketleri hacim sayımının tamamen dışında, yoksa haftalık denge olduğundan iyi görünürdü.

**Hareket değiştirme nerede duruyor:** seçim seansın içinde (`active[...].swap`), programın içinde değil — bugün makine doluydu diye programın kendisi değişmemeli. Set, tekrar ve dinlenme programdan kalır; hacim kararı programın, hareket seçimi salonun. Kayıt geçmişe gerçekten yapılan hareketin adıyla girdiği için ağırlık seyri, plato ve haftalık denge kendiliğinden doğru yerden sayar. Değiştirince o hareketin setleri ve ağırlığı siliniyor: ikisi de az önceki hareketin ölçüsüydü.

**Isınma neden ayrı:** ısınma hareketlerinin ağırlığı ve seans kaydı yoktur, o yüzden `exercises.js`'e girmezler. Hangi ısınmanın hangi güne gideceğini programdaki `warm` alanı söyler: itiş gününde omuz açılır, bacak gününde kalça.

## Geliştirme

```
npm install
npm run dev
```

Testler: `http://localhost:5173/_test.html`. Gerçek bir iframe içinde, dört farklı ekran boyutunda çalışır — görünüm bindirmesi, sayfa taşması, seviye değişimi, seans kalıcılığı, plaka dizilimi, ısınma setleri, dinlenme sayacı, seans notu, hareket değiştirme, set başına ağırlık ve tekrar, geçmişteki ağırlık seyri, seans takvimi, haftalık denge, seviye önerisi, kilo seyri ve hedef çelişkisi, rekor bildirimi, hareket kütüphanesi, öğün planı ve masaüstü hizalaması.

Dar ekranda (320×568) yalnızca "taşmıyor" demek yetmiyor: `.page` bir flex sütunu olduğu için sığmayan içerik taşmak yerine büzülüyor ve `scrollHeight` denetiminden sessizce geçiyor. O yüzden kritik parçaların gerçek yüksekliğine ve ekranın içinde kalıp kalmadıklarına ayrıca bakılıyor.

Yayınlanan sürümü yerelde denemek için:

```
npm run build && npm run preview
npm test http://localhost:4173/_test.html
```

Testleri derlenmiş sürümün üstünde koşturmak önemli: derleme, kaynakta olmayan bir hatayı üretebilen tek adım. CI'ın yayından önce yaptığı da tam olarak bu, üstelik uygulamanın gerçekte yaşadığı `/zirh/` alt dizininden.

Videolar zamanla çürür — kanal kapanır, video kaldırılır. Ara sıra:

```
sh tools/video-check.sh
```

Her kimliği YouTube'a sorar; `KIRIK` çıkan hemen değişmeli, `ZAYIF` çıkan (çok kısa ya da neredeyse hiç izlenmemiş) sırada bekler. Testlerin içinde değil, çünkü ağ ister.

## Uyarı

Ağrı — kas yorgunluğu değil, keskin ya da eklem içi ağrı — hissedilirse hareket bırakılmalı. Bilinen kalp, tansiyon, bel ya da diz sorunu olanlar programa başlamadan önce doktoruna danışmalı.
