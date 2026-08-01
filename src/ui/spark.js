/* ============================================================
   Sparkline — küçük, eksensiz seyir çizgisi.

   Geçmişteki hareket ağırlıkları ve profildeki vücut ağırlığı aynı
   şekli kullanıyor; iki yerde iki ayrı çizim kodu tutmanın sebebi
   yoktu. Buraya taşındığında CSS'i de tek yerde kaldı.

   Sabit bir viewBox'a çizilir, genişliğe CSS uydurur: ölçü hesabı tek
   yerde kalır ve çizgi kalınlığı ekranla birlikte oransal büyür.
   Eksen etiketi yok — telefonda kalabalık yapıyor ve okunmuyor;
   anlamlı sayılar zaten grafiğin üstünde ve altında yazılı. Grafiğin
   işi rakam vermek değil, şekli göstermek.

   Sesli okuyucu için sayıların kendisi aria-label'a yazılıyor:
   şekli göremeyen biri için grafiğin tek karşılığı o.
   ============================================================ */

import { esc, num } from "../dom.js";

const SW = 240, SH = 44, PAD = 5;

const r1 = n => Math.round(n * 10) / 10;

export function sparkHTML(vals, label = "Ağırlık seyri", unit = "kg"){
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const inner = SH - PAD * 2;
  const x = i => PAD + i * (SW - PAD * 2) / (vals.length - 1);
  /* Bütün kayıtlar aynı değerdeyse aralık sıfır — çizgi ortadan düz
     geçsin, sıfıra bölme olmasın. */
  const y = v => hi === lo ? SH / 2 : PAD + inner - (v - lo) / (hi - lo) * inner;

  const pts = vals.map((v, i) => r1(x(i)) + "," + r1(y(v)));
  const area = "M" + pts.join(" L") +
               " L" + r1(SW - PAD) + "," + SH + " L" + PAD + "," + SH + " Z";
  /* Nokta sayısı arttıkça işaretçiler çizgiyi yiyor; kalabalıkta
     yalnızca çizgi ve son nokta kalır. */
  const dots = vals.length <= 10
    ? vals.map((v, i) => '<circle class="pt" cx="' + r1(x(i)) + '" cy="' + r1(y(v)) + '" r="2.4"/>').join("")
    : "";

  return '<svg class="spark" viewBox="0 0 ' + SW + ' ' + SH + '" role="img" ' +
      'aria-label="' + esc(label) + ': ' + esc(vals.map(num).join(", ")) + ' ' + esc(unit) + '">' +
      '<path class="area" d="' + area + '"/>' +
      '<polyline class="line" points="' + pts.join(" ") + '"/>' + dots +
      '<circle class="now" cx="' + r1(x(vals.length - 1)) + '" ' +
        'cy="' + r1(y(vals[vals.length - 1])) + '" r="3.4"/>' +
    '</svg>';
}
