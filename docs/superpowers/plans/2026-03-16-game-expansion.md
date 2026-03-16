# Game Expansion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 13 new game experiences across Periods 1, 3, 7, and new Period 9 (Ukrainian Culture) to achieve minimum 3 games per period.

**Architecture:** Each game is a standalone HTML file in `games/narrative/` following existing patterns (IIFE, `window.*` globals, no ES modules). Template-based games (timeline/falling) add only data files to `data/timeline/` and `data/falling/`. All games integrate with `analytics.js`, `accessibility.js`, and `nav.js`. User-provided images validated at runtime with red-square fallbacks.

**Tech Stack:** HTML5, CSS3 (custom properties from theme.css), vanilla JS (ES5+), Canvas API (archaeology only). No build system, no dependencies.

**Spec:** `docs/superpowers/specs/2026-03-16-game-expansion-design.md`

---

## File Structure

### New files to create
```
games/narrative/
  archaeology.html              # P1 — Canvas excavation game (Priority 1)
  culture-tower.html            # P9 — CSS stacking quiz (Priority 1)
  city-builder.html             # P3 — CSS/HTML isometric city (Priority 2)
  samvydav.html                 # P7 — Turn-based stealth game (Priority 2)
  samvydav-data.json            # P7 — Document/contact data for Samvydav
  radio-svoboda.html            # P7 — Quiz-show broadcaster (Priority 4)
  timeline-soviet.html          # P7 — Wrapper for Soviet timeline with socialist CSS
  diplomat.html                 # P3 — Branching text adventure (Priority 5)
  culture-gallery.html          # P9 — Gallery drag-and-drop quiz (Priority 5)

data/timeline/
  period-1-starodavnia.js       # Ancient Ukraine timeline
  period-3-vkl.js               # GDL timeline
  period-7-radianskyi.js        # Soviet timeline (socialist styling)
  period-9-kultura.js           # Culture across eras

data/falling/
  period-3-vkl.js               # Rewrite of period-3-lytva.js (wrong content)
  period-9-kultura.js           # Culture quiz

data/games/
  archaeology/                  # Artifact images (user-provided)
  city-builder/                 # Building photos (user-provided)
  culture-gallery/              # Artwork images (user-provided)
  culture-timeline/             # Timeline event images (user-provided)
```

### Files to modify
```
index.html                      # Add game links to P1, P3, P7 cards + collapsible P9
data/falling/period-3-lytva.js  # DELETE (replaced by period-3-vkl.js with correct content)
docs/guide.html                 # Add Period 9 + new games to player guide
docs/GUIDE.md                   # Same updates in markdown
```

### Shared utility: asset validator
```
shared/js/asset-validator.js    # Reusable image validation (red square fallback)
```

---

## Chunk 1: Foundation + Priority 1 Data Files

### Task 1: Asset validator utility

**Files:**
- Create: `shared/js/asset-validator.js`

- [ ] **Step 1: Create asset-validator.js**

```javascript
/* asset-validator.js — Validates image assets, shows red square for missing.
 * Usage: AssetValidator.createImg(src, alt, container)
 * Returns an <img> element; on error shows a red placeholder with the expected filename.
 */
(function () {
  'use strict';

  function createImg(src, alt, opts) {
    opts = opts || {};
    var img = document.createElement('img');
    img.alt = alt || '';
    if (opts.className) img.className = opts.className;
    if (opts.style) img.style.cssText = opts.style;
    img.addEventListener('error', function () {
      // Replace with red square showing expected filename
      var placeholder = document.createElement('div');
      placeholder.style.cssText = 'background:#e00;color:#fff;display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);padding:var(--space-xs);text-align:center;word-break:break-all;' + (opts.style || '');
      if (opts.className) placeholder.className = opts.className;
      placeholder.style.width = opts.width || '100px';
      placeholder.style.height = opts.height || '100px';
      var fname = src.split('/').pop();
      placeholder.textContent = fname;
      if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img);
      }
    });
    img.src = src;
    return img;
  }

  window.AssetValidator = {
    createImg: createImg
  };
})();
```

- [ ] **Step 2: Commit**

```bash
git add shared/js/asset-validator.js
git commit -m "feat: add asset validator utility (red square fallback for missing images)"
```

### Task 2: Timeline data — Period 1 (Стародавня історія)

**Files:**
- Create: `data/timeline/period-1-starodavnia.js`

- [ ] **Step 1: Create timeline data file**

