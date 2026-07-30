#!/bin/sh
# ============================================================
# ZIRH — video sağlık kontrolü.
#
# src/data/videos.js'teki her kimliği YouTube'a sorar ve üç şeye bakar:
#
#   KIRIK   video silinmiş, gizlenmiş ya da gömülmeye kapalı.
#           Uygulamada boş bir oynatıcı olarak görünür; hemen değişmeli.
#   ZAYIF   videonun kendisi ayakta ama teknik anlatmıyor: ya çok kısa
#           (hareketi gösterip geçen klip) ya da neredeyse hiç izlenmemiş.
#   TAMAM   ikisi de değil.
#
# Kanal kapanır, video kalkar, kimlik çürür — kod değişmediği hâlde
# uygulama bozulur. Bu yüzden kontrol testlerin içinde değil, elle
# çalıştırılan ayrı bir araç: ağ ister ve YouTube'un cevabına bağlıdır.
#
# Kullanım:  sh tools/video-check.sh
# ============================================================

set -u

ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC="$ROOT/src/data/videos.js"

# Bu eşiklerin altı "hareketi gösteriyor ama öğretmiyor" demek.
MIN_SEC=35
MIN_VIEWS=5000

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

[ -r "$SRC" ] || { echo "videos.js okunamadı: $SRC" >&2; exit 1; }

report=$(mktemp)
trap 'rm -f "$report"' EXIT INT TERM

# videos.js satırlarından  anahtar|kimlik|kanal  üçlüsü çıkar.
sed -n 's/^ *"\([a-z0-9-]*\)": *{ *id: *"\([^"]*\)", *channel: *"\([^"]*\)".*/\1|\2|\3/p' "$SRC" |
while IFS='|' read -r key id chan; do

  # oembed yalnızca var olan ve gömülmeye açık videolara cevap verir —
  # kırık kimliği ayıklamanın en ucuz yolu bu.
  embed=$(curl -s -o /dev/null -w '%{http_code}' \
    "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=$id&format=json")

  if [ "$embed" != "200" ]; then
    printf 'KIRIK  %-24s %-11s  oembed %s   %s\n' "$key" "$id" "$embed" "$chan"
    continue
  fi

  html=$(curl -s -L -A "$UA" "https://www.youtube.com/watch?v=$id")
  views=$(printf '%s' "$html" | grep -o '"viewCount":"[0-9]*"' | head -1 | tr -dc '0-9')
  secs=$(printf '%s' "$html" | grep -o '"lengthSeconds":"[0-9]*"' | head -1 | tr -dc '0-9')
  views=${views:-0}
  secs=${secs:-0}

  # Sayfa çekilemediyse (süre 0) zayıf deme — oembed videonun ayakta
  # olduğunu zaten söyledi, eksik olan bizim ölçümümüz.
  if [ "$secs" -gt 0 ] && { [ "$secs" -lt "$MIN_SEC" ] || [ "$views" -lt "$MIN_VIEWS" ]; }; then
    state=ZAYIF
  else
    state=TAMAM
  fi
  # Kanal adı en sona: Türkçe harfler printf'in bayt sayan sütun
  # genişliğini kaydırıyor, son sütunda kaydıracak bir şey kalmıyor.
  printf '%s  %-24s %-11s %5ds %9d izlenme   %s\n' "$state" "$key" "$id" "$secs" "$views" "$chan"

done | tee "$report"

echo
awk -v sec="$MIN_SEC" -v views="$MIN_VIEWS" '
  /^KIRIK/ { k++ } /^ZAYIF/ { z++ } /^TAMAM/ { t++ }
  END {
    printf "%d video: %d tamam, %d zayıf, %d kırık\n", k + z + t, t, z, k
    if(k) print "KIRIK olanları videos.js'"'"'te hemen değiştir."
    if(z) printf "ZAYIF olanlar acil değil ama sırada: %d sn altı ya da %d izlenmeden az.\n", sec, views
  }
' "$report"
