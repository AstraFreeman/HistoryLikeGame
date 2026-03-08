# Історія як гра — посібник розробника

## Архітектура
- Hub-and-spoke: index.html → окремі ігри
- Без збірника (build system) — чистий HTML/CSS/JS
- Працює з file:// протоколом
- Shared JS через window.* глобальні об'єкти (без ES modules)

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
    canvas-utils.js           # window.CanvasUtils
    ui-utils.js               # window.UIUtils
    assistant.js              # Помічник-восьминог
  templates/
    quiz-question.html        # Шаблон вікторини
    falling-answer.html       # Шаблон гри з падаючими відповідями
data/
  quiz/                       # 23 файли даних вікторин
  falling/                    # 3 файли даних падаючих ігор
  assistant/facts.js          # 50+ фактів для помічника
  games/                      # Дані нових ігор
    solitaire-v2-cossack.js
    bobble-imperial.js
    puzzle-soviet.js
    kafe-independence.js
games/
  narrative/                  # Наративні та унікальні ігри
  start-pages/               # Вступні сторінки
  quiz-hub/                  # Сітка вікторин
  map/                       # Інтерактивна карта
ar/                          # A-Frame / AR.js сторінки
assets/                      # Зображення, моделі, музика, шрифти
docs/                        # Документація
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
- `--text-xs` через `--text-4xl`
- `--game-accent`, `--game-bg` — для кастомізації на рівні сторінки

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
   </body>
   </html>
   ```

3. Додайте посилання в `index.html`

## Як додати дані для quiz/falling шаблонів

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
window.FALLING_DATA = { ... };
```
Посилання: `shared/templates/falling-answer.html?id={n}-{name}`

## Конвенції
- Файли: kebab-case (`my-game.html`, `my-data.js`)
- Мова UI: українська, тільки перше слово з великої літери
- Без ES модулів: `window.*` глобальні об'єкти
- Шляхи від ігор: `../../shared/`, `../../assets/`
- AR-сторінки: inline floating `<a>` замість nav.js