```javascript
/* Timeline data: Period 1 — Стародавня історія */
window.TIMELINE_DATA = {
  title: 'Хронологія: стародавня Україна',
  section: 'Стародавня історія',
  rounds: [
    {
      name: 'Від Трипілля до античності',
      events: [
        { text: 'Розквіт трипільської культури', year: 'бл. 5500–2750 до н.е.', detail: 'Трипільська культура — одна з найрозвиненіших енеолітичних культур Європи. Відома керамікою, двоповерховими будинками та протомістами площею до 450 га.' },
        { text: 'Поява кімерійців у Північному Причорномор\'ї', year: 'бл. X ст. до н.е.', detail: 'Кімерійці — перший відомий з писемних джерел народ на території України. Згадуються в ассирійських хроніках та "Одіссеї" Гомера.' },
        { text: 'Заснування перших грецьких колоній', year: 'VII ст. до н.е.', detail: 'Грецькі поліси — Ольвія, Тіра, Херсонес, Пантікапей — стали центрами торгівлі та культурного обміну з місцевими племенами.' },
        { text: 'Розквіт Скіфського царства', year: 'V–IV ст. до н.е.', detail: 'Скіфське царство досягло найбільшої могутності за царя Атея. Скіфи відомі курганними похованнями та золотими прикрасами (пектораль).' },
        { text: 'Сарматське вторгнення', year: 'III ст. до н.е.', detail: 'Сармати — іраномовні кочівники — поступово витіснили скіфів з Північного Причорномор\'я.' },
        { text: 'Утворення Боспорського царства', year: 'V ст. до н.е.', detail: 'Боспорське царство об\'єднало грецькі колонії Керченського та Таманського півостровів. Проіснувало до IV ст. н.е.' }
      ]
    },
    {
      name: 'Від готів до ранніх слов\'ян',
      events: [
        { text: 'Черняхівська культура', year: 'II–V ст. н.е.', detail: 'Поліетнічна археологічна культура на території України, пов\'язана з готами та слов\'янами. Відома гончарним виробництвом та залізообробкою.' },
        { text: 'Гунська навала', year: '375 р.', detail: 'Гуни під проводом Баламбера розгромили готське королівство Германаріха, що призвело до Великого переселення народів.' },
        { text: 'Розселення слов\'ян на території України', year: 'V–VI ст.', detail: 'Слов\'янські племена (анти, склавіни) заселяють Правобережжя та Лівобережжя Дніпра, створюючи протодержавні утворення.' },
        { text: 'Антський союз племен', year: 'IV–VII ст.', detail: 'Анти — східнослов\'янське об\'єднання племен між Дністром і Дніпром, які чинили опір аварам та візантійцям.' },
        { text: 'Аварське панування', year: 'VI–VII ст.', detail: 'Авари (обри) підкорили частину слов\'ян. За літописом, "примучували дулібів". Аварський каганат занепав у VIII ст.' },
        { text: 'Початки формування Київської держави', year: 'VIII–IX ст.', detail: 'Об\'єднання полян навколо Києва поклало початок формуванню ранньосередньовічної держави — Київської Русі.' }
      ]
    }
  ]
};
```

- [ ] **Step 2: Commit**

```bash
git add data/timeline/period-1-starodavnia.js
git commit -m "feat: add Period 1 timeline data (ancient Ukraine, 2 rounds × 6 events)"
```

### Task 3: Timeline data — Period 7 (Радянський період) with socialist styling

**Files:**
- Create: `data/timeline/period-7-radianskyi.js`

Since timeline-engine.js doesn't support a `theme` config property, the socialist styling will be applied via a wrapper page created in a later task. This task creates only the data file.

- [ ] **Step 1: Create timeline data file**

```javascript
/* Timeline data: Period 7 — Радянський період */
window.TIMELINE_DATA = {
  title: 'Хронологія: радянський період',
  section: 'Радянський період',
  rounds: [
    {
      name: 'Від окупації до відлиги',
      events: [
        { text: 'Встановлення радянської влади в Україні', year: '1919–1920', detail: 'Після поразки УНР та Директорії більшовики встановили контроль над більшістю території України. Утворено УСРР, яка в 1922 р. увійшла до складу СРСР.' },
        { text: 'Голодомор', year: '1932–1933', detail: 'Штучно організований голод в Україні, що забрав життя мільйонів людей. Став наслідком примусової колективізації та вилучення зерна. Визнаний геноцидом українського народу.' },
        { text: 'Початок Другої світової війни для України', year: '1941', detail: '22 червня 1941 р. нацистська Німеччина напала на СРСР. Україна стала одним з головних театрів бойових дій. За роки війни загинули мільйони українців.' },
        { text: 'Визволення Києва', year: '6 листопада 1943', detail: 'Київська наступальна операція завершилася звільненням столиці від нацистської окупації. Війська 1-го Українського фронту форсували Дніпро.' },
        { text: 'Повоєнна русифікація', year: '1946–1953', detail: 'Після війни сталінський режим посилив русифікацію: закривалися українські школи, переслідувалися діячі культури, ліквідовано УГКЦ (Львівський псевдособор 1946 р.).' },
        { text: 'Хрущовська відлига', year: '1956–1964', detail: 'Після смерті Сталіна та XX з\'їзду КПРС настала часткова лібералізація. В Україні відновлено реабілітацію репресованих, з\'явилися нові літературні журнали.' }
      ]
    },
    {
      name: 'Від шістдесятників до суверенітету',
      events: [
        { text: 'Рух шістдесятників', year: '1960-ті', detail: 'Покоління молодих українських письменників, поетів та митців (Стус, Симоненко, Ліна Костенко, Драч) виступили за національне відродження та проти русифікації.' },
        { text: 'Усунення Шелеста, ера Щербицького', year: '1972', detail: 'Першого секретаря КПУ Петра Шелеста усунено за "м\'якість" до українського націоналізму. Його наступник Щербицький посилив репресії проти дисидентів.' },
        { text: 'Заснування Української Гельсінської групи', year: '9 листопада 1976', detail: 'Микола Руденко, Олесь Бердник, Петро Григоренко та інші заснували правозахисну групу для моніторингу дотримання Гельсінських угод. Більшість членів були ув\'язнені.' },
        { text: 'Чорнобильська катастрофа', year: '26 квітня 1986', detail: 'Вибух на 4-му енергоблоці Чорнобильської АЕС — найбільша ядерна аварія в історії. Радіоактивне забруднення охопило значну частину України, Білорусі та Європи. Евакуйовано м. Прип\'ять.' },
        { text: 'Заснування Народного Руху України', year: '8–10 вересня 1989', detail: 'Установчий з\'їзд НРУ в Києві. Рух став головною силою демократичного та національно-визвольного руху. Першим головою обрано Івана Драча.' },
        { text: 'Декларація про державний суверенітет', year: '16 липня 1990', detail: 'Верховна Рада УРСР прийняла Декларацію про державний суверенітет, яка проголосила верховенство Конституції та законів УРСР на її території.' }
      ]
    }
  ]
};
```

