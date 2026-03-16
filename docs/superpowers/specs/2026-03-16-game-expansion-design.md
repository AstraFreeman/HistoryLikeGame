# Game Expansion: Periods 1, 3, 7 + New Period 9

## Context

The project has uneven game coverage across historical periods. Periods 1 (2 games), 3 (1 game), and 7 (2 games) are under-represented compared to most periods having 3. This expansion brings all periods to minimum 3 games and adds a new Period 9 — a cross-era cultural theme.

## Scope

13 new games total:
- 7 unique custom games (HTML/CSS/JS)
- 4 timeline data files (using existing timeline-engine.js)
- 2 falling-answer data files (using existing game-engine.js)
- 1 new section in index.html (Period 9)
- ~15-25 downloaded image assets

## Period 9: Українська культура крізь віки

A thematic (not chronological) period covering Ukrainian language, art, literature, music, and architecture from Trypillia to the present. This is unique — it spans all eras rather than a time slice.

---

## New Games by Period

### Period 1 — Стародавня історія (+2 new → 4 total)

#### 1.1 Археологічні розкопки (unique canvas game)
- **File:** `games/narrative/archaeology.html`
- **Concept:** Player excavates soil layers click-by-click, revealing artifacts. Each artifact must be classified by culture (Trypillia, Scythian, Greek colony, Sarmatian) via drag-and-drop into labeled bins.
- **Mechanics:**
  - Canvas grid representing excavation site (6×4 cells)
  - Click a cell to "dig" — reveals an artifact image or empty soil
  - Artifacts: pottery, weapons, jewelry, coins (~12 types)
  - 4 classification bins at bottom (one per culture)
  - Drag artifact to correct bin → +points, educational detail popup
  - Wrong bin → -1 life, shows correct answer
  - Score: artifacts correctly classified out of total found
  - 3 difficulty tiers: surface (easy), middle (medium), deep (hard)
- **Assets needed:** ~6 artifact images (simple illustrations), soil/dirt texture, bin icons
- **Canvas font exception:** `ctx.font` uses hardcoded `px` values per CLAUDE.md convention (same as masachuchi.html, bobble-shooter.html)
- **Nav mode:** `data-nav="overlay"` (fullscreen canvas game)
- **Module ID (analytics):** `archaeology`

#### 1.2 Timeline: Стародавня Україна
- **File:** `data/timeline/period-1-starodavnia.js`
- **Format:** `window.TIMELINE_DATA` with 2 rounds × 6 events
- **Content:**
  - Round 1: Trypillia culture → Cimmerian arrival → Greek colonies → Scythian kingdom → Sarmatian migration → Bosporan Kingdom
  - Round 2: Chernyakhov culture → Hunnic invasion → Slavic settlement → Antes union → Avars → Early Kyivan state formation
- **Link:** `shared/templates/timeline-sort.html?id=period-1-starodavnia`

#### 1.3 Falling quiz — already exists (`data/falling/period-1-starodavnia.js`)

---

### Period 3 — Велике князівство Литовське (+4 games → 5 total)

#### 3.1 Будівник міста (unique canvas game)
- **File:** `games/narrative/city-builder.html`
- **Concept:** Player receives Magdeburg rights and builds a medieval Ukrainian city. Each building placement triggers a historical question. Correct answer → building appears; wrong → building delayed.
- **Mechanics:**
  - Isometric-style grid (5×5) rendered in CSS/HTML (not full canvas — use positioned divs for buildings)
  - Building types: Ратуша, Ринок, Церква, Цех ковалів, Школа, Фортеця, Шпиталь, Друкарня (~8 buildings)
  - Each building has a historical question (multiple choice, 4 options)
  - Correct → building placed with animation, fact shown
  - Wrong → "Будівництво затримано", correct answer shown, retry next turn
  - Win condition: all 8 buildings placed
  - Score: buildings placed on first attempt / total
- **Assets needed:** ~8 simple isometric building icons (PNG), grid background
- **Module ID:** `city-builder`

