# Історія як гра / History as a Game

## Опис / Description

"Історія як гра" — інтерактивний навчальний веб-проект, що дозволяє вивчати українську історію через браузерні ігри. Проект охоплює 9 історичних періодів — від стародавніх часів до незалежності України.

"History as a Game" — an interactive educational web project for learning Ukrainian history through browser-based games. The project covers 9 historical periods — from ancient times to Ukrainian independence.

## Автор / Author

**Serhii S. Korniienko** (Корнієнко Сергій Сергійович)

Resource support: **Serhiy O. Semerikov** (Семеріков Сергій Олексійович)

Coded with **Claude Code Opus 4.6** (Anthropic)

## Як запустити / Getting Started

Open any HTML file directly in a browser, or serve with any static file server:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

## Структура проекту / Project Structure

```
index.html                    # Головна сторінка / Main hub page
shared/
  css/                        # 6 CSS файлів (reset, theme, layout, components, animations, responsive)
  js/                         # 7 JS модулів (nav, quiz-engine, game-engine, canvas-utils, ui-utils, assistant, accessibility)
  templates/                  # Шаблони quiz та falling ігор
data/
  quiz/                       # 23 файли даних вікторин
  falling/                    # 3 файли падаючих ігор
  assistant/                  # Факти для помічника
  games/                      # Дані нових ігор (solitaire, bobble, puzzle, kafe)
games/
  narrative/                  # Наративні та унікальні ігри
  start-pages/                # Вступні сторінки перед іграми
  quiz-hub/                   # Сітка різдвяних вікторин
  map/                        # Інтерактивна карта де Боплана
ar/                           # A-Frame / AR.js сторінки доповненої реальності
assets/                       # Зображення, 3D-моделі, музика, шрифти
docs/                         # Документація (посібник гравця, посібник розробника)
```

## Ігри / Games

| Період / Period | Гра / Game | Опис / Description |
|---|---|---|
| 0 — Вступ | Хронобій | Three.js гра: сортуйте події хронологічно, атакуйте ворогів |
| 0 — Вступ | Іст. Block Buster | Арканоїд з історичними блоками |
| 0 — Вступ | Компас | Орієнтування на історичній карті |
| 0 — Вступ | Пасянс | Класична карткова гра з 4 історичними темами |
| 1 — Стародавня історія | Стародавня історія | Хронологічний шлях по стародавніх культурах |
| 2 — Русь-Україна | Русь-Україна вікторина | Падаючі дати — ловіть правильні відповіді |
| 2 — Русь-Україна | Кара вікінга | Canvas-гра: ловіть яблука правильної категорії |
| 3 — ВКЛ | ВКЛ вікторина | Падаючі дати литовського періоду |
| 4 — Козацька доба | Історична косинка v2 | Пасянс з козацькими подіями, 4 теми |
| 4 — Козацька доба | Козацька вікторина | Падаючі питання — набирайте роки подій |
| 5 — Імперський період | Bobble Shooter | Стрільба кульками: 4 кольори = 4 категорії |
| 5 — Імперський період | Оборона фортеці | Three.js tower defense |
| 6 — Українська революція | Українська революція | Wordwall тести |
| 7 — Радянський період | Історичний пазл | Drag-and-drop пазли з 3 портретами |
| 8 — Незалежність | Характерне кафе | Симулятор кафе з історичними фактами |
| α — Різдвяний | Різдвяна вікторина | Секретна сітка вікторин (пароль) |
| β — Гра у грі | Міні-пазл | Інлайн 3×3 пазл на головній сторінці |
| AR | Квебек, Торонто, Юкон | Ігри з доповненою реальністю |

## Технології / Technologies

- HTML5, CSS3, JavaScript (ES5+, no build system)
- Three.js (tower defense, chronobiy)
- A-Frame + AR.js (AR games)
- Wordwall integration (viraska)
- CSS Custom Properties theming (dark glassmorphism)
- localStorage persistence (game progress, accessibility settings)

## Доступність / Accessibility

На всіх сторінках доступна плаваюча кнопка налаштувань (шестеренка):

- Тема: темна / світла
- Розмір тексту: звичайний / збільшений / великий
- Зменшення анімацій
- Висока контрастність

Налаштування зберігаються в localStorage.

## Ліцензія / License

All rights reserved. For educational use.