- [ ] **Step 2: Commit**

```bash
git add data/timeline/period-7-radianskyi.js
git commit -m "feat: add Period 7 timeline data (Soviet era, 2 rounds × 6 events)"
```

### Task 4: Timeline data — Period 3 (ВКЛ) + Falling data rewrite

**Files:**
- Create: `data/timeline/period-3-vkl.js`
- Create: `data/falling/period-3-vkl.js` (replaces `period-3-lytva.js` which has wrong content)
- Delete: `data/falling/period-3-lytva.js`

- [ ] **Step 1: Create VKL timeline data**

```javascript
/* Timeline data: Period 3 — Велике князівство Литовське */
window.TIMELINE_DATA = {
  title: 'Хронологія: Велике князівство Литовське',
  section: 'Велике князівство Литовське',
  rounds: [
    {
      name: 'Від Синіх Вод до Острозької академії',
      events: [
        { text: 'Битва на Синіх Водах', year: '1362', detail: 'Перемога литовського князя Ольгерда над монголо-татарами. Українські землі перейшли під владу Великого князівства Литовського.' },
        { text: 'Кревська унія', year: '1385', detail: 'Угода між Литвою та Польщею: великий князь Ягайло одружився з польською королевою Ядвігою та став королем Польщі. Початок зближення двох держав.' },
        { text: 'Городельська унія', year: '1413', detail: 'Підтвердила союз Литви з Польщею. Литовська шляхта католицького віросповідання отримала права, рівні з польською.' },
        { text: 'Надання магдебурзького права Києву', year: '1494–1497', detail: 'Київ отримав магдебурзьке право — систему міського самоврядування за німецьким зразком, що сприяло розвитку торгівлі та ремесел.' },
        { text: 'Заснування Острозької академії', year: '1576', detail: 'Князь Василь-Костянтин Острозький заснував перший вищий навчальний заклад східнослов\'янського світу. Тут створено Острозьку Біблію (1581).' },
        { text: 'Вітовт — найбільша могутність ВКЛ', year: '1392–1430', detail: 'За князя Вітовта Велике князівство Литовське досягло найбільшої території та впливу. Київ, Поділля, Волинь перебували під його владою.' }
      ]
    },
    {
      name: 'Від Люблінської унії до Хмельниччини',
      events: [
        { text: 'Привілей Казимира', year: '1447', detail: 'Привілей великого князя Казимира IV підтвердив права литовсько-руської шляхти та заборонив садити людей на чужій землі — початок закріпачення селян.' },
        { text: 'Люблінська унія', year: '1569', detail: 'Об\'єднання Великого князівства Литовського та Королівства Польського в Річ Посполиту. Українські землі (Волинь, Поділля, Київщина) перейшли під пряму владу Польщі.' },
        { text: 'Берестейська церковна унія', year: '1596', detail: 'Частина православних єпископів прийняла зверхність Папи Римського, зберігаючи візантійський обряд. Утворено Греко-католицьку церкву.' },
        { text: 'Утворення Запорозької Січі', year: 'середина XVI ст.', detail: 'Козаки-запорожці створили військово-політичну організацію на острові Хортиця та за порогами Дніпра. Січ стала центром козацького руху.' },
        { text: 'Хмельниччина — Національно-визвольна війна', year: '1648', detail: 'Повстання під проводом гетьмана Богдана Хмельницького проти Речі Посполитої. Створення козацької держави — Війська Запорозького.' },
        { text: 'Пересопницьке Євангеліє', year: '1556–1561', detail: 'Рукописний переклад Євангелія тогочасною українською мовою, створений у Пересопницькому монастирі. На ньому присягають президенти України.' }
      ]
    }
  ]
};
```

- [ ] **Step 2: Create VKL falling data (correct content replacing period-3-lytva.js)**