#### 3.2 Дипломат (text adventure)
- **File:** `games/narrative/diplomat.html`
- **Concept:** Player is an envoy at the court of Vytautas. A branching text adventure where each decision point is a real historical event (unions, privileges, trade agreements).
- **Mechanics:**
  - 8-10 decision nodes, each presenting a historical scenario
  - 2-3 choices per node, one historically accurate
  - Choosing the historical path → progress + educational detail
  - Wrong choice → consequence shown, redirect to correct path
  - No dead ends — always progresses forward
  - Tracks "diplomatic reputation" score (0-100)
  - Final screen: summary of choices vs. historical reality
- **Scenario nodes (8):**
  1. Arrival at Vytautas's court — choose alliance strategy
  2. Krevo Union negotiations — merge crowns or keep autonomy?
  3. Battle of Vorskla — support Vytautas or stay neutral?
  4. Horodlo Union — accept Catholic privileges or defend Orthodox rights?
  5. Magdeburg rights petition — grant to Kyiv or delay?
  6. Ostroh Academy founding — support education or military spending?
  7. Church union proposal — unite Orthodox and Catholic or refuse?
  8. Legacy assessment — summary of your diplomatic career vs. history
- **Assets needed:** 1 background image (medieval court), optional character portraits
- **Nav mode:** default (text-based, standard nav bar)
- **Module ID:** `diplomat`

#### 3.3 Timeline: ВКЛ період
- **File:** `data/timeline/period-3-vkl.js`
- **Content:**
  - Round 1: Battle of Blue Waters → Krevo Union → Horodlo Union → Council of Constance → Magdeburg rights for Kyiv → Ostroh Academy founding
  - Round 2: Casimir Privilege → Union of Lublin → Brest Church Union → Zaporozhian Sich formation → Cossack uprisings begin → Khmelnytsky Uprising
- **Link:** `shared/templates/timeline-sort.html?id=period-3-vkl`

#### 3.4 Falling quiz: ВКЛ період
- **Note:** `data/falling/period-3-lytva.js` already exists on disk but is not linked from index.html. Rename it to `data/falling/period-3-vkl.js` for naming consistency, and review/expand its content to 10-12 questions. Link it from index.html.
- **File:** `data/falling/period-3-vkl.js` (rename of existing `period-3-lytva.js`)
- **Link:** `shared/templates/falling-answer.html?id=period-3-vkl`

---

### Period 7 — Радянський період (+3 games → 5 total)

#### 7.1 Самвидав (stealth/strategy game)
- **File:** `games/narrative/samvydav.html`
- **Concept:** Player types and distributes banned literature while avoiding KGB detection. Each document is a real dissident text.
- **Mechanics:**
  - Turn-based: each turn = one "night" of activity
  - Actions per turn: Print (choose document), Distribute (choose contact), Hide (reduce suspicion)
  - Suspicion meter (0-100): rises with printing/distributing, falls with hiding
  - 6-8 documents to distribute: Stus poems, Chornovil writings, Dziuba's "Internationalism or Russification?", Ukrainian Herald issues
  - 5-6 contacts to find: students, workers, intellectuals, clergy, foreign journalists
  - Each distribution → historical context shown
  - Suspicion reaches 100 → "arrested", game over with educational summary
  - Win: distribute all documents before arrest
  - Score: documents distributed + contacts made
- **Assets needed:** Typewriter icon, document icons, simple character silhouettes
- **Nav mode:** `data-nav="overlay"` (immersive game)
- **Module ID:** `samvydav`

#### 7.2 Хроніка пам'яті (memory card game)
- **File:** `games/narrative/memory-chronicle.html`
- **Concept:** Classic memory/concentration card game. Flip pairs of cards matching photos to events, names to portraits. Themes: Holodomor, WWII partisans, Sixtiers, Chornobyl.
- **Mechanics:**
  - 4×4 grid of face-down cards (8 pairs)
  - Card types: event photo ↔ event name, portrait ↔ person name
  - Flip 2 cards: match → stay face-up + educational detail; no match → flip back
  - 4 rounds (one per theme): Holodomor, WWII, Sixtiers/dissidents, Chornobyl
  - Score: pairs found / total flips (efficiency)
  - Timer for optional speed challenge
- **Assets needed:** ~16 images (4 per theme: historical photos or illustrations + text cards)
- **Nav mode:** `data-nav="overlay"` (card-flip game)
- **Module ID:** `memory-chronicle`

