/* ============================================================
   Teknik paneli gövdesi.

   Bir hareketin üç sorusu var: neden yapılıyor, nasıl yapılıyor,
   nerede bozuluyor. Cevap antrenman ekranında da, ısınma panelinde
   de, hareket kütüphanesinde de aynı — kalıp burada tek yerde duruyor.

   Video ancak düğmeye basılınca yükleniyor; gömüyü açan kod
   ui/sheet.js'te, çünkü panelin içindeki her tıklamayı orası
   dinliyor.
   ============================================================ */

import { esc } from "../dom.js";

export function techBody(m, v){
  return '<div class="exbody">' +
    '<h4>Neden bu hareket</h4><p class="why">' + esc(m.why) + '</p>' +
    '<h4>Nasıl yapılır</h4><ol>' + m.cues.map(c => "<li>" + esc(c) + "</li>").join("") + '</ol>' +
    '<div class="warnbox"><b>En sık hata.</b> ' + esc(m.mistake) + '</div>' +
    (v
      ? '<div class="videoslot" data-vid="' + esc(v.id) + '">' +
          '<button type="button" class="vbtn">' +
            '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Tekniği izle</button>' +
          '<p class="vmeta">' + esc(v.channel) + '</p>' +
        '</div>'
      : m.noVideo
        ? ''
        : '<p class="note" style="margin-top:14px">Bu hareket için seçilmiş bir video henüz yok.</p>') +
  '</div>';
}