```javascript
/* Falling-answer data: Period 3 — Велике князівство Литовське */
window.FALLING_DATA = {
  title: 'Історична вікторина: Литовська доба',
  section: 'Велике князівство Литовське',
  winScore: 15,
  lives: 3,
  dropSpeed: 1,
  addInterval: 5000,
  maxActive: 5,
  winImage: '../../assets/images/Kyiv.jpg',
  questions: [
    { question: 'Битва на Синіх Водах (рік)', answer: '1362' },
    { question: 'Кревська унія між Литвою та Польщею (рік)', answer: '1385' },
    { question: 'Городельська унія (рік)', answer: '1413' },
    { question: 'Люблінська унія — об\'єднання в Річ Посполиту (рік)', answer: '1569' },
    { question: 'Берестейська церковна унія (рік)', answer: '1596' },
    { question: 'Заснування Острозької академії (рік)', answer: '1576' },
    { question: 'Надання Києву магдебурзького права (рік)', answer: '1494' },
    { question: 'Привілей Казимира IV (рік)', answer: '1447' },
    { question: 'Початок Хмельниччини (рік)', answer: '1648' },
    { question: 'Острозька Біблія — перше повне видання Біблії церковнослов\'янською (рік)', answer: '1581' },
    { question: 'Пересопницьке Євангеліє — пам\'ятка українського письменства (рік)', answer: '1561' },
    { question: 'Гадяцький договір між козаками та Польщею (рік)', answer: '1658' }
  ]
};
```

- [ ] **Step 3: Delete old file and commit**

```bash
git rm data/falling/period-3-lytva.js
git add data/timeline/period-3-vkl.js data/falling/period-3-vkl.js
git commit -m "feat: add Period 3 VKL timeline + rewrite falling quiz (old file had wrong content)"
```

### Task 5: Timeline + Falling data — Period 9 (Культура)

**Files:**
- Create: `data/timeline/period-9-kultura.js`
- Create: `data/falling/period-9-kultura.js`

**Note on images:** Spec allows optional event images, but timeline-engine.js doesn't support image properties. Using text-only with rich `detail` descriptions for v1. Asset directory `data/games/culture-timeline/` is created (Task 6) for future use.

- [ ] **Step 1: Create culture timeline data**

```javascript
/* Timeline data: Period 9 — Українська культура крізь віки */
window.TIMELINE_DATA = {
  title: 'Хронологія: українська культура',
  section: 'Українська культура',
  rounds: [
    {
      name: 'Від Трипілля до Кобзаря',
      events: [
        { text: 'Трипільська кераміка — найдавніше мистецтво', year: 'бл. 5000 до н.е.', detail: 'Трипільці створювали розписну кераміку зі складними орнаментами — спіралі, меандри, зображення тварин. Це найдавніший зразок декоративного мистецтва на території України.' },
        { text: 'Мозаїки Софії Київської', year: 'XI ст.', detail: 'Мозаїки та фрески Софійського собору в Києві — шедеври візантійського мистецтва. Зображення Богоматері Оранти (6 м заввишки) називають "Нерушимою Стіною".' },
        { text: 'Острозька Біблія', year: '1581', detail: 'Перше повне видання Біблії церковнослов\'янською мовою, надруковане Іваном Федоровим в Острозі. Пам\'ятка українського книгодрукування.' },
        { text: 'Козацьке бароко', year: 'XVII–XVIII ст.', detail: 'Унікальний український архітектурний стиль: Андріївська церква (Растреллі), собори Мгарського монастиря, Софійська дзвіниця. Поєднання європейського бароко з місцевими традиціями.' },
        { text: '«Енеїда» Котляревського', year: '1798', detail: 'Перший літературний твір, написаний живою українською мовою. Іван Котляревський переробив Вергілієву "Енеїду" в козацькому дусі. Початок нової української літератури.' },
        { text: '«Кобзар» Тараса Шевченка', year: '1840', detail: 'Перша збірка поезій Тараса Шевченка стала символом українського національного відродження. Шевченко — найвидатніший поет і художник України.' }
      ]
    },
    {
      name: 'Від Лисенка до сучасності',
      events: [
        { text: 'Опери Миколи Лисенка', year: '1889–1903', detail: 'Микола Лисенко — основоположник української класичної музики. Його опери "Наталка Полтавка", "Тарас Бульба" заклали основи національної музичної школи.' },
        { text: 'Літературна спадщина Івана Франка', year: '1876–1916', detail: 'Іван Франко — поет, прозаїк, учений, громадський діяч. Автор "Каменярів", "Мойсея", "Захар Беркут". Другий після Шевченка у пантеоні української культури.' },
        { text: 'Кіно Олександра Довженка', year: '1928–1935', detail: 'Довженко створив поетичне кіно світового рівня: "Звенигора" (1928), "Арсенал" (1929), "Земля" (1930). Вважається одним із найвидатніших режисерів в історії кінематографа.' },
        { text: 'Поезія шістдесятників', year: '1960-ті', detail: 'Василь Стус, Василь Симоненко, Ліна Костенко, Іван Драч — покоління поетів, які відстоювали українську культуру в умовах радянської русифікації.' },
        { text: 'Чорнобильська література', year: '1986–2000', detail: 'Катастрофа породила нову хвилю літератури: щоденники ліквідаторів, романи Юрія Щербака, Ліни Костенко ("Чорнобильська мадонна"), документальна проза.' },
        { text: 'Сучасне українське відродження', year: '2014–сьогодні', detail: 'Нова хвиля інтересу до української культури: Жадан, Андрухович, Забужко у літературі; театр "ДАХ"; мурали Києва; українська музика на світовій сцені.' }
      ]
    }
  ]
};
```

