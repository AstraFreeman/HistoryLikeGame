# Game Expansion: Periods 1, 3, 7 + New Period 9

## Context

The project has uneven game coverage across historical periods. Periods 1 (2 games), 3 (1 game), and 7 (2 games) are under-represented compared to most periods having 3. This expansion brings all periods to minimum 3 games and adds a new Period 9 — a cross-era cultural theme.

## Scope

13 new games total:
- 7 unique custom games (HTML/CSS/JS)
- 4 timeline data files (using existing timeline-engine.js)
- 2 falling-answer data files (using existing game-engine.js)
- 1 new section in index.html (Period 9, collapsible)
- User-provided image assets with validation (red square fallback)

## Implementation Priority

| Priority | Games |
|----------|-------|
| 1 (highest) | Археологічні розкопки (1.1), Timeline Радянський (7.3), Вежа культури (9.2) |
| 2 | Будівник міста (3.1), Самвидав (7.1) |
| 3 | Timeline Культура (9.3) |
| 4 | Радіо Свобода (7.2), Falling Культура (9.4) |
| 5 (lowest) | Дипломат (3.2), Культурна галерея (9.1) |

## Period 9: Українська культура крізь віки

A thematic (not chronological) period covering Ukrainian art, literature, architecture from Trypillia to the present. Music is optional/secondary. Language is included but not emphasized as a focus. This period spans all eras rather than a time slice.

## Asset Validation System

All games that use images must validate asset presence at runtime:
- Assets stored in `data/` subfolders per game (e.g., `data/games/archaeology/`)
- Each game has a manifest of expected filenames with specific naming codes
- On load, attempt to display each image; if missing → show **red square** placeholder (`#e00` background, white text showing expected filename)
- This allows the user to add images incrementally and see what's still missing

---

## New Games by Period

### Period 1 — Стародавня історія (+2 new → 4 total)

#### 1.1 Археологічні розкопки (unique canvas game) — Priority 1
- **File:** `games/narrative/archaeology.html`
- **Data folder:** `data/games/archaeology/` — contains asset manifest and game data
- **Concept:** Player excavates soil layers click-by-click, revealing artifacts. Each artifact must be classified by culture (Trypillia, Scythian, Greek colony, Stone Age) via **two control methods**: drag-and-drop into bins AND fixed buttons (both always available).
- **Mechanics:**
  - Canvas grid representing excavation site (6×4 cells)
  - Click a cell to "dig" — reveals an artifact image or empty soil
  - Artifacts: pottery, jewelry, tools, ornaments, coins (~12 types, minimal weapon emphasis)
  - 4 classification bins at bottom (one per culture): Трипілля, Скіфи, Грецькі колонії, Кам'яний вік
  - **Dual controls:** drag artifact to correct bin OR click artifact then click culture button — both methods work
  - Correct classification → +points, educational detail popup
  - Wrong button → -1 life, shows correct answer
  - Score: artifacts correctly classified out of total found
  - 3 difficulty tiers: surface (easy), middle (medium), deep (hard)
- **Asset variants:** Each artifact supports 2 display modes:
  - Normal: photograph/illustration (`.jpg` or `.gif`)
  - "STL" mode: graphical/schematic copy (line-art style), stored as `*_stl.jpg`
  - Toggle button lets player switch between modes
  - `.gif` format supported for animated artifact reveals
- **Asset naming convention:** `{CULTURE}_{type}_{n}.{ext}`
  - Examples: `TRPL_pot_1.jpg`, `TRPL_pot_1_stl.jpg`, `SKIF_gold_1.jpg`, `GREK_amph_1.gif`, `KAMN_tool_1.jpg`
  - Culture codes: `TRPL` (Trypillia), `SKIF` (Scythian), `GREK` (Greek), `KAMN` (Stone Age)
- **Asset validation:** On load, check each expected file in `data/games/archaeology/`. Missing → red square with filename.
- **Canvas font exception:** `ctx.font` uses hardcoded `px` values per CLAUDE.md convention
- **Nav mode:** `data-nav="overlay"` (fullscreen canvas game)
- **Module ID (analytics):** `archaeology`

