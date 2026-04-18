/* games-registry.js — Реєстр усіх ігор платформи «Історія як гра».
 *
 * window.GAMES_REGISTRY — масив об'єктів, по одному на гру.
 *
 * Поля:
 *   id          {string}  — analytics moduleId (той самий, що у HLGAnalytics.startSession)
 *   title       {string}  — назва гри (як відображається в index.html)
 *   period      {number}  — 0-9; 0 = вступний, null = міжперіодний / спеціальний
 *   sectionKey  {string|null} — ключ у QUESTIONS_DB (falling / timeline / quiz namespaces), або null
 *   type        {string}  — 'narrative' | 'falling' | 'timeline' | 'quiz-hub' | 'ar' | 'map'
 *   mechanic    {string}  — конкретна механіка гри
 *   url         {string}  — шлях від кореня проєкту
 *   hasAnalytics {boolean} — чи підключено HLGAnalytics.startSession
 *
 * Джерело: index.html (навігація) + аналіз games/narrative/*.html.
 * Оновлювати вручну при додаванні нових ігор до index.html.
 */

window.GAMES_REGISTRY = [

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 0 — Вступний
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'washhand-1',
    title: 'Хронобій',
    period: 0,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'arcade-reflex',
    url: 'games/narrative/washhand-1.html',
    hasAnalytics: true
  },
  {
    id: 'new-makako-2',
    title: 'Іст. Block Buster',
    period: 0,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'arkanoid',
    url: 'games/narrative/new-makako-2.html',
    hasAnalytics: true
  },
  {
    id: 'compas',
    title: 'Компас',
    period: 0,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'orientation-mini',
    url: 'games/narrative/compas.html',
    hasAnalytics: true
  },
  {
    id: 'los-elviros-1',
    title: 'Пасянс',
    period: 0,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'solitaire',
    url: 'games/narrative/los-elviros-1.html',
    hasAnalytics: true
  },
  {
    id: 'coin-sorter',
    title: 'Таємниці скарбниці',
    period: 0,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'coin-sort-drag',
    url: 'games/narrative/coin-sorter.html',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 1 — Стародавня Україна (до IX ст.)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'shiwafornia-2',
    title: 'Грати (Стародавня)',
    period: 1,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'narrative-quiz',
    url: 'games/narrative/shiwafornia-2.html',
    hasAnalytics: true
  },
  {
    id: 'archaeology',
    title: 'Розкопки',
    period: 1,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'grid-puzzle',
    url: 'games/narrative/archaeology.html',
    hasAnalytics: true
  },
  {
    id: 'period-1-starodavnia',
    title: 'Вікторина (Стародавня)',
    period: 1,
    sectionKey: 'period-1-starodavnia',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-1-starodavnia',
    hasAnalytics: true
  },
  {
    id: 'period-1-starodavnia',
    title: 'Хронологія (Стародавня)',
    period: 1,
    sectionKey: 'period-1-starodavnia',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-1-starodavnia',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 2 — Русь-Україна (IX–XIII ст.)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'new-orlan-1',
    title: 'Грати (Русь-Україна)',
    period: 2,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'narrative-quiz',
    url: 'games/narrative/new-orlan-1.html',
    hasAnalytics: true
  },
  {
    id: 'masachuchi',
    title: 'Кара вікінга',
    period: 2,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'click-game-canvas',
    url: 'games/narrative/masachuchi/masachuchi.html',
    hasAnalytics: true
  },
  {
    id: 'period-2-kyiv-rus',
    title: 'Хронологія (Русь-Україна)',
    period: 2,
    sectionKey: 'period-2-kyiv-rus',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-2-kyiv-rus',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 3 — Велике князівство Литовське (XIV–XVII ст.)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'taxes-1',
    title: 'Грати (ВКЛ)',
    period: 3,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'narrative-quiz',
    url: 'games/narrative/taxes-1.html',
    hasAnalytics: true
  },
  {
    id: 'city-builder',
    title: 'Будівник міста',
    period: 3,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'grid-builder',
    url: 'games/narrative/city-builder.html',
    hasAnalytics: true
  },
  {
    id: 'diplomat',
    title: 'Дипломат',
    period: 3,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'text-adventure',
    url: 'games/narrative/diplomat.html',
    hasAnalytics: true
  },
  {
    id: 'period-3-vkl',
    title: 'Вікторина (ВКЛ)',
    period: 3,
    sectionKey: 'period-3-vkl',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-3-vkl',
    hasAnalytics: true
  },
  {
    id: 'period-3-vkl',
    title: 'Хронологія (ВКЛ)',
    period: 3,
    sectionKey: 'period-3-vkl',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-3-vkl',
    hasAnalytics: true
  },
  {
    id: 'map',
    title: 'Карта де Боплана',
    period: 3,
    sectionKey: null,
    type: 'map',
    mechanic: 'zoomable-map',
    url: 'games/map/map-file.html',
    hasAnalytics: false
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 4 — Козацька доба (XVII–XVIII ст.)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'solitaire-v2',
    title: 'Історична косинка',
    period: 4,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'solitaire',
    url: 'games/narrative/solitaire-v2.html',
    hasAnalytics: true
  },
  {
    id: 'new-makako-1',
    title: 'Козацька вікторина',
    period: 4,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'falling-quiz-custom',
    url: 'games/narrative/new-makako-1/index.html',
    hasAnalytics: true
  },
  {
    id: 'period-4-kozaky',
    title: 'Хронологія (Козацька)',
    period: 4,
    sectionKey: 'period-4-kozaky',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-4-kozaky',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 5 — Імперський період (кін. XVIII – поч. XX ст.)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'bobble-shooter',
    title: 'Bobble Shooter',
    period: 5,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'arcade-shooter-canvas',
    url: 'games/narrative/bobble-shooter.html',
    hasAnalytics: true
  },
  {
    id: 'tower-defense',
    title: 'Оборона фортеці',
    period: 5,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'tower-defense-3d',
    url: 'games/narrative/tower-defense.html',
    hasAnalytics: true
  },
  {
    id: 'artillery',
    title: 'Артилерист',
    period: 5,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'timing',
    url: 'games/narrative/artillery.html',
    hasAnalytics: true
  },
  {
    id: 'inventions-quiz',
    title: 'Українські винахідники',
    period: 5,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'multiple-choice',
    url: 'games/narrative/inventions-quiz.html',
    hasAnalytics: true
  },
  {
    id: 'period-5-imperium',
    title: 'Вікторина (Імперська)',
    period: 5,
    sectionKey: 'period-5-imperium',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-5-imperium',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 6 — Українська революція (1917–1921)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'viraska',
    title: 'Грати (Революція)',
    period: 6,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'narrative',
    url: 'games/narrative/viraska.html',
    hasAnalytics: true
  },
  {
    id: 'period-6-revolution',
    title: 'Хронологія (Революція)',
    period: 6,
    sectionKey: 'period-6-revolution',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-6-revolution',
    hasAnalytics: true
  },
  {
    id: 'period-6-revolution',
    title: 'Вікторина (Революція)',
    period: 6,
    sectionKey: 'period-6-revolution',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-6-revolution',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 7 — Радянський період (1920–1991)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'puzzle-phenikis',
    title: 'Історичний пазл',
    period: 7,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'jigsaw-puzzle',
    url: 'games/narrative/puzzle-phenikis.html',
    hasAnalytics: true
  },
  {
    id: 'samvydav',
    title: 'Самвидав',
    period: 7,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'turn-based-stealth',
    url: 'games/narrative/samvydav.html',
    hasAnalytics: true
  },
  {
    id: 'radio-svoboda',
    title: 'Радіо Свобода',
    period: 7,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'radio-quiz',
    url: 'games/narrative/radio-svoboda.html',
    hasAnalytics: true
  },
  {
    id: 'period-7-radianskyi',
    title: 'Вікторина (Радянська)',
    period: 7,
    sectionKey: 'period-7-radianskyi',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-7-radianskyi',
    hasAnalytics: true
  },
  {
    id: 'timeline-soviet',
    title: 'Хронологія (Радянська)',
    period: 7,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'timeline-narrative',
    url: 'games/narrative/timeline-soviet.html',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 8 — Незалежність (1991–сьогодні)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'kafe-simulator',
    title: 'Характерне кафе',
    period: 8,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'simulator',
    url: 'games/narrative/kafe-simulator.html',
    hasAnalytics: true
  },
  {
    id: 'period-8-nezalezhnist',
    title: 'Вікторина (Незалежність)',
    period: 8,
    sectionKey: 'period-8-nezalezhnist',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-8-nezalezhnist',
    hasAnalytics: true
  },
  {
    id: 'period-8-nezalezhnist',
    title: 'Хронологія (Незалежність)',
    period: 8,
    sectionKey: 'period-8-nezalezhnist',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-8-nezalezhnist',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     РОЗДІЛ 9 — Українська культура крізь віки
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'culture-tower',
    title: 'Вежа культури',
    period: 9,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'tower-stacking-quiz',
    url: 'games/narrative/culture-tower.html',
    hasAnalytics: true
  },
  {
    id: 'culture-gallery',
    title: 'Культурна галерея',
    period: 9,
    sectionKey: null,
    type: 'narrative',
    mechanic: 'gallery-carousel',
    url: 'games/narrative/culture-gallery.html',
    hasAnalytics: true
  },
  {
    id: 'period-9-kultura',
    title: 'Вікторина (Культура)',
    period: 9,
    sectionKey: 'period-9-kultura',
    type: 'falling',
    mechanic: 'falling-answer',
    url: 'shared/templates/falling-answer.html?id=period-9-kultura',
    hasAnalytics: true
  },
  {
    id: 'period-9-kultura',
    title: 'Хронологія (Культура)',
    period: 9,
    sectionKey: 'period-9-kultura',
    type: 'timeline',
    mechanic: 'drag-drop-sort',
    url: 'shared/templates/timeline-sort.html?id=period-9-kultura',
    hasAnalytics: true
  },

  /* ═══════════════════════════════════════════════════════════════
     СПЕЦІАЛЬНІ (α, β, AR)
  ═══════════════════════════════════════════════════════════════ */
  {
    id: 'crstm-s-main',
    title: 'Різдвяна вікторина (хаб)',
    period: null,
    sectionKey: null,
    type: 'quiz-hub',
    mechanic: 'password-quiz-grid',
    url: 'games/quiz-hub/crstm-s-main.html',
    hasAnalytics: false
  },
  {
    id: 'totoronto',
    title: 'AR-гра: Торонто',
    period: null,
    sectionKey: null,
    type: 'ar',
    mechanic: 'ar-survey',
    url: 'games/narrative/totoronto.html',
    hasAnalytics: true
  },
  {
    id: 'kvebek',
    title: 'AR-гра: Квебек (комп.)',
    period: null,
    sectionKey: null,
    type: 'ar',
    mechanic: 'ar-marker',
    url: 'ar/kvebek.html',
    hasAnalytics: false
  },
  {
    id: 'kvebek-2',
    title: 'AR-гра: Квебек (телефон)',
    period: null,
    sectionKey: null,
    type: 'ar',
    mechanic: 'ar-marker',
    url: 'ar/kvebek-2.html',
    hasAnalytics: false
  },
  {
    id: 'usin',
    title: 'AR-гра: Юкон (підручник)',
    period: null,
    sectionKey: null,
    type: 'ar',
    mechanic: 'ar-marker',
    url: 'ar/usin/usin-1.html',
    hasAnalytics: false
  },
  {
    id: 'ontario',
    title: 'AR-гра: Онтаріо',
    period: null,
    sectionKey: null,
    type: 'ar',
    mechanic: 'ar-marker',
    url: 'ar/ontario.html',
    hasAnalytics: false
  }

];