- [ ] **Step 2: Create culture falling data**

```javascript
/* Falling-answer data: Period 9 — Українська культура крізь віки */
window.FALLING_DATA = {
  title: 'Вікторина: українська культура',
  section: 'Українська культура',
  winScore: 15,
  lives: 3,
  dropSpeed: 1,
  addInterval: 5000,
  maxActive: 5,
  winImage: '../../assets/images/Kyiv.jpg',
  questions: [
    { question: 'Рік видання «Кобзаря» Тараса Шевченка', answer: '1840' },
    { question: 'Рік видання «Енеїди» Котляревського', answer: '1798' },
    { question: 'Острозька Біблія — перше повне видання Біблії (рік)', answer: '1581' },
    { question: 'Рік створення фільму «Земля» Довженка', answer: '1930' },
    { question: 'Століття розквіту козацького бароко', answer: '17' },
    { question: 'Рік першої опери Лисенка «Наталка Полтавка»', answer: '1889' },
    { question: 'Рік народження Тараса Шевченка', answer: '1814' },
    { question: 'Пересопницьке Євангеліє — українське письменство (рік)', answer: '1561' },
    { question: 'Софійський собор у Києві закладено (рік)', answer: '1037' },
    { question: 'Рік народження Івана Франка', answer: '1856' },
    { question: 'Рік створення фільму «Тіні забутих предків» Параджанова', answer: '1965' },
    { question: 'Рік заснування театру «Березіль» Лесем Курбасом', answer: '1922' }
  ]
};
```

- [ ] **Step 3: Commit**

```bash
git add data/timeline/period-9-kultura.js data/falling/period-9-kultura.js
git commit -m "feat: add Period 9 culture timeline + falling quiz data"
```

### Task 6: Create asset directories with README placeholders

- [ ] **Step 1: Create directories and placeholder READMEs**

Create `data/games/archaeology/README.md`:
```
# Archaeology Assets

Place artifact images here with naming: {CULTURE}_{type}_{n}.{ext}

Culture codes: TRPL (Trypillia), SKIF (Scythian), GREK (Greek), KAMN (Stone Age)
STL variants: add _stl suffix (e.g., TRPL_pot_1_stl.jpg)

Supported formats: .jpg, .png, .gif
```

Create `data/games/city-builder/README.md`:
```
# City Builder Assets

Required building photos (NMT course):
- RATH_1.jpg — Ратуша
- TSER_1.jpg — Церква
- SHKO_1.jpg — Школа
- FORT_1.jpg — Фортеця
```

Create `data/games/culture-gallery/README.md`:
```
# Culture Gallery Assets

Place artwork/architecture images here.
Naming: GAL_{era}_{n}.jpg
Era codes: TRPL, KYIV, BARO, ROMA, MDRN
Examples: GAL_TRPL_1.jpg, GAL_BARO_1.jpg
```

Create `data/games/culture-timeline/README.md`:
```
# Culture Timeline Assets

Optional event images for timeline cards.
Naming: TL9_{event-slug}.jpg
Examples: TL9_trypillia-pottery.jpg, TL9_kobzar.jpg
```

- [ ] **Step 2: Commit**

```bash
git add data/games/
git commit -m "feat: create asset directories with README placeholders for user-provided images"
```

---

## Chunk 2: Priority 1 Games — Вежа культури + Археологічні розкопки

### Task 7: Вежа культури (culture-tower.html) — Priority 1

**Files:**
- Create: `games/narrative/culture-tower.html`

This is a CSS-only stacking game (no canvas). 15 levels of cultural achievement questions, tower grows with correct answers. Full implementation in one file following kafe-simulator.html patterns.

- [ ] **Step 1: Create culture-tower.html**

Single-file game with:
- `<body data-section="Українська культура" data-game-title="Вежа культури" data-home-url="../../index.html">`
- Intro screen → game screen → victory screen
- Tower: CSS stack of blocks (`position: relative`, blocks stacked via `flex-direction: column-reverse`)
- Each level: question (4 options), correct → solid block added, wrong → cracked block + wobble animation
- 15 levels from ancient to modern
- Pyramid visual: blocks shrink from `100%` width (base) to `40%` (top)
- Score tracking: solid blocks vs cracked blocks
- All question data inline (no external JSON)
- `body.theme-light` overrides for dark block colors
- `.high-contrast` border overrides
- Analytics integration: `startSession('culture-tower')` on start, `endSession` on win/lose
- Scripts: nav.js, analytics.js, accessibility.js

**Questions (15 levels, bottom to top):**
1. Трипільська кераміка (бл. 5000 до н.е.)
2. Скіфська пектораль (IV ст. до н.е.)
3. Мозаїки Софії Київської (XI ст.)
4. «Слово о полку Ігоревім» (1187)
5. Острозька Біблія (1581)
6. Козацьке бароко (XVII ст.)
7. «Енеїда» Котляревського (1798)
8. «Кобзар» Шевченка (1840)
9. Опери Лисенка (1889)
10. Література Франка (1898)
11. Кіно Довженка (1930)
12. «Тіні забутих предків» Параджанова (1965)
13. Поезія Стуса (1970-ті)
14. Чорнобильська мадонна Костенко (1987)
15. Сучасне відродження (2014+)