#### 1.2 Timeline: Стародавня Україна
- **Note:** `shiwafornia-2.html` already covers this period as a narrative game, but this timeline adds a chronological sorting experience.
- **File:** `data/timeline/period-1-starodavnia.js`
- **Format:** `window.TIMELINE_DATA` with 2 rounds × 6 events
- **Content:**
  - Round 1: Trypillia culture → Cimmerian arrival → Greek colonies → Scythian kingdom → Sarmatian migration → Bosporan Kingdom
  - Round 2: Chernyakhov culture → Hunnic invasion → Slavic settlement → Antes union → Avars → Early Kyivan state formation
- **Link:** `shared/templates/timeline-sort.html?id=period-1-starodavnia`

#### 1.3 Falling quiz — already exists (`data/falling/period-1-starodavnia.js`)

---

### Period 3 — Велике князівство Литовське (+4 games → 5 total)

#### 3.1 Будівник міста (unique CSS/HTML game) — Priority 2
- **File:** `games/narrative/city-builder.html`
- **Concept:** Player receives Magdeburg rights and builds a medieval Ukrainian city. Each building placement triggers a historical question. Correct answer → building appears; wrong → building delayed.
- **Mechanics:**
  - Isometric-style grid (5×5) rendered in CSS/HTML (positioned divs for buildings)
  - Building types: Ратуша, Ринок, Церква, Цех ковалів, Школа, Фортеця, Шпиталь, Друкарня (~8 buildings)
  - Each building has a historical question (multiple choice, 4 options)
  - Correct → building placed with animation, fact shown
  - Wrong → "Будівництво затримано", correct answer shown, retry next turn
  - Win condition: all 8 buildings placed
  - Score: buildings placed on first attempt / total
- **Key buildings with real photos:** Ратуша, Церква, Школа, Фортеця must display real historical photos from NMT course materials. These images will be provided by the user.
  - Asset folder: `data/games/city-builder/`
  - Naming: `RATH_1.jpg`, `TSER_1.jpg`, `SHKO_1.jpg`, `FORT_1.jpg`
  - Missing image → red square with expected filename
  - Other buildings (Ринок, Цех, Шпиталь, Друкарня) use CSS/SVG icons
- **Module ID:** `city-builder`

#### 3.2 Дипломат (text adventure) — Priority 5
- **File:** `games/narrative/diplomat.html`
- **Concept:** Player is an envoy at the court of Vytautas. A branching text adventure where each decision point is a real historical event.
- **Mechanics:**
  - 8 decision nodes, each presenting a historical scenario
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
  - Round 1 (5 events): Battle of Blue Waters → Krevo Union → Horodlo Union → Magdeburg rights for Kyiv → Ostroh Academy founding
  - Round 2 (5 events): Casimir Privilege → Union of Lublin → Brest Church Union → Zaporozhian Sich formation → Khmelnytsky Uprising
- **Link:** `shared/templates/timeline-sort.html?id=period-3-vkl`

#### 3.4 Falling quiz: ВКЛ період
- **Note:** `data/falling/period-3-lytva.js` already exists on disk but is not linked from index.html. Rename it to `data/falling/period-3-vkl.js` for naming consistency, review/expand its content to 10-12 questions. Link it from index.html.
- **File:** `data/falling/period-3-vkl.js` (rename of existing `period-3-lytva.js`)
- **Link:** `shared/templates/falling-answer.html?id=period-3-vkl`

---

### Period 7 — Радянський період (+3 games → 5 total)

#### 7.1 Самвидав (stealth/strategy game) — Priority 2
- **File:** `games/narrative/samvydav.html`
- **Data file:** `games/narrative/samvydav-data.json` — document and contact data (external JSON loaded by the game)
- **Concept:** Player types and distributes banned literature while avoiding KGB detection. Each document is a real dissident text.
- **Mechanics:**
  - Turn-based: each turn = one "night" of activity
  - Actions per turn: Print (choose document), Distribute (choose contact), Hide (reduce suspicion)
  - Suspicion meter (0-100): rises with printing/distributing, falls with hiding
  - 6-8 documents to distribute: Stus poems, Chornovil writings, Dziuba's "Internationalism or Russification?", Ukrainian Herald issues
  - 5-6 contacts: students, workers, intellectuals, clergy, foreign journalists
  - **Note:** Some historical figures appear in multiple roles (e.g., Chornovil as both author and contact) — the game must handle name deduplication gracefully (show different aspect of the same person)
  - Each distribution → historical context shown
  - Suspicion reaches 100 → "arrested", game over with educational summary
  - Win: distribute all documents before arrest
  - Score: documents distributed + contacts made
