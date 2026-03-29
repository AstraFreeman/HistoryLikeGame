# Історія як гра — посібник розробника

**Live:** https://astrafreeman.github.io/HistoryLikeGame/

## Архітектура
- Hub-and-spoke: index.html → окремі ігри
- Без збірника (build system) — чистий HTML/CSS/JS
- Працює з file:// протоколом
- Shared JS через window.* глобальні об'єкти (без ES modules)
- Без innerHTML — тільки document.createElement та DOM-методи

## Структура директорій
```
index.html                    # Головна сторінка
shared/
  css/
    reset.css                 # Box-sizing, базова типографіка
    theme.css                 # CSS custom properties (кольори, відступи)
    layout.css                # Контейнери ігор, сітки, панелі
    components.css            # Кнопки, картки, модалки, навбар
    animations.css            # @keyframes та класи анімацій
    responsive.css            # Mobile-first медіа-запити
  js/
    nav.js                    # Sticky навбар
    quiz-engine.js            # window.QuizGame
    game-engine.js            # window.FallingGame
    timeline-engine.js        # window.TimelineGame
    canvas-utils.js           # window.CanvasUtils
    ui-utils.js               # window.UIUtils
    assistant.js              # Помічник-восьминог
    analytics.js              # window.HLGAnalytics — аналітика
    asset-validator.js        # window.AssetValidator — фолбек для відсутніх зображень
    accessibility.js          # Плаваюча панель налаштувань доступності
  templates/
    quiz-question.html        # Шаблон вікторини (?id= → data/quiz/)
    falling-answer.html       # Шаблон гри з падаючими відповідями (?id= → data/falling/)
    timeline-sort.html        # Шаблон хронологічного сортування (?id= → data/timeline/)
data/
  quiz/                       # 23 файли даних вікторин
  falling/                    # 9 файлів даних падаючих ігор
  timeline/                   # 8 файлів хронологічного сортування
  assistant/facts.js          # 50+ фактів для помічника
  pheniks_2/                  # Зображення пазлів (MZP/PTL/SGD)
  games/                      # Дані ігор та зображення
    solitaire-v2-cossack.js
    bobble-imperial.js
    puzzle-soviet.js
    kafe-independence.js
    archaeology/              # Зображення артефактів (TRPL_*, SKIF_*, GREK_*, KAMN_*)
    city-builder/             # Фото будівель (RATH_1, TSER_1, SHKO_1, FORT_1)
    culture-gallery/          # Зображення мистецтва (GAL_*)
    culture-timeline/         # Зображення подій культури (TL9_*)
games/
  narrative/                  # 24 унікальні ігрові HTML-файли
    tower-defense.html        # Three.js tower defense (Період 5)
    archaeology.html          # Розкопки: артефакти, класифікація за культурою (Період 1)
    city-builder.html         # Будівник міста з вікториною (Період 3)
    diplomat.html             # Текстовий квест при дворі Вітовта (Період 3)
    samvydav.html             # Покрокова стратегія, уникнення КДБ (Період 7)
    radio-svoboda.html        # Квіз-шоу у форматі радіоефіру (Період 7)
    culture-tower.html        # 15-рівнева вежа культури (Період 9)
    culture-gallery.html      # Галерея мистецтва (Період 9)
  start-pages/                # Вступні сторінки
  quiz-hub/                   # Сітка різдвяних вікторин
  map/                        # Інтерактивна карта де Боплана
ar/                           # A-Frame / AR.js сторінки (~22 HTML)
assets/                       # Зображення, моделі, музика, шрифти
docs/                         # Документація
```

## Shared JS API

### QuizGame (`shared/js/quiz-engine.js`)
```js
window.QuizGame.init({
  dataVar: 'QUIZ_DATA',
  containerId: 'quiz-container'
});
```

### FallingGame (`shared/js/game-engine.js`)
```js
window.FallingGame.init({
  dataVar: 'FALLING_DATA',
  canvasId: 'game-canvas'
});
```