- [ ] **Step 2: Test locally**

Open `games/narrative/culture-tower.html` in browser. Verify:
- Intro screen shows, start button works
- Questions appear, 4 options each
- Correct → block solid, wrong → block cracked with wobble
- Tower grows visually
- After 15 levels → victory screen
- Accessibility gear button present, theme/font/motion/contrast all work
- Analytics: `localStorage.getItem('histgame_analytics')` shows culture-tower record

- [ ] **Step 3: Commit**

```bash
git add games/narrative/culture-tower.html
git commit -m "feat: add Culture Tower game (Period 9, 15-level stacking quiz)"
```

### Task 8: Археологічні розкопки (archaeology.html) — Priority 1

**Files:**
- Create: `games/narrative/archaeology.html`

Canvas-based excavation game. Largest single game in this expansion.

- [ ] **Step 1: Create archaeology.html**

Single-file game with:
- `<body data-section="Стародавня історія" data-game-title="Археологічні розкопки" data-home-url="../../index.html" data-nav="overlay">`
- Canvas grid (6×4 = 24 cells)
- Cell states: covered (soil), dug (empty or artifact)
- Artifact data inline: ~12 artifacts with culture, type, name, description
- Dual controls: drag artifact to bin OR select artifact then click culture button
- 4 culture bins: Трипілля, Скіфи, Грецькі колонії, Кам'яний вік
- Artifact images loaded via `AssetValidator.createImg()` from `data/games/archaeology/`
- Toggle button for normal vs STL display mode
- Asset naming: `{TRPL|SKIF|GREK|KAMN}_{type}_{n}.{jpg|gif}`, STL: `*_stl.jpg`
- Missing images → red square with filename
- Score: correct classifications / total artifacts
- 3 lives, educational popup on each classification
- `body.theme-light` overrides
- `.high-contrast` overrides
- Canvas `ctx.font` uses hardcoded px values
- Analytics integration

- [ ] **Step 2: Test locally**

Verify:
- Grid renders, clicking cells "digs"
- Artifacts appear (or red squares if images missing)
- Both drag-and-drop AND button controls work
- Score/lives update correctly
- STL toggle switches images
- Accessibility panel works
- Analytics records session

- [ ] **Step 3: Commit**

```bash
git add games/narrative/archaeology.html
git commit -m "feat: add Archaeology excavation game (Period 1, canvas grid with dual controls)"
```

---

## Chunk 3: Priority 2 Games — Будівник міста + Самвидав

### Task 9: Будівник міста (city-builder.html) — Priority 2

**Files:**
- Create: `games/narrative/city-builder.html`

- [ ] **Step 1: Create city-builder.html**

CSS/HTML isometric city builder:
- `<body data-section="ВКЛ" data-game-title="Будівник міста" data-home-url="../../index.html">`
- 5×5 grid of positioned divs (isometric perspective via CSS `transform: rotateX(45deg) rotateZ(45deg)` or simplified 2D grid)
- 8 buildings: Ратуша, Ринок, Церква, Цех ковалів, Школа, Фортеця, Шпиталь, Друкарня
- Buildings with photos (RATH, TSER, SHKO, FORT) use `AssetValidator.createImg()` from `data/games/city-builder/`
- Other buildings use CSS/SVG icons
- Each building: click empty cell → question modal (4 options) → correct builds, wrong delays
- Historical questions about VKL period for each building
- Score: buildings on first try / total
- `body.theme-light`, `.high-contrast` overrides
- Analytics integration

- [ ] **Step 2: Test locally**

Open `games/narrative/city-builder.html` in browser. Verify:
- 5×5 grid renders, empty cells clickable
- Clicking cell opens question modal with 4 options
- Correct answer → building appears (photo for RATH/TSER/SHKO/FORT, CSS icon for others)
- Missing photos → red square with expected filename
- Wrong answer → "Будівництво затримано" message, retry available
- After 8 buildings → victory screen
- Accessibility gear button present, theme/font/contrast all work
- Analytics: `localStorage.getItem('histgame_analytics')` shows city-builder record

- [ ] **Step 3: Commit**

```bash
git add games/narrative/city-builder.html
git commit -m "feat: add City Builder game (Period 3, isometric grid with VKL questions)"
```

### Task 10: Самвидав (samvydav.html) — Priority 2

**Files:**
- Create: `games/narrative/samvydav.html`
- Create: `games/narrative/samvydav-data.json`

- [ ] **Step 1: Create samvydav-data.json**