#### 7.3 Timeline: Радянський період
- **File:** `data/timeline/period-7-radianskyi.js`
- **Content:**
  - Round 1: Soviet occupation of Ukraine → Holodomor → WWII begins → Liberation of Kyiv → Post-war Russification → Khrushchev Thaw
  - Round 2: Sixtiers movement → Shelest removal → Helsinki Group → Chornobyl disaster → Rukh founding → Declaration of Sovereignty
- **Link:** `shared/templates/timeline-sort.html?id=period-7-radianskyi`

#### 7.4 Falling quiz — already exists (`data/falling/period-7-radianskyi.js`)

---

### Period 9 — Українська культура крізь віки (+4 games, all new)

#### 9.1 Культурна галерея (gallery quiz)
- **File:** `games/narrative/culture-gallery.html`
- **Concept:** Interactive gallery showing art, architecture, and cultural artifacts. Player identifies the era and creator via drag-and-drop matching.
- **Mechanics:**
  - Gallery carousel showing one artwork/building at a time
  - Below: drag-and-drop labels for era (Trypillia, Kyivan Rus, Baroque, Romanticism, Modern) and author/style
  - 12-15 items spanning all periods: Trypillia pottery, Kyiv mosaics, Cossack Baroque churches, Shevchenko paintings, Lysenko music, Dovzhenko films, Paradjanov, modern murals
  - Correct match → zoom into detail + educational text
  - Score: correct identifications / total items
- **Assets needed:** ~12 artwork/architecture images (public domain from Wikimedia)
- **Module ID:** `culture-gallery`

#### 9.2 Вежа культури (tower stacking game)
- **File:** `games/narrative/culture-tower.html`
- **Concept:** Build a tower of cultural achievements from Trypillia to present. Each block is a fact/question — correct answer locks it in place, wrong answer makes the tower wobble.
- **Mechanics:**
  - Tower rendered as stacked blocks in CSS (no canvas needed)
  - Each level: question about a cultural achievement (multiple choice)
  - Correct → block added solidly, tower grows, achievement detail shown
  - Wrong → tower wobbles (CSS animation), block placed cracked, -points
  - 15 levels from ancient to modern (chronological order)
  - Win: reach the top (all 15 blocks)
  - Score: solid blocks / total blocks
  - Visual: blocks get progressively smaller toward top (pyramid-like)
- **Assets needed:** Block texture, optional cultural era icons
- **Module ID:** `culture-tower`

#### 9.3 Timeline: Українська культура
- **File:** `data/timeline/period-9-kultura.js`
- **Content:**
  - Round 1: Trypillia pottery → Kyiv Sophia mosaics → Ostroh Bible → Cossack Baroque → Kotlyarevsky's Eneida → Shevchenko's Kobzar
  - Round 2: Lysenko opera → Franko literature → Dovzhenko cinema → Sixtiers poetry → Chornobyl literature → Modern Ukrainian renaissance
- **Link:** `shared/templates/timeline-sort.html?id=period-9-kultura`

#### 9.4 Falling quiz: Українська культура
- **File:** `data/falling/period-9-kultura.js`
- **Content:** 12 questions about Ukrainian cultural figures and achievements across all eras
- **Link:** `shared/templates/falling-answer.html?id=period-9-kultura`

---

## Integration

### index.html
- Add new game buttons to existing Period 1, 3, 7 cards
- Add Period 9 card after Period 8, before the β section:
  ```html
  <div class="card anim-fade-in">
    <h2><span class="period-num">9</span> Українська культура</h2>
    <p>Мова, мистецтво, література, музика та архітектура крізь віки</p>
    <div class="card-actions">
      <a href="games/narrative/culture-gallery.html" class="btn btn-primary btn-sm">Культурна галерея</a>
      <a href="games/narrative/culture-tower.html" class="btn btn-secondary btn-sm">Вежа культури</a>
      <a href="shared/templates/falling-answer.html?id=period-9-kultura" class="btn btn-secondary btn-sm">Вікторина</a>
      <a href="shared/templates/timeline-sort.html?id=period-9-kultura" class="btn btn-secondary btn-sm">Хронологія</a>
    </div>
  </div>
  ```

