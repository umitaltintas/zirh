# ZIRH

> Kas, vücudun zırhı. Her seans bir plaka daha.

İki günlük başlangıç antrenman programı. Tek dosyalık, kurulum gerektirmeyen bir web uygulaması.

Program kadın ve erkek için ayrı başlangıç ağırlıkları önerir; hareketler ve set sayıları aynıdır. Üstteki seçiciden geçiş yapılır, kayıtlar ayrı tutulur.

## Ne yapar

- **Antrenman** — Her hareket ayrı bir ekran, yatay kaydırarak geçilir. Setleri işaretlersin, ağırlığı girersin, dinlenme sayacı kendiliğinden başlar.
- **Rehber** — Ağırlık artırma kuralları, haftalık düzen, beslenme ve kreatin notları.
- **Geçmiş** — Biten seanslar, en iyi ağırlıklar, hareket bazında ilerleme.

Bir sonraki seansta her hareketin altında geçen sefer kaç kilo kaldırdığın yazar. İlerlemeyi takip etmenin en pratik yolu bu.

## Telefonda kullanım

Tarayıcı menüsünden **Ana ekrana ekle** dendiğinde uygulama gibi açılır ve internet olmadan da çalışır. Salonda çekim zayıfsa sorun çıkarmaz.

## Veri

Setler, ağırlıklar, seans geçmişi ve profil bilgileri (boy, kilo) yalnızca tarayıcının `localStorage` alanında, yani o cihazda tutulur. Hiçbir yere gönderilmez, sunucu yoktur.

## Dosyalar

| Dosya | İşi |
|---|---|
| `index.html` | Uygulamanın tamamı — program verisi, arayüz, mantık |
| `sw.js` | Çevrimdışı çalışması için service worker |
| `manifest.webmanifest` | Ana ekrana eklenince uygulama gibi açılması için |

## Geliştirme

Derleme adımı yok. Dosyaları bir sunucudan servis etmek yeterli:

```
python3 -m http.server 8765
```

Service worker'ın çalışması için `file://` değil `http://` üzerinden açılmalı.

## Uyarı

Ağrı — kas yorgunluğu değil, keskin ya da eklem içi ağrı — hissedilirse hareket bırakılmalı. Bilinen kalp, tansiyon, bel ya da diz sorunu olanlar programa başlamadan önce doktoruna danışmalı.