- **Assets needed:** Typewriter icon, document icons, simple character silhouettes
- **Nav mode:** `data-nav="overlay"` (immersive game)
- **Module ID:** `samvydav`

#### 7.2 Радіо Свобода (quiz-show game) — Priority 4
- **File:** `games/narrative/radio-svoboda.html`
- **Concept:** Player is a Radio Liberty broadcaster during the Soviet era. Read real news snippets, answer listener call-in questions about events. Correct answers keep you broadcasting; wrong answers get your signal "jammed."
- **Mechanics:**
  - Quiz-show format with radio atmosphere (CSS styled as radio studio console)
  - 4 rounds, each covering a Soviet-era theme: Holodomor memory, WWII truth, Sixtiers/dissidents, Chornobyl aftermath
  - Each round: 3-4 news snippets read aloud (text display), followed by a "caller question" (multiple choice)
  - Correct answer → signal strength stays, audience grows, educational detail
  - Wrong answer → "signal jammed" animation, -1 life (3 lives total)
  - Win: complete all 4 rounds without losing all signal
  - Score: correct answers / total questions
  - Visual: radio frequency meter, signal strength bar, vintage radio aesthetic
- **Assets needed:** Radio/frequency icons (CSS/SVG), no photos needed
- **Nav mode:** `data-nav="overlay"` (immersive game)
- **Module ID:** `radio-svoboda`

#### 7.3 Timeline: Радянський період — Priority 1
- **File:** `data/timeline/period-7-radianskyi.js`
- **Styling note:** Apply socialist realism aesthetic to this timeline — use bold red/gold accent colors, constructivist-inspired typography. Override `--game-accent` and `--game-bg` CSS custom properties in the template via the data file's `theme` property (if supported) or via a dedicated `<style>` block in a wrapper page.
- **Content (detailed):**
  - Round 1: Soviet occupation of Ukraine (1919-1920) → Holodomor (1932-1933) → WWII begins for Ukraine (1941) → Liberation of Kyiv (1943) → Post-war Russification policies (1946-1953) → Khrushchev Thaw (1956-1964)
  - Round 2: Sixtiers movement / Шістдесятники (1960s) → Shelest removal & Shcherbytsky era (1972) → Ukrainian Helsinki Group founded (1976) → Chornobyl disaster (April 26, 1986) → Народний Рух України founded (September 1989) → Declaration of State Sovereignty (July 16, 1990)
- **Link:** `shared/templates/timeline-sort.html?id=period-7-radianskyi`
- **Implementation note:** If timeline-engine.js doesn't support custom theming, create a thin wrapper page `games/narrative/timeline-soviet.html` that loads the template content but adds socialist-style CSS overrides.

#### 7.4 Falling quiz — already exists (`data/falling/period-7-radianskyi.js`)

---

### Period 9 — Українська культура крізь віки (+4 games, all new)

#### 9.1 Культурна галерея (gallery quiz) — Priority 5
- **File:** `games/narrative/culture-gallery.html`
- **Concept:** Interactive gallery showing art, architecture, and cultural artifacts. Player identifies the era and creator via drag-and-drop matching.
- **Mechanics:**
  - Gallery carousel showing one artwork/building at a time
  - Below: drag-and-drop labels for era (Trypillia, Kyivan Rus, Baroque, Romanticism, Modern) and author/style
  - 12-15 items spanning all periods: Trypillia pottery, Kyiv mosaics, Cossack Baroque churches, Shevchenko paintings, Dovzhenko films, modern murals
  - Music references optional/secondary
  - Correct match → zoom into detail + educational text
  - Score: correct identifications / total items
- **Assets:** User-provided images in `data/games/culture-gallery/`. Missing → red square with expected filename.
- **Module ID:** `culture-gallery`

#### 9.2 Вежа культури (tower stacking game) — Priority 1
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

#### 9.3 Timeline: Українська культура — Priority 3
- **File:** `data/timeline/period-9-kultura.js`
- **Content (with images + text):** Each event should include both a `detail` text and an optional `image` path for visual enrichment.
  - Round 1: Trypillia pottery → Kyiv Sophia mosaics → Ostroh Bible → Cossack Baroque → Kotlyarevsky's Eneida → Shevchenko's Kobzar
  - Round 2: Lysenko opera → Franko literature → Dovzhenko cinema → Sixtiers poetry → Chornobyl literature → Modern Ukrainian renaissance
