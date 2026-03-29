# Історія як гра / History as a Game

**Live:** https://astrafreeman.github.io/HistoryLikeGame/

## Опис / Description

"Історія як гра" — інтерактивний навчальний веб-проект, що дозволяє вивчати українську історію через браузерні ігри. Проект охоплює 9 історичних періодів — від стародавніх часів до незалежності України, а також спецсекції з доповненою реальністю.

"History as a Game" — an interactive educational web project for learning Ukrainian history through browser-based games. The project covers 9 historical periods — from ancient times to Ukrainian independence, plus augmented reality sections.

## Автор / Author

**Serhii S. Korniienko** (Корнієнко Сергій Сергійович)

Resource support: **Serhiy O. Semerikov** (Семеріков Сергій Олексійович)

Coded with **Claude Code Opus 4.6** (Anthropic)

## Як запустити / Getting Started

Відкрийте будь-який HTML-файл безпосередньо у браузері (працює з `file://`), або запустіть локальний сервер:

```bash
python3 -m http.server 8000
```

Відкрийте http://localhost:8000

## Структура проекту / Project Structure

```
index.html                    # Головна сторінка / Main hub page
shared/
  css/                        # 6 CSS файлів (reset, theme, layout, components, animations, responsive)
  js/                         # 10 JS модулів (nav, quiz-engine, game-engine, timeline-engine, canvas-utils, ui-utils, assistant, analytics, asset-validator, accessibility)
  templates/                  # 3 шаблони (quiz, falling, timeline)
data/
  quiz/                       # 23 файли даних вікторин
  falling/                    # 9 файлів падаючих ігор
  timeline/                   # 8 файлів хронологічного сортування
  assistant/                  # Факти для помічника
  games/                      # Дані ігор та зображення (solitaire, bobble, puzzle, kafe, archaeology, city-builder, culture)
games/
  narrative/                  # 24 унікальні ігрові сторінки
  start-pages/                # Вступні сторінки перед іграми
  quiz-hub/                   # Сітка різдвяних вікторин
  map/                        # Інтерактивна карта де Боплана
ar/                           # A-Frame / AR.js сторінки доповненої реальності (~22 HTML)
assets/                       # Зображення, 3D-моделі, музика, шрифти
docs/                         # Документація (посібник гравця, посібник розробника)
```

## Ігри / Games

### Основні періоди

| Період | Ігри |
|--------|------|
| 0 — Вступ | Хронобій, Іст. Block Buster, Компас, Пасянс |
| 1 — Стародавня історія | Стародавня історія, Археологічні розкопки, Вікторина, Хронологія |
| 2 — Русь-Україна | Русь-Україна вікторина, Кара вікінга, Хронологія |
| 3 — ВКЛ | ВКЛ вікторина, Будівник міста, Дипломат, Хронологія |
| 4 — Козацька доба | Історична косинка v2, Козацька вікторина, Хронологія |
| 5 — Імперський період | Bobble Shooter, Оборона фортеці, Вікторина |
| 6 — Українська революція | Українська революція, Хронологія, Вікторина |
| 7 — Радянський період | Історичний пазл, Самвидав, Радіо Свобода, Хронологія, Вікторина |
| 8 — Незалежність | Характерне кафе, Хронологія, Вікторина |
| 9 — Культура | Вежа культури, Культурна галерея, Хронологія, Вікторина |

### Спеціальні секції

| Секція | Опис |
|--------|------|
| α — Різдвяний | Секретна сітка вікторин (23 рівні, пароль) |
| β — Гра у грі | Інлайн 3×3 міні-пазл на головній сторінці |
| AR | Квебек, Торонто, Онтаріо — ігри з доповненою реальністю |
| Карта | Інтерактивна карта де Боплана з маркерами |

## Технології / Technologies

- HTML5, CSS3, JavaScript (ES5+, no build system)
- Three.js (tower defense, chronobiy)
- A-Frame + AR.js (AR games)
- Wordwall integration (viraska)
- CSS Custom Properties theming (dark glassmorphism)
- localStorage persistence (game progress, accessibility settings, analytics)

## Доступність / Accessibility

На всіх сторінках доступна плаваюча кнопка налаштувань (шестеренка):

- Тема: темна / світла
- Розмір тексту: звичайний / збільшений (A+) / великий (A++)
- Зменшення анімацій
- Висока контрастність

Налаштування зберігаються в localStorage.

## Аналітика / Analytics

Приватна аналітика навчальних сесій зберігається тільки у браузері (localStorage). Без мережевих запитів, cookies чи особистих даних. Експорт у JSON/CSV, надсилання викладачу через email.

## Ліцензія / License

All rights reserved. For educational use.
