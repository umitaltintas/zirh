/* ============================================================
   Program setleri — 1'den 5'e.

   Her seviye bir öncekinin üstüne kurulur:
     1  makinede hareketi öğren
     2  serbest ağırlığa geç, üçüncü günü ekle
     3  barbell'e geç, kas grubuna göre böl
     4  hacmi artır, haftayı dörde çıkar
     5  kas grubu başına bir gün

   Bir güne yazılan set/tekrar/dinlenme programa aittir; hareketin
   kendisi (teknik, video, başlangıç ağırlığı) exercises.js'te.

   Her günün bir "warm" alanı var: o gün hangi kalıba yaslanıyorsa
   ısınma da ona göre seçilsin diye. Karşılıkları warmup.js'te —
   full, push, pull, legs, hinge.
   ============================================================ */

import { EXERCISES } from "./exercises.js";

export const PROGRAMS = [
  {
    id: 1,
    name: "Temel",
    tagline: "Hareketi makinede öğren",
    who: "Daha önce hiç ağırlık çalışmadıysan buradan başla.",
    freq: "Haftada 2 gün",
    focus: "Tüm vücut",
    note: "Makineler hareketi senin yerine yönlendirir. İlk hedef ağırlık değil, her hareketi düşünmeden yapabilir hâle gelmek.",
    days: [
      {
        key: "A", title: "İtiş, çekiş, bacak", short: "İtiş, çekiş, bacak",
        desc: "Vücudun tamamı tek seansta. Makine ağırlıklı, öğrenmesi kolay, dengeye ihtiyaç duymayan hareketler.",
        warm: "full",
        ex: [
          { id: "leg-press", sets: 3, reps: "10-12", rest: 120 },
          { id: "chest-press-machine", sets: 3, reps: "10-12", rest: 90 },
          { id: "seated-cable-row", sets: 3, reps: "10-12", rest: 90 },
          { id: "seated-leg-curl", sets: 2, reps: "12-15", rest: 60 },
          { id: "face-pull", sets: 2, reps: "15", rest: 60 },
          { id: "plank", sets: 3, reps: "20-40 sn", rest: 45 }
        ]
      },
      {
        key: "B", title: "Kalça, sırt, omuz", short: "Kalça, sırt, omuz",
        desc: "Aynı kas gruplarına farklı açıdan. A gününden en az 2 gün sonra yapın.",
        warm: "full",
        ex: [
          { id: "hip-thrust", sets: 3, reps: "10-12", rest: 120 },
          { id: "lat-pulldown", sets: 3, reps: "10-12", rest: 90 },
          { id: "shoulder-press-machine", sets: 3, reps: "10-12", rest: 90 },
          { id: "leg-press-high", sets: 3, reps: "12-15", rest: 90 },
          { id: "wall-angel", sets: 2, reps: "10", rest: 45 },
          { id: "side-plank", sets: 3, reps: "20-30 sn / taraf", rest: 45 }
        ]
      }
    ]
  },

  {
    id: 2,
    name: "Kuruluş",
    tagline: "Serbest ağırlığa geç",
    who: "Makinelerde 6-8 hafta çalıştıysan ve hareketler artık düşündürmüyorsa.",
    freq: "Haftada 3 gün",
    focus: "Tüm vücut",
    note: "Dambıl ve bar, makinenin yapmadığı işi yapar: dengeyi sana bırakır. Ağırlıklar bir süre düşecek, bu normal.",
    days: [
      {
        key: "A", title: "Squat ve itiş", short: "Squat, itiş",
        desc: "Goblet squat ile squat kalıbını öğren, dambılla itişe geç.",
        warm: "full",
        ex: [
          { id: "goblet-squat", sets: 3, reps: "8-10", rest: 120 },
          { id: "db-bench-press", sets: 3, reps: "8-10", rest: 90 },
          { id: "seated-cable-row", sets: 3, reps: "10-12", rest: 90 },
          { id: "seated-leg-curl", sets: 2, reps: "12", rest: 60 },
          { id: "plank", sets: 3, reps: "30-45 sn", rest: 45 }
        ]
      },
      {
        key: "B", title: "Kalça menteşesi ve çekiş", short: "Kalça, çekiş",
        desc: "Romen deadlift kalça kalıbını kurar; hafta içindeki en değerli beceri.",
        warm: "hinge",
        ex: [
          { id: "db-romanian-deadlift", sets: 3, reps: "8-10", rest: 120 },
          { id: "lat-pulldown", sets: 3, reps: "8-10", rest: 90 },
          { id: "db-shoulder-press", sets: 3, reps: "8-10", rest: 90 },
          { id: "walking-lunge", sets: 2, reps: "10 / taraf", rest: 90 },
          { id: "dead-bug", sets: 3, reps: "8 / taraf", rest: 45 }
        ]
      },
      {
        key: "C", title: "Kalça ve üst göğüs", short: "Kalça, üst göğüs",
        desc: "Haftanın üçüncü günü; hacmi artırır, ilk iki günün eksiğini tamamlar.",
        warm: "hinge",
        ex: [
          { id: "hip-thrust", sets: 3, reps: "8-10", rest: 120 },
          { id: "incline-db-press", sets: 3, reps: "10", rest: 90 },
          { id: "machine-row", sets: 3, reps: "10-12", rest: 90 },
          { id: "leg-extension", sets: 2, reps: "12-15", rest: 60 },
          { id: "face-pull", sets: 2, reps: "15", rest: 60 },
          { id: "side-plank", sets: 3, reps: "30 sn / taraf", rest: 45 }
        ]
      }
    ]
  },

  {
    id: 3,
    name: "İtiş · Çekiş · Bacak",
    tagline: "Bara geç, kas grubuna böl",
    who: "Squat, bench ve row hareketlerini formu bozmadan yapabiliyorsan.",
    freq: "Haftada 3 gün",
    focus: "Kas grubuna göre bölünmüş",
    note: "Klasik bölüm. Her gün bir hareket kalıbına ayrılır, o yüzden ağır set yapacak taze gücün olur.",
    days: [
      {
        key: "İ", title: "İtiş", short: "Göğüs, omuz, triceps",
        desc: "Vücudun ittiği her şey. Ağır bileşik hareketle başla, izolasyonla bitir.",
        warm: "push",
        ex: [
          { id: "barbell-bench-press", sets: 4, reps: "6-8", rest: 150 },
          { id: "overhead-press", sets: 3, reps: "8-10", rest: 120 },
          { id: "incline-db-press", sets: 3, reps: "10-12", rest: 90 },
          { id: "lateral-raise", sets: 3, reps: "12-15", rest: 60 },
          { id: "triceps-pushdown", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        key: "Ç", title: "Çekiş", short: "Sırt, arka omuz, biceps",
        desc: "Vücudun çektiği her şey. İtiş gününün karşı ağırlığı, duruşun bekçisi.",
        warm: "pull",
        ex: [
          { id: "barbell-row", sets: 4, reps: "6-8", rest: 150 },
          { id: "lat-pulldown", sets: 3, reps: "8-10", rest: 90 },
          { id: "seated-cable-row", sets: 3, reps: "10-12", rest: 90 },
          { id: "rear-delt-fly", sets: 3, reps: "15", rest: 60 },
          { id: "hammer-curl", sets: 3, reps: "10-12", rest: 60 }
        ]
      },
      {
        key: "B", title: "Bacak", short: "Bacak, kalça, baldır",
        desc: "Haftanın en zor günü. Atlamak isteyeceğin gün de bu; atlanmaması gereken gün de.",
        warm: "legs",
        ex: [
          { id: "back-squat", sets: 4, reps: "6-8", rest: 180 },
          { id: "romanian-deadlift", sets: 3, reps: "8-10", rest: 150 },
          { id: "leg-press", sets: 3, reps: "10-12", rest: 120 },
          { id: "seated-leg-curl", sets: 3, reps: "12", rest: 60 },
          { id: "calf-raise", sets: 3, reps: "15", rest: 45 }
        ]
      }
    ]
  },

  {
    id: 4,
    name: "Üst · Alt",
    tagline: "Haftada dört gün, iki kat hacim",
    who: "Bir yıla yakın düzenli çalıştıysan ve haftada 4 gün ayırabiliyorsan.",
    freq: "Haftada 4 gün",
    focus: "Üst ve alt vücut, ikişer kez",
    note: "Her kas grubu haftada iki kez uyarılır. Kas gelişimi için üçe bölmekten daha verimli, ama daha fazla zaman ister.",
    days: [
      {
        key: "Ü1", title: "Üst · itiş ağırlıklı", short: "Üst vücut, itiş",
        desc: "Bench ve omuz presi ağır; çekiş ve kol işi hacim için.",
        warm: "push",
        ex: [
          { id: "barbell-bench-press", sets: 4, reps: "5-8", rest: 180 },
          { id: "overhead-press", sets: 3, reps: "6-8", rest: 150 },
          { id: "lat-pulldown", sets: 3, reps: "8-10", rest: 90 },
          { id: "lateral-raise", sets: 3, reps: "12-15", rest: 60 },
          { id: "triceps-pushdown", sets: 3, reps: "10-12", rest: 60 },
          { id: "biceps-curl", sets: 3, reps: "10-12", rest: 60 }
        ]
      },
      {
        key: "A1", title: "Alt · squat ağırlıklı", short: "Alt vücut, squat",
        desc: "Squat ağır; tek bacak ve arka bacak işi dengeyi kurar.",
        warm: "legs",
        ex: [
          { id: "back-squat", sets: 4, reps: "5-8", rest: 180 },
          { id: "romanian-deadlift", sets: 3, reps: "8-10", rest: 150 },
          { id: "bulgarian-split-squat", sets: 3, reps: "8 / taraf", rest: 90 },
          { id: "seated-leg-curl", sets: 3, reps: "12", rest: 60 },
          { id: "calf-raise", sets: 4, reps: "12-15", rest: 45 }
        ]
      },
      {
        key: "Ü2", title: "Üst · çekiş ağırlıklı", short: "Üst vücut, çekiş",
        desc: "Bu kez sırt önce geliyor; göğüs eğik açıdan çalışıyor.",
        warm: "pull",
        ex: [
          { id: "barbell-row", sets: 4, reps: "6-8", rest: 150 },
          { id: "incline-db-press", sets: 4, reps: "8-10", rest: 120 },
          { id: "pull-up", sets: 3, reps: "yapabildiğin kadar", rest: 120 },
          { id: "cable-fly", sets: 3, reps: "12-15", rest: 60 },
          { id: "face-pull", sets: 3, reps: "15", rest: 60 },
          { id: "hammer-curl", sets: 3, reps: "10-12", rest: 60 }
        ]
      },
      {
        key: "A2", title: "Alt · deadlift ağırlıklı", short: "Alt vücut, deadlift",
        desc: "Deadlift ağır ve az tekrarlı; gerisi kalça ve ön bacak için.",
        warm: "hinge",
        ex: [
          { id: "deadlift", sets: 3, reps: "5", rest: 180 },
          { id: "front-squat", sets: 3, reps: "8-10", rest: 150 },
          { id: "hip-thrust", sets: 3, reps: "8-10", rest: 120 },
          { id: "leg-extension", sets: 3, reps: "12-15", rest: 60 },
          { id: "hanging-leg-raise", sets: 3, reps: "8-12", rest: 60 }
        ]
      }
    ]
  },

  {
    id: 5,
    name: "Bölüm",
    tagline: "Kas grubu başına bir gün",
    who: "Yıllardır çalışıyorsan ve haftanın beş gününü salona ayırabiliyorsan.",
    freq: "Haftada 5 gün",
    focus: "Her gün tek kas grubu",
    note: "En yüksek hacim, en yüksek zaman maliyeti. Haftada 5 gün gerçekten gidemeyeceksen 4. seviye daha çok işine yarar.",
    days: [
      {
        key: "G", title: "Göğüs ve triceps", short: "Göğüs, triceps",
        desc: "İtiş kaslarının tamamı tek günde, ağırdan izolasyona.",
        warm: "push",
        ex: [
          { id: "barbell-bench-press", sets: 4, reps: "5-8", rest: 180 },
          { id: "incline-db-press", sets: 4, reps: "8-10", rest: 120 },
          { id: "cable-fly", sets: 3, reps: "12-15", rest: 60 },
          { id: "skull-crusher", sets: 3, reps: "10-12", rest: 60 },
          { id: "triceps-pushdown", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        key: "S", title: "Sırt ve biceps", short: "Sırt, biceps",
        desc: "Deadlift ile başlar; haftanın en çok kas kütlesi yükleyen günü.",
        warm: "pull",
        ex: [
          { id: "deadlift", sets: 3, reps: "5", rest: 180 },
          { id: "barbell-row", sets: 4, reps: "6-8", rest: 150 },
          { id: "pull-up", sets: 3, reps: "yapabildiğin kadar", rest: 120 },
          { id: "seated-cable-row", sets: 3, reps: "10-12", rest: 90 },
          { id: "biceps-curl", sets: 3, reps: "10-12", rest: 60 },
          { id: "hammer-curl", sets: 3, reps: "12", rest: 60 }
        ]
      },
      {
        key: "B", title: "Bacak", short: "Bacak, baldır",
        desc: "5×5 squat; ağırlık artışını asıl bu set şeması taşır.",
        warm: "legs",
        ex: [
          { id: "back-squat", sets: 5, reps: "5", rest: 180 },
          { id: "romanian-deadlift", sets: 4, reps: "8", rest: 150 },
          { id: "leg-press", sets: 3, reps: "12", rest: 120 },
          { id: "seated-leg-curl", sets: 3, reps: "12", rest: 60 },
          { id: "calf-raise", sets: 4, reps: "15", rest: 45 }
        ]
      },
      {
        key: "O", title: "Omuz ve karın", short: "Omuz, karın",
        desc: "Üç omuz başının üçü de ayrı çalışır; karın işi sona kalır.",
        warm: "push",
        ex: [
          { id: "overhead-press", sets: 4, reps: "6-8", rest: 150 },
          { id: "db-shoulder-press", sets: 3, reps: "10-12", rest: 90 },
          { id: "lateral-raise", sets: 4, reps: "12-15", rest: 60 },
          { id: "rear-delt-fly", sets: 3, reps: "15", rest: 60 },
          { id: "barbell-shrug", sets: 3, reps: "12", rest: 60 },
          { id: "hanging-leg-raise", sets: 3, reps: "10", rest: 60 }
        ]
      },
      {
        key: "K", title: "Kalça ve arka zincir", short: "Kalça, arka zincir",
        desc: "Bacak gününün tamamlayıcısı; kalça, arka bacak ve bel.",
        warm: "hinge",
        ex: [
          { id: "hip-thrust", sets: 4, reps: "8-10", rest: 150 },
          { id: "bulgarian-split-squat", sets: 3, reps: "10 / taraf", rest: 90 },
          { id: "walking-lunge", sets: 3, reps: "12 / taraf", rest: 90 },
          { id: "back-extension", sets: 3, reps: "12", rest: 60 },
          { id: "side-plank", sets: 3, reps: "40 sn / taraf", rest: 45 }
        ]
      }
    ]
  }
];

export const DEFAULT_LEVEL = 1;

export function program(level){
  return PROGRAMS.find(p => p.id === level) || PROGRAMS[0];
}

/* Gün nesnesi + o günün hareketlerini kataloğa bağlanmış hâlde verir. */
export function programDay(level, dayIndex){
  const p = program(level);
  const d = p.days[Math.max(0, Math.min(p.days.length - 1, dayIndex))];
  return {
    ...d,
    index: p.days.indexOf(d),
    program: p,
    ex: d.ex.map(item => ({ ...EXERCISES[item.id], ...item }))
  };
}

/* Değiştirilmiş hareketleri günün üstüne uygular.

   Salonda makine dolu olabilir, o alet o salonda hiç bulunmayabilir,
   ya da bir yerin ağrıyor olabilir. Bunların hiçbirinde doğru cevap
   "seansı boz" değil.

   Set, tekrar ve dinlenme programdan kalıyor; değişen yalnızca
   hareketin kendisi. Hacim kararı programın, hareket seçimi salonun.
   Kayıt geçmişe yeni hareketin adıyla girdiği için ağırlık seyri,
   plato ve haftalık denge kendiliğinden doğru yerden sayıyor.

   swapped: panelde "aslına dön" seçeneğini göstermek için; nereden
   gelindiği ise ekranda yazılıyor, çünkü programda başka bir hareket
   yazdığını görmek insanı tereddüte düşürüyor. */
export function applySwaps(day, swap){
  if(!swap || !Object.keys(swap).length) return day;
  return {
    ...day,
    ex: day.ex.map((e, i) => {
      const alt = EXERCISES[swap[i]];
      if(!alt || swap[i] === e.id) return e;
      return { ...alt, id: swap[i], sets: e.sets, reps: e.reps, rest: e.rest,
               swapped: true, swappedFrom: e.name };
    })
  };
}

/* Gün anahtarından (A, Ü1, Ç …) çözer. Eski kayıtları geçmişe alırken
   elimizde sırası değil yalnızca anahtarı oluyor. */
export function findDay(level, dayKey){
  const ix = program(level).days.findIndex(d => d.key === dayKey);
  return ix < 0 ? null : programDay(level, ix);
}

export function totalSets(day){
  return day.ex.reduce((a, e) => a + e.sets, 0);
}

/* Süre tahmini: her set ~40 saniye iş + hareketin kendi dinlenmesi.
   Sabit bir "45 dk" yazmaktansa programdan hesaplamak, seviye
   değiştiğinde rakamın kendiliğinden doğru kalmasını sağlıyor. */
export function estimateMinutes(day){
  const sec = day.ex.reduce((a, e) => a + e.sets * (40 + e.rest), 0);
  return Math.round((sec / 60 + 6) / 5) * 5;  /* +6 dk ısınma, 5'e yuvarla */
}