- **Assets:** Images in `data/games/culture-timeline/`. Missing → red square.
- **Link:** `shared/templates/timeline-sort.html?id=period-9-kultura`
- **Note:** Timeline engine may need minor extension to support optional event images. If too complex, use text-only with detailed descriptions.

#### 9.4 Falling quiz: Українська культура — Priority 4
- **File:** `data/falling/period-9-kultura.js`
- **Content:** 12 questions about Ukrainian cultural figures and achievements across all eras
- **Link:** `shared/templates/falling-answer.html?id=period-9-kultura`

---

## Integration

### index.html
- Add new game buttons to existing Period 1, 3, 7 cards
- Add Period 9 as a **collapsible section** (hidden by default, revealed on button click):
  ```html
  <!-- Button to reveal Period 9 -->
  <button class="btn btn-accent btn-sm" id="showPeriod9"
          onclick="document.getElementById('period9Card').style.display='';this.style.display='none';">
    Відкрити: Українська культура крізь віки
  </button>

  <div class="card anim-fade-in" id="period9Card" style="display:none;">
    <h2><span class="period-num">9</span> Українська культура</h2>
    <p>Мистецтво, література та архітектура крізь віки</p>
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
- Explicit `body.theme-light { ... }` overrides for any game-specific dark elements (e.g., Samvydav's dark night UI, Radio Svoboda's vintage radio aesthetic, Soviet timeline's red/gold theme)
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

**Key principle:** Most game images will be provided by the user, not auto-downloaded. Each game validates its expected assets at runtime and shows red square placeholders for missing files.

### Asset folders
- `data/games/archaeology/` — artifact images (`TRPL_pot_1.jpg`, `SKIF_gold_1.jpg`, etc.)
- `data/games/city-builder/` — building photos (`RATH_1.jpg`, `TSER_1.jpg`, `SHKO_1.jpg`, `FORT_1.jpg`)
- `data/games/culture-gallery/` — artwork/architecture images
- `data/games/culture-timeline/` — timeline event images

### Auto-generated assets (no user input needed)
- Soil/excavation textures (CSS gradients)
- Isometric building icons for non-photo buildings (CSS/SVG)
- Typewriter icon, radio frequency visuals (CSS/SVG)
- Block textures for Culture Tower (CSS gradients)
- Socialist-style decorative elements for Soviet timeline (CSS)

---

## File Summary

| File | Type | Priority | Lines (est) |
|------|------|----------|-------------|
| `games/narrative/archaeology.html` | New game | 1 | ~450 |
| `games/narrative/culture-tower.html` | New game | 1 | ~350 |
| `data/timeline/period-7-radianskyi.js` | Data file | 1 | ~100 |
| `games/narrative/city-builder.html` | New game | 2 | ~450 |
| `games/narrative/samvydav.html` | New game | 2 | ~450 |
| `games/narrative/samvydav-data.json` | Data file | 2 | ~80 |
| `data/timeline/period-9-kultura.js` | Data file | 3 | ~100 |
| `games/narrative/radio-svoboda.html` | New game | 4 | ~400 |
| `data/falling/period-9-kultura.js` | Data file | 4 | ~60 |
| `games/narrative/diplomat.html` | New game | 5 | ~500 |
| `games/narrative/culture-gallery.html` | New game | 5 | ~400 |
| `data/timeline/period-1-starodavnia.js` | Data file | — | ~80 |
| `data/timeline/period-3-vkl.js` | Data file | — | ~80 |
| `data/falling/period-3-vkl.js` | Rename + expand | — | ~60 |
| `index.html` | Modified | — | +50 |

**Total: 7 new HTML game files, 7 data files (5 new + 1 rename + 1 JSON), ~3560 lines of code**

---

## Verification

1. Open each new game → play through → verify score/win tracking in `localStorage`
2. Check `docs/analytics.html` shows all new module IDs
3. Verify accessibility panel works on all 7 new HTML files (gear button, theme, font, motion, contrast)
4. Verify all new games appear on index.html with correct links
5. Test on `file://` protocol (no server) — all games must work offline
6. Check Period 9 collapsible section works (hidden by default, reveals on button click)
7. Verify red square fallback for missing images in archaeology, city-builder, culture-gallery, culture-timeline
8. Verify Soviet timeline has socialist-style CSS (red/gold accents, constructivist typography)