```json
{
  "documents": [
    { "id": "stus-palimpsesty", "title": "«Палімпсести» Василя Стуса", "author": "Василь Стус", "year": 1971, "detail": "Збірка віршів, написаних у таборах. Стус — один із найвидатніших українських поетів ХХ ст., загинув у таборі Кучино в 1985 р." },
    { "id": "chornovil-lykho", "title": "«Лихо з розуму» В'ячеслава Чорновола", "author": "В'ячеслав Чорновіл", "year": 1967, "detail": "Збірка документів про порушення законності при арештах інтелігенції. Чорновіл став одним із лідерів правозахисного руху." },
    { "id": "dziuba-internatsionalizm", "title": "«Інтернаціоналізм чи русифікація?» Івана Дзюби", "author": "Іван Дзюба", "year": 1965, "detail": "Фундаментальне дослідження русифікації в Україні. Адресовано керівництву КПУ, розповсюджувалося самвидавом." },
    { "id": "ukrainskyi-visnyk", "title": "«Український вісник» (підпільний журнал)", "author": "Редколегія", "year": 1970, "detail": "Самвидавний журнал, заснований Чорноволом. Публікував матеріали про порушення прав людини, українську культуру." },
    { "id": "symonenko-bereh", "title": "«Берег чекань» Василя Симоненка", "author": "Василь Симоненко", "year": 1965, "detail": "Поетична збірка, видана посмертно. Симоненко помер у 28 років. Його рядок «Україно, ти моя молитва» став крилатим." },
    { "id": "svitlychny-hratka", "title": "Вірші Івана Світличного", "author": "Іван Світличний", "year": 1973, "detail": "Літературознавець, поет, неформальний лідер шістдесятників. Засуджений до 7 років таборів за «антирадянську агітацію»." }
  ],
  "contacts": [
    { "id": "student", "name": "Олег (студент КДУ)", "risk": 15, "detail": "Студенти університету — основна аудиторія самвидаву. Ризик середній: куратори факультетів стежать." },
    { "id": "worker", "name": "Ганна (працівниця заводу)", "risk": 10, "detail": "Робітники менш контрольовані, але менш зацікавлені. Низький ризик, низька ефективність розповсюдження." },
    { "id": "intellectual", "name": "Професор Іваненко", "risk": 20, "detail": "Інтелігенція — під постійним наглядом КДБ. Високий ризик, але найефективніше розповсюдження." },
    { "id": "clergy", "name": "Отець Андрій (УГКЦ)", "risk": 25, "detail": "Греко-католицька церква заборонена з 1946 р. Контакт із підпільним священиком — найнебезпечніший, але церква має мережу довіри." },
    { "id": "journalist", "name": "Маркус (кореспондент Reuters)", "risk": 30, "detail": "Іноземні журналісти можуть передати інформацію на Захід. Найвищий ризик (КДБ стежить за всіма іноземцями), але максимальний ефект." }
  ]
}
```

- [ ] **Step 2: Create samvydav.html**

Turn-based stealth game:
- `<body data-section="Радянський період" data-game-title="Самвидав" data-home-url="../../index.html" data-nav="overlay">`
- Load data from `samvydav-data.json` via fetch (with `file://` fallback: inline data copy)
- Dark atmospheric UI (night theme): dark green/brown, typewriter font feel
- `body.theme-light` overrides (lighter parchment colors)
- Turn-based: 3 actions per turn (Print, Distribute, Hide)
- Suspicion meter (0–100) as progress bar
- Handle name deduplication: Chornovil appears as both author and is referenced in contacts — show different role context
- Score: documents distributed + contacts reached
- Analytics integration

- [ ] **Step 3: Test and commit**

```bash
git add games/narrative/samvydav.html games/narrative/samvydav-data.json
git commit -m "feat: add Samvydav stealth game (Period 7, turn-based dissident literature distribution)"
```

---

## Chunk 4: Priority 3-4 Games + index.html Integration

### Task 11: Soviet timeline wrapper with socialist styling

**Files:**
- Create: `games/narrative/timeline-soviet.html`

Since timeline-engine.js doesn't support theme config, create a thin wrapper page that loads the data and applies socialist-style CSS overrides.

- [ ] **Step 1: Create wrapper page**