### TimelineGame (`shared/js/timeline-engine.js`)
```js
window.TimelineGame.init({
  dataVar: 'TIMELINE_DATA',
  containerId: 'timeline-container'
});
```
Drag-and-drop (миша + тач) + click-to-swap для доступності. Багато раундів, підрахунок балів зі штрафом за повтори, система підказок, модальне вікно з деталями подій.

### CanvasUtils (`shared/js/canvas-utils.js`)
```js
window.CanvasUtils.setup(canvasId, containerId)
window.CanvasUtils.resize()
window.CanvasUtils.getSize()
window.CanvasUtils.checkCollisionAABB(a, b)  // {x,y,w,h}
window.CanvasUtils.checkCollisionCircle(a, b) // {x,y,radius}
window.CanvasUtils.reflectOffWalls(ball, bounds)
window.CanvasUtils.clear(bgColor)
```

### UIUtils (`shared/js/ui-utils.js`)
```js
window.UIUtils.showModal(modalId, overlayId)
window.UIUtils.hideModal(modalId, overlayId)
window.UIUtils.updateText(elementId, text)
window.UIUtils.updateScore(scoreId, value)
window.UIUtils.updateLives(livesId, value)
window.UIUtils.showNotification(message, duration)
```

### AssetValidator (`shared/js/asset-validator.js`)
```js
window.AssetValidator.createImg(src, alt, opts)
// Повертає <img> або червоний квадрат (#e00) з назвою файлу при помилці завантаження
```

## Навігація (`shared/js/nav.js`)
Читає data-атрибути з `<body>`:
- `data-section` — назва розділу
- `data-game-title` — назва гри
- `data-home-url` — шлях до index.html
- `data-nav="overlay"` — плаваюча кнопка для повноекранних ігор
- `data-nav="false"` — без навбару

## CSS theming
`theme.css` визначає CSS custom properties:
- `--color-bg-primary`, `--color-accent-blue`, тощо
- `--glass-bg`, `--glass-border`, `--glass-blur`
- `--space-xs` через `--space-3xl`
- `--text-xs` через `--text-4xl` (clamp() + rem, масштабуються з .font-lg/.font-xl)
- `--game-accent`, `--game-bg` — для кастомізації на рівні сторінки

**Правило font-size:** всі значення використовують `var(--text-*)`, ніколи не хардкодять `px`. Виняток: Canvas API `ctx.font` вимагає `px`.

## Система доступності (`shared/js/accessibility.js`)

IIFE-модуль, що створює плаваючу кнопку-шестеренку та панель налаштувань через `document.createElement` (без innerHTML).

**CSS-класи, що переключаються:**
- `.theme-light` на `<body>` — світла тема
- `.font-lg`, `.font-xl` на `<html>` — збільшений / великий шрифт
- `.reduce-motion` на `<html>` — зменшення анімацій
- `.high-contrast` на `<html>` — висока контрастність

**localStorage ключі:**
- `histgame_theme` — `'dark'` або `'light'`
- `histgame_fontsize` — `'normal'`, `'large'`, `'xlarge'`
- `histgame_reducemotion` — `'true'` або `'false'`
- `histgame_highcontrast` — `'true'` або `'false'`

**Підключення:** додайте перед `</body>`:
```html
<script src="../../shared/js/accessibility.js"></script>
```

**Запобігання FOUC:** на `index.html` є ранній `<script>` в `<head>`, що застосовує збережені класи до рендеру.

## Як додати нову гру

1. Створіть файл даних: `data/games/my-game-data.js`
   ```js
   window.MY_GAME_DATA = { ... };
   ```

2. Створіть HTML: `games/narrative/my-game.html`
   ```html
   <!DOCTYPE html>
   <html lang="uk">
   <head>
       <link rel="stylesheet" href="../../shared/css/reset.css">
       <link rel="stylesheet" href="../../shared/css/theme.css">
       <link rel="stylesheet" href="../../shared/css/animations.css">
   </head>
   <body data-nav="overlay" data-home-url="../../index.html">
       <!-- Гра -->
       <script src="../../data/games/my-game-data.js"></script>
       <script>/* Логіка гри */</script>
       <script src="../../shared/js/nav.js"></script>
       <script src="../../shared/js/analytics.js"></script>
       <script src="../../shared/js/accessibility.js"></script>
   </body>
   </html>
   ```