### HTML boilerplate for each new game file
```html
<head>
  <link rel="stylesheet" href="../../shared/css/reset.css">
  <link rel="stylesheet" href="../../shared/css/theme.css">
  <link rel="stylesheet" href="../../shared/css/layout.css">
  <link rel="stylesheet" href="../../shared/css/components.css">
  <link rel="stylesheet" href="../../shared/css/animations.css">
  <link rel="stylesheet" href="../../shared/css/responsive.css">
</head>
<!-- before </body>: -->
<script src="../../shared/js/nav.js"></script>
<script src="../../shared/js/analytics.js"></script>
<script src="../../shared/js/accessibility.js"></script>
```

### Accessibility compliance (per CLAUDE.md)
Each new game file must include:
- CSS custom properties from `theme.css` for all colors (backgrounds, text, borders)
- Explicit `body.theme-light { ... }` overrides for any game-specific dark elements (e.g., Samvydav's dark night UI, Memory Chronicle's card backs)
- `.high-contrast` overrides for thicker borders and reduced transparency
- All `font-size` declarations use `var(--text-*)` (except canvas `ctx.font`)

### Analytics
Each custom game adds 2 lines:
```js
if (window.HLGAnalytics) HLGAnalytics.startSession('MODULE_ID');
// ...at game end:
if (window.HLGAnalytics) HLGAnalytics.endSession({score: s, won: w});
```

### Navigation
Each game file sets body attributes:
```html
<body data-section="Period Name" data-game-title="Game Name" data-home-url="../../index.html">
```

---

## Assets Strategy

Download public domain / CC-licensed images from Wikimedia Commons and Unsplash:

### Period 1 (Archaeology)
- Trypillia pottery photos (Wikimedia: "Trypillia culture pottery")
- Scythian gold artifacts (Wikimedia: "Scythian gold")
- Greek amphora illustrations
- Soil/excavation texture

### Period 3 (City Builder + Diplomat)
- Medieval city isometric icons (simple CSS/SVG, no external images needed)
- Lutsk/Ostroh castle photo for Diplomat background

### Period 7 (Samvydav + Memory)
- Dissident portrait photos: Stus, Chornovil, Dziuba, Symonenko (Wikimedia, public domain)
- Holodomor memorial, WWII liberation, Chornobyl reactor (Wikimedia)
- Typewriter icon (SVG/CSS)

### Period 9 (Gallery + Tower)
- Trypillia pottery, Kyiv Sophia mosaics, Cossack Baroque churches (Wikimedia)
- Shevchenko self-portraits, Dovzhenko film stills (public domain)
- Modern murals — use CSS-generated abstract patterns as fallback

All images stored in `assets/images/` with descriptive names: `archaeology-trypillia-pot.jpg`, `samvydav-stus.jpg`, etc.

---

## File Summary

| File | Type | Lines (est) |
|------|------|-------------|
| `games/narrative/archaeology.html` | New game | ~400 |
| `games/narrative/city-builder.html` | New game | ~450 |
| `games/narrative/diplomat.html` | New game | ~500 |
| `games/narrative/samvydav.html` | New game | ~450 |
| `games/narrative/memory-chronicle.html` | New game | ~350 |
| `games/narrative/culture-gallery.html` | New game | ~400 |
| `games/narrative/culture-tower.html` | New game | ~350 |
| `data/timeline/period-1-starodavnia.js` | Data file | ~80 |
| `data/timeline/period-3-vkl.js` | Data file | ~80 |
| `data/timeline/period-7-radianskyi.js` | Data file | ~80 |
| `data/timeline/period-9-kultura.js` | Data file | ~80 |
| `data/falling/period-3-vkl.js` | Renamed + expanded (was period-3-lytva.js) | ~60 |
| `data/falling/period-9-kultura.js` | Data file | ~60 |
| `index.html` | Modified | +40 |
| ~20 asset images | Downloaded | — |

**Total: 12 new game experiences (+ 1 renamed/expanded), 7 new HTML files, 5 new data files + 1 rename, ~2900 lines of code**

---

## Verification

1. Open each new game → play through → verify score/win tracking in `localStorage`
2. Check `docs/analytics.html` shows all new module IDs
3. Verify accessibility panel works on all 7 new HTML files (gear button, theme, font, motion, contrast)
4. Verify all new games appear on index.html with correct links
5. Test on `file://` protocol (no server) — all games must work offline
6. Check Period 9 section renders correctly between Period 8 and β section