Full standalone HTML page that duplicates the timeline-sort.html template markup but adds socialist-style CSS overrides. Structure:

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Хронологія: радянський період</title>
  <link rel="stylesheet" href="../../shared/css/reset.css">
  <link rel="stylesheet" href="../../shared/css/theme.css">
  <link rel="stylesheet" href="../../shared/css/layout.css">
  <link rel="stylesheet" href="../../shared/css/components.css">
  <link rel="stylesheet" href="../../shared/css/animations.css">
  <link rel="stylesheet" href="../../shared/css/responsive.css">
  <style>
    :root { --game-accent: #c41e3a; }
    body { background: linear-gradient(135deg, #1a0a0a 0%, #2a1010 100%); }
    .section-title, h1 { color: #c41e3a; font-family: Georgia, serif; }
    .event-card { border-left: 3px solid #c41e3a; }
    .event-card::before { content: '★'; color: #d4a017; margin-right: var(--space-xs); }
    .btn-primary { background: #c41e3a; }
    body.theme-light { background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%); }
    body.theme-light .section-title { color: #8b0000; }
  </style>
</head>
<body data-section="Радянський період" data-game-title="Хронологія" data-home-url="../../index.html">
  <!-- Same markup as timeline-sort.html template -->
  <script src="../../data/timeline/period-7-radianskyi.js"></script>
  <script src="../../shared/js/timeline-engine.js"></script>
  <script>/* Same init script as timeline-sort.html */</script>
  <script src="../../shared/js/nav.js"></script>
  <script src="../../shared/js/analytics.js"></script>
  <script src="../../shared/js/accessibility.js"></script>
</body>
</html>
```

Copy the full `<body>` markup from `shared/templates/timeline-sort.html` (event list, buttons, score display), but load `period-7-radianskyi.js` directly instead of using `?id=` query param.

- [ ] **Step 2: Commit**

```bash
git add games/narrative/timeline-soviet.html
git commit -m "feat: add Soviet timeline wrapper with socialist realism CSS styling"
```

### Task 12: Радіо Свобода (radio-svoboda.html) — Priority 4

**Files:**
- Create: `games/narrative/radio-svoboda.html`

- [ ] **Step 1: Create radio-svoboda.html**

Quiz-show format:
- `<body data-section="Радянський період" data-game-title="Радіо Свобода" data-home-url="../../index.html" data-nav="overlay">`
- Radio studio aesthetic: frequency meter, signal strength bar, vintage radio console
- 4 rounds × 3-4 questions each (Holodomor, WWII, Sixtiers, Chornobyl)
- News snippet → caller question (4 options) → correct keeps signal, wrong → "jammed"
- 3 lives (signal strength)
- CSS-styled radio elements (no images needed)
- `body.theme-light`, `.high-contrast` overrides
- Analytics integration

- [ ] **Step 2: Test and commit**

```bash
git add games/narrative/radio-svoboda.html
git commit -m "feat: add Radio Svoboda quiz-show game (Period 7, broadcaster format)"
```

### Task 13: index.html integration

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add game links to existing period cards**

Period 1 card: add `Археологічні розкопки` + `Хронологія` buttons
Period 3 card: add `Будівник міста` + `Дипломат` + `Хронологія` (timeline-sort.html?id=period-3-vkl) + `Вікторина` (falling-answer.html?id=period-3-vkl — uses new ID, not old period-3-lytva)
Period 7 card: add `Самвидав` + `Радіо Свобода` + `Хронологія` buttons

- [ ] **Step 2: Add collapsible Period 9 section**

After Period 8 card, before β section:
- Button "Відкрити: Українська культура крізь віки"
- Hidden card with 4 game links (gallery, tower, falling, timeline)
- On click → card reveals, button hides

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add new game links to index.html + collapsible Period 9 section"
```

---

## Chunk 5: Priority 5 Games + Documentation

### Task 14: Дипломат (diplomat.html) — Priority 5

**Files:**
- Create: `games/narrative/diplomat.html`

- [ ] **Step 1: Create diplomat.html**

Text adventure with 8 branching nodes:
- `<body data-section="ВКЛ" data-game-title="Дипломат" data-home-url="../../index.html">`
- Standard nav bar (text-based game)
- Each node: scenario text + 2-3 choices
- Historical path highlighted after each choice
- Diplomatic reputation score (0-100)
- Final summary screen
- All data inline (no external JSON)
- Analytics integration

- [ ] **Step 2: Commit**

```bash
git add games/narrative/diplomat.html
git commit -m "feat: add Diplomat text adventure (Period 3, 8-node branching story)"
```

### Task 15: Культурна галерея (culture-gallery.html) — Priority 5

**Files:**
- Create: `games/narrative/culture-gallery.html`

- [ ] **Step 1: Create culture-gallery.html**

Gallery carousel quiz:
- `<body data-section="Українська культура" data-game-title="Культурна галерея" data-home-url="../../index.html">`
- Carousel showing one artwork at a time
- Drag-and-drop era labels + author labels
- 12 items spanning all periods
- Images from `data/games/culture-gallery/` via AssetValidator
- Music references optional
- Analytics integration

- [ ] **Step 2: Commit**

```bash
git add games/narrative/culture-gallery.html
git commit -m "feat: add Culture Gallery quiz (Period 9, artwork identification carousel)"
```

### Task 16: Documentation updates

**Files:**
- Modify: `docs/guide.html`
- Modify: `docs/GUIDE.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add Period 9 + new games to guide.html and GUIDE.md**

Add Period 9 section with 4 game descriptions. Add new game descriptions to Periods 1, 3, 7.

- [ ] **Step 2: Update CLAUDE.md directory structure**

Add `asset-validator.js` to JS listing. Note Period 9 in architecture section.

- [ ] **Step 3: Commit**

```bash
git add docs/guide.html docs/GUIDE.md CLAUDE.md
git commit -m "docs: add Period 9 and new games to guides + CLAUDE.md"
```

### Task 17: Final verification

- [ ] **Step 1: Run accessibility test across all new pages**

Use the Playwright test script pattern from earlier sessions to verify all 7 new HTML files pass:
- Gear button present
- Font scaling (A/A+/A++)
- Light theme toggle
- High contrast toggle
- Reduced motion
- No hardcoded px font-size in inline styles

- [ ] **Step 2: Verify analytics tracking**

Navigate to each new game, interact minimally, navigate away. Check `localStorage.getItem('histgame_analytics')` for all new module IDs.

- [ ] **Step 3: Verify file:// protocol**

Open index.html via `file://` protocol. Verify all links work, no CORS errors for inline data.

- [ ] **Step 4: Verify Period 9 collapsible section**

On index.html: Period 9 is hidden by default, button click reveals it.

- [ ] **Step 5: Commit and push**

```bash
git add docs/guide.html docs/GUIDE.md
git commit -m "test: verify all new games pass accessibility + analytics + offline checks"
git push origin main
```