3. Інтегруйте аналітику (2 рядки):
   ```js
   if (window.HLGAnalytics) HLGAnalytics.startSession('my-game');
   // ...при завершенні:
   if (window.HLGAnalytics) HLGAnalytics.endSession({ score: s, won: true });
   ```

4. Додайте посилання в `index.html`

## Як додати дані для quiz/falling/timeline шаблонів

Quiz: створіть `data/quiz/crstm-s-{row}-{col}.js`:
```js
window.QUIZ_DATA = {
  title: "...",
  questions: [
    { question: "...", answers: ["..."], correct: 0 }
  ]
};
```
Посилання: `shared/templates/quiz-question.html?id={row}-{col}`

Falling: створіть `data/falling/period-{n}-{name}.js`:
```js
window.FALLING_DATA = {
  title: "...", section: "...",
  winScore: 50, lives: 3, dropSpeed: 2, addInterval: 2000, maxActive: 5,
  questions: [{ question: "...", answer: "..." }]
};
```
Посилання: `shared/templates/falling-answer.html?id=period-{n}-{name}`

Timeline: створіть `data/timeline/period-{n}-{name}.js`:
```js
window.TIMELINE_DATA = {
  title: "...", section: "...",
  rounds: [{
    name: "...",
    events: [{ text: "...", year: 1234, detail: "..." }]
  }]
};
```
Посилання: `shared/templates/timeline-sort.html?id=period-{n}-{name}`

## Аналітика (`shared/js/analytics.js`)

Легка, приватна аналітика навчальних сесій. Дані в `localStorage` (ключ: `histgame_analytics`). Без мережевих запитів.

### API: `window.HLGAnalytics`
```js
HLGAnalytics.startSession('module-id');  // почати (авто з ?id= або pathname)
HLGAnalytics.endSession({ score: 12, won: true, attempts: 3 }); // зберегти
HLGAnalytics.cancelSession();    // скасувати без збереження
HLGAnalytics.getSessions();      // масив записів
HLGAnalytics.getOverview();      // { totalSessions, totalTime, uniqueModules }
HLGAnalytics.getModuleSummary(id); // статистика модуля
HLGAnalytics.exportJSON();       // рядок JSON
HLGAnalytics.exportCSV();        // рядок CSV
HLGAnalytics.downloadFile('csv'); // завантажити файл
HLGAnalytics.sendToTeacher();    // mailto: з CSV
HLGAnalytics.renderDashboard(id); // міні-картка (index.html)
HLGAnalytics.renderExport(id);    // повна таблиця + кнопки (docs/analytics.html)
HLGAnalytics.clearAll();          // очистити з підтвердженням
```

### Формат запису
```json
{"m":"period-5-imperium","t0":1710400000000,"dt":45200,"a":3,"s":12,"w":true}
```
~120 байт на запис. Ключі: m=модуль, t0=початок, dt=тривалість(мс), a=спроби, s=бал, w=перемога.

### Інтеграція
Shared engines (quiz-engine, game-engine, timeline-engine) викликають `startSession`/`endSession` автоматично. Кастомні ігри додають 2 рядки. Всі виклики захищені `if (window.HLGAnalytics)`.

## Конвенції
- Файли: kebab-case (`my-game.html`, `my-data.js`)
- Мова UI: українська, тільки перше слово з великої літери
- Без ES модулів: `window.*` глобальні об'єкти
- Без innerHTML: тільки createElement + DOM-методи
- Шляхи від ігор: `../../shared/`, `../../assets/`
- AR-сторінки: inline floating `<a>` замість nav.js
- font-size: тільки `var(--text-*)`, без хардкодженого `px` (крім Canvas API)
