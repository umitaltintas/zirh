/* ============================================================
   Yayın yapılandırması.

   Kaynak kod tarayıcının doğrudan çalıştırabileceği ES modülleri
   olarak duruyor; Vite'ın burada yaptığı iş onları yayına hazırlamak:
   yorumları atmak, sıkıştırmak, 22 dosyayı ikiye indirmek ve service
   worker'ı üretmek.

   En önemli kazanç sonuncusu. Service worker eskiden elle yazılmıştı
   ve içinde önbelleğe alınacak dosyaların listesi vardı. Yeni bir
   modül eklendiğinde o listeye de yazmak gerekiyordu; unutulduğu gün
   uygulama çevrimiçiyken sorunsuz görünüp çevrimdışı bozuluyordu —
   fark edilmesi en zor hata türü. Artık listeyi Workbox derleme
   anında dosya ağacından üretiyor, unutulacak bir şey kalmıyor.
   ============================================================ */

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  /* Uygulama umitaltintas.github.io/zirh/ altında, alan adının
     kökünde değil. Göreli taban her iki yerde de çalışır: yarın
     başka bir yola taşınsa yapılandırmaya dokunmak gerekmez. */
  base: "./",

  build: {
    /* _test.html ikinci giriş noktası. Testler yayınlanan sürümün
       yanında duruyor ve iframe'de gerçek index.html'i açıyorlar;
       yani telefondan girip minify edilmiş kodun üstünde
       koşturulabiliyorlar. CI'ın yayından önce yaptığı da bu. */
    /* Kaynak haritası duruyor ama İÇİNDE KAYNAK YOK.
       Öntanımlı hâliyle harita, her dosyanın özgün metnini
       sourcesContent alanında taşıyor — yani yorumları da. Yayından
       yorumları çıkarıp haritayla geri koymak anlamsız olurdu.
       sourcemapExcludeSources yalnızca "hangi dosyanın kaçıncı
       satırı" eşlemesini bırakıyor; kaynağın kendisi zaten GitHub'da
       ve satır numaraları birebir tutuyor. */
    sourcemap: true,

    rollupOptions: {
      input: {
        index: "index.html",
        test: "_test.html"
      },
      output: { sourcemapExcludeSources: true }
    }
  },

  plugins: [
    /* Vite HTML yorumlarına dokunmuyor; index.html'in bölüm
       başlıkları ve gerekçeleri olduğu gibi yayına gidiyordu.
       Ayrı bir eklenti kurmaya değmeyecek kadar küçük bir iş. */
    {
      name: "zirh-html-yorum-temizle",
      transformIndexHtml(html){
        return html.replace(/<!--[\s\S]*?-->/g, "")
                   .replace(/[ \t]+$/gm, "")
                   .replace(/\n\s*\n+/g, "\n");
      }
    },

    VitePWA({
      /* Yeni sürüm hazır olur olmaz devralsın. Ne zaman sayfaya
         yansıyacağına main.js karar veriyor: seans ortasındaysan
         yenilenmiyor, "seanstan sonra geçilecek" deyip bekliyor. */
      registerType: "autoUpdate",

      /* Kaydı eklentiye bıraktırmıyoruz: main.js'teki kayıt kodu
         seans farkındalığını ve otuz dakikada bir güncelleme
         yoklamasını yapıyor, eklentininki bunları bilmiyor. */
      injectRegister: null,
      filename: "sw.js",

      /* Manifest elle yazıldı ve index.html ondan haberli; eklenti
         bir ikincisini üretip iki <link> bırakmasın. */
      manifest: false,

      workbox: {
        /* Workbox'ın kendi kaynak haritası 200 KB ve bize ait
           değil; sunucuda durmasının kimseye faydası yok. */
        sourcemap: false,

        /* Dosya adlarında içerik özeti var, o yüzden önbellek
           öncelikli davranmak güvenli: aynı ada sahip iki farklı
           içerik olamaz. Elle yazılmış eski sw.js'te bu güvence
           yoktu, o yüzden her şeyi ağdan çekmek zorundaydı. */
        globPatterns: ["**/*.{js,css,html,png,webmanifest}"],

        /* Testler yayında dursun ama önbelleğe girmesin: salonda
           çevrimdışı açılması gereken şey uygulama. */
        globIgnores: ["**/_test.html"],

        /* Adres ne olursa olsun uygulamayı aç. Tek sayfalık bir
           arayüz; derin bağlantı yok. */
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/_test\.html/],

        runtimeCaching: [
          {
            /* Yazı tipleri Google'dan geliyor. Bir kez indirildikten
               sonra çevrimdışı da görünsünler, yoksa uygulama
               açılıyor ama yazı tipi düşüyordu. */
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.googleapis.com" ||
              url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "zirh-yazitipi",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },

      /* Geliştirirken service worker kapalı: kodun eski bir kopyası
         önbellekten dönüp değişikliği görünmez kılmasın. */
      devOptions: { enabled: false }
    })
  ]
});
