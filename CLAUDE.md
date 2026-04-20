# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Історія як гра" (History as a Game) — a Ukrainian-language educational web project that teaches Ukrainian history through interactive browser-based games covering 9 historical periods. Pure static HTML/CSS/JS with no build system, package manager, or test framework. No tests exist — verify changes by opening the relevant HTML file in a browser.

## Running the Project

Open any HTML file directly in a browser, or serve with any static file server:
```bash
python3 -m http.server 8000
```
The entry point is `index.html`.

For detailed API reference, see `docs/DEV-GUIDE.md` (Ukrainian).

## Directory Structure

```
index.html                    # Main hub page (links to all games)
shared/
  css/
    reset.css                 # Box-sizing, base typography, utilities
    theme.css                 # CSS custom properties (colors, spacing, typography)
    layout.css                # Game containers, grids, panels
    components.css            # Buttons, cards, modals, nav bar, inputs
    animations.css            # @keyframes and utility animation classes
    responsive.css            # Mobile-first media queries
  js/
    nav.js                    # Sticky nav bar, reads data-* attrs from <body>
    quiz-engine.js            # window.QuizGame — shared quiz logic
    game-engine.js            # window.FallingGame — falling-answer game logic
    timeline-engine.js        # window.TimelineGame — chronological sorting engine
    canvas-utils.js           # window.CanvasUtils — canvas helpers
    ui-utils.js               # window.UIUtils — modal/notification helpers
    assistant.js              # Octopus mascot (keyboard movement, GIF states)
    analytics.js              # window.HLGAnalytics — localStorage learning analytics
    asset-validator.js        # window.AssetValidator — red square fallback for missing images
    accessibility.js          # Floating accessibility settings panel
  templates/
    quiz-question.html        # Template for quiz pages, loads data via ?id= param
    falling-answer.html       # Template for falling-answer games, loads data via ?id=
    timeline-sort.html        # Template for timeline sorting games, loads data via ?id=
data/
  questions/
    questions-db.js           # Consolidated DB: all quiz/falling/timeline/nmt data (window.QUESTIONS_DB)
  quiz/                       # 23 quiz data files (crstm-s-{row}-{col}.js) — source for questions-db.js
  falling/                    # 9 falling-game data files (period-{n}-{name}.js) — source for questions-db.js
  timeline/                   # 8 timeline-sort data files (period-{n}-{name}.js) — source for questions-db.js
  nmt/                        # NMT exam questions: CH**-{name}.txt (source) + nmt-CH**.js (compiled)
    chapters.md               # Authoritative registry of NMT chapters and their status
  raw/                        # Unstructured raw NMT exam texts (YYMMDD-{period}.txt) for process-raw.py
  problem.md                  # Auto-generated: image-reference issues found in raw files (do not edit manually)
  assistant/                  # Assistant facts database
  pheniks_2/                  # Puzzle piece images (MZP/PTL/SGD sets)
  games/                      # Game-specific data files and assets
    solitaire-v2-cossack.js   # Solitaire card data
    bobble-imperial.js        # Bobble shooter categories
    puzzle-soviet.js           # Puzzle game data
    kafe-independence.js       # Kafe simulator data
    archaeology/              # Artifact images (TRPL_*, SKIF_*, GREK_*, KAMN_*)
    city-builder/             # Building photos (RATH_1, TSER_1, SHKO_1, FORT_1)
    culture-gallery/          # Artwork images (GAL_*)
    culture-timeline/         # Cultural event images (TL9_*)
games/
  narrative/                  # 26 game pages: story-driven, interactive, and unique games
    masachuchi/               # Apple-catching canvas game (own image/ subdir)
    new-makako-1/             # Falling game variant (own styles.css, script.js)
    tower-defense.html        # Three.js tower defense game (Period 5)
    archaeology.html          # Excavation game — dig artifacts, classify by culture (Period 1)
    city-builder.html         # Grid-based city builder with quiz (Period 3)
    diplomat.html             # 8-node branching text adventure (Period 3)
    culture-tower.html        # 15-level stacking quiz (Period 9)
    culture-gallery.html      # Artwork identification carousel (Period 9)
    samvydav.html             # Turn-based stealth/strategy with JSON data (Period 7)
    radio-svoboda.html        # Radio quiz-show format (Period 7)
  start-pages/                # Educational intro pages before games
  quiz-hub/                   # crstm-s-main.html — quiz grid hub
  map/                        # Interactive zoomable historical map
ar/                           # A-Frame / AR.js augmented reality pages
  usin/                       # AR marker scenes (each has own models/ subdir)
  usin-blue/
  usin-green/
  usin-indg/
  usin-prsk/
assets/
  images/                     # All shared images (game art, backgrounds, assistant GIFs)
  models/                     # 3D .glb models (drakar, viking)
  music/                      # Audio files (.mp3)
  map/                        # Map image assets
  fonts/                      # ADVENTURE MSDF font for A-Frame text
docs/
  GUIDE.md                    # Player guide (Ukrainian)
  DEV-GUIDE.md                # Developer guide (Ukrainian) — detailed API reference
  TESTING-CHECKLIST.md        # Non-technical tester checklist (Ukrainian)
  superpowers/                # Claude Code plans and design specs
tools/
  nmt-import.py               # Converts structured NMT .txt source files → JavaScript (quiz-data or db-entry)
  process-raw.py              # Parses unstructured raw exam texts in data/raw/ → JavaScript or report
  build-nmt-chapter.py        # Builds a full NMT chapter from raw .txt files → CH**.txt + nmt-CH**.js
export.md                     # Assistant (Sprut octopus) system reference: GIF states, secrets, facts, CSS
```

## Architecture

**Hub-and-spoke:** `index.html` links to all games. Games use shared CSS/JS via `<link>` and `<script>` tags (no ES modules — must work with `file://`).

**Shared JS modules** attach APIs to `window.*`:
- `window.QuizGame.init(config)` — quiz engine
- `window.FallingGame.init(config)` — falling-answer engine
- `window.TimelineGame.init(config)` — chronological sorting engine
- `window.CanvasUtils` — canvas helpers
- `window.UIUtils` — modal/notification helpers
- `accessibility.js` — auto-injected floating settings panel (theme, font, motion, contrast)

**Navigation** via `nav.js`: reads `data-section`, `data-game-title`, `data-home-url` from `<body>`. Use `data-nav="overlay"` for fullscreen games (floating button), `data-nav="false"` to skip. AR pages use an inline floating `<a>` tag instead.

**Asset validation:** `window.AssetValidator.createImg()` replaces missing images with a red (#e00) square showing the expected filename, preventing broken layouts during development.

**Quiz template system:** `shared/templates/quiz-question.html?id=1-1` dynamically loads `data/quiz/crstm-s-1-1.js` which sets `window.QUIZ_DATA`. Same pattern for falling games (`window.FALLING_DATA`) and timeline games (`window.TIMELINE_DATA`).

**Consolidated questions DB:** `data/questions/questions-db.js` aggregates all quiz, falling, timeline, and NMT data into `window.QUESTIONS_DB` with four top-level namespaces: `quiz` (keyed `'1-1'` etc.), `falling` (keyed by period name), `timeline` (keyed by period name), and NMT entries inside `quiz` under keys like `'nmt-CH04'`. The individual `.js` files in `data/quiz/`, `data/falling/`, `data/timeline/`, `data/nmt/` remain authoritative sources — `questions-db.js` is a compiled artifact. NMT source files are `.txt` — regenerate with `tools/nmt-import.py`.

**Games registry:** `data/games-registry.js` defines `window.GAMES_REGISTRY` — an array of all games with fields: `id` (analytics moduleId), `title`, `period` (0-9 or null), `sectionKey` (link to QUESTIONS_DB), `type`, `mechanic`, `url`, `hasAnalytics`. Update manually when adding new games to `index.html`.

**CSS theming:** `theme.css` defines CSS custom properties. Pages can override with `--game-accent`, `--game-bg` etc. Dark glassmorphism base with vibrant accents.

## Adding a New Game

1. Create a data file if needed: `data/games/my-game-data.js` → `window.MY_GAME_DATA = { ... };`
2. Create HTML in `games/narrative/my-game.html`:
   - Load shared CSS: `reset.css`, `theme.css`, `animations.css` (minimum)
   - Set `<body>` data attrs: `data-nav="overlay"` for fullscreen, `data-home-url="../../index.html"`
   - Load game data script, then game logic
   - Load `nav.js`, `analytics.js`, `accessibility.js` before `</body>` (in that order)
3. Integrate analytics (2 lines): `HLGAnalytics.startSession('id')` at start, `HLGAnalytics.endSession({...})` at end
4. Add link card in `index.html`

For template-based games (quiz/falling/timeline), create only a data file and link to the shared template with `?id=` param.

## Key Conventions

- **Language:** All UI text in Ukrainian. Only first word in a sentence capitalized (Ukrainian rule)
- **No build step:** Files served as-is. No transpilation, bundling, or minification. No npm/yarn/pnpm
- **Naming:** kebab-case for files and directories
- **AR pages** depend on CDN-hosted A-Frame and AR.js libraries
- **Paths from game pages:** Games in `games/*/` use `../../shared/`, `../../assets/` etc.
- **No innerHTML:** Use `document.createElement` and DOM methods for all dynamic content (security + accessibility.js convention)
- **Script load order before `</body>`:** `nav.js` → `analytics.js` → `accessibility.js` (accessibility panel depends on analytics being available)
- **`file://` compatibility:** No ES modules, no `fetch()` for local JSON — use `<script>` tags that set `window.*` globals instead

## Accessibility

`shared/js/accessibility.js` creates a floating gear button on all pages with settings:
- **Theme:** dark/light (CSS class `.theme-light` on `<body>`)
- **Font size:** normal/large/xlarge (`.font-lg`, `.font-xl` on `<html>`)
- **Reduced motion:** (`.reduce-motion` on `<html>`)
- **High contrast:** (`.high-contrast` on `<html>`)

Persists to localStorage keys: `histgame_theme`, `histgame_fontsize`, `histgame_reducemotion`, `histgame_highcontrast`.

Early theme detection `<script>` in `<head>` of `index.html` prevents FOUC. Uses safe DOM creation methods (no innerHTML).

### Font scaling compliance

All `font-size` declarations in game files use `var(--text-*)` CSS custom properties from `theme.css` (not hardcoded `px`). This ensures the A/A+/A++ font size toggle works everywhere. The `--text-*` variables use `rem`+`clamp()`, which scale with the root font-size set by `.font-lg` (120%) / `.font-xl` (140%).

**Exception:** Canvas API `ctx.font` requires absolute `px` values — these are left as-is in `new-makako-2.html`, `masachuchi.html`, `bobble-shooter.html`.

### Theme & contrast compliance

Every game page that loads `accessibility.js` has either:
- CSS custom properties from `theme.css` for colors (e.g. `var(--gradient-bg)`, `var(--color-text-primary)`) — automatically responds to `.theme-light`, OR
- Explicit `body.theme-light { ... }` overrides in its `<style>` block for game-specific dark elements, AND
- `.high-contrast` overrides for thicker borders and reduced transparency

The `.reduce-motion` rule in `theme.css` uses `!important` to globally kill animations/transitions.

**Out of scope:** AR pages (`ar/`) and standalone data games (`data/games/Yove_3/`) do not load `accessibility.js`.

## Analytics

`shared/js/analytics.js` provides lightweight, private learning analytics stored in `localStorage` (key: `histgame_analytics`). No network requests, cookies, or personal identifiers.

**API:** `window.HLGAnalytics`
- `startSession(moduleId)` — begin tracking (moduleId auto-resolved from `?id=` or pathname)
- `endSession({score, won, attempts})` — save session record
- `cancelSession()` — discard without saving
- `getSessions()` / `getOverview()` / `getModuleSummary(id)` — read data
- `exportJSON()` / `exportCSV()` / `downloadFile(format)` — export
- `sendToTeacher()` — mailto: with CSV data
- `renderDashboard(containerId)` — mini stats card (used on index.html)
- `renderExport(containerId)` — full table + export buttons (used on docs/analytics.html)
- `clearAll()` — delete all data with confirmation

**Integration:** Shared engines (quiz-engine.js, game-engine.js, timeline-engine.js) call `startSession`/`endSession` automatically. Custom games add 2 lines each. All calls guarded by `if (window.HLGAnalytics)`.

**Data format:** Compact keys for storage efficiency (~120 bytes/record):
```json
{"m":"period-5-imperium","t0":1710400000000,"dt":45200,"a":3,"s":12,"w":true}
```

## Data File Patterns

**Quiz data** (`window.QUIZ_DATA`): Contains `title`, `background`, `theme`, `password`, and `questions` array. Question types: `text` (free input), `choice` (multiple choice), `sequence` (order items). Supports per-question images via `image` field.

**Falling data** (`window.FALLING_DATA`): Contains `title`, `section`, `winScore`, `lives`, `winImage`, and `questions` array with simple `{question, answer}` pairs or `{question, correct, wrong[]}` for multiple choice.

**Timeline data** (`window.TIMELINE_DATA`): Contains `title`, `section`, and `rounds` array. Each round has `name` and `events` with `text`, `year`, `detail` fields.

**Consolidated DB** (`window.QUESTIONS_DB`): Mirrors all individual data files. Structure: `{ quiz: { '1-1': {...}, ... }, falling: { 'period-1-starodavnia': {...}, ... }, timeline: { 'period-1-starodavnia': {...}, ... } }`. Keys match the `?id=` param used in templates. When updating questions, edit the individual `data/quiz/`, `data/falling/`, or `data/timeline/` source files, then regenerate `data/questions/questions-db.js`.

**NMT data** (`data/nmt/`): Source of truth is a `.txt` file with a header block and question blocks separated by `---`. Each question block uses `TYPE:`, `TEXT:`, `CORRECT:`, `OPTIONS:`, `ITEMS:`, `CORRECT_ORDER:` directives. Three types supported: `text`, `choice`, `sequence`. Compile to JS with:
```bash
python tools/nmt-import.py data/nmt/CH04-kozatska-doba.txt --output quiz-data > data/nmt/nmt-CH04.js
python tools/nmt-import.py data/nmt/CH04-kozatska-doba.txt --output db-entry   # prints block to paste into questions-db.js
```
The chapter registry `data/nmt/chapters.md` lists all chapters `CH00`–`CH09` in chronological order (Вступ → Стародавня → Київська Русь → … → Козацька → Імперський → Революція → … → Культура), their `period-*` section mapping, and status. Currently готово: CH01, CH02, CH04, CH05, CH06. When adding a new NMT chapter, follow the 5-step process documented in `chapters.md`.

To build a new NMT chapter directly from raw exam files (bulk import without manual curation):
```bash
python tools/build-nmt-chapter.py \
  --code CH07 --name radianskyi \
  --title "НМТ: Радянська Україна" \
  --password "Відлига" \
  --accent "#4a6b8b" \
  data/raw/250416-soviet1.txt data/raw/250416-soviet2.txt
```
This parses all listed raw files, deduplicates (exact + SequenceMatcher >85%), maps question types via an extensible `TYPE_REGISTRY`, and outputs `data/nmt/CH07-radianskyi.txt` + `data/nmt/nmt-CH07.js`. Correct answers are placeholders — `choice` gets the first option, `sequence` gets source order, `text` gets `CORRECT: TODO`. Review and fix answers before publishing.

**Raw NMT data** (`data/raw/`): Unstructured exam texts copied verbatim from source PDFs, named `YYMMDD-{period}.txt`. Process with `tools/process-raw.py` — distinct from `nmt-import.py` because the format has no delimiters or directives. Running without `--output` generates a parsing report and updates `data/problem.md` with any image-reference issues needing manual review:
```bash
python tools/process-raw.py data/raw/250415-ancient.txt                          # report only
python tools/process-raw.py data/raw/250415-ancient.txt --output quiz-data > data/quiz/period-1-nmt.js
python tools/process-raw.py data/raw/250415-ancient.txt --output db-entry        # paste into questions-db.js
```

**Narrative games**: Some have inline data (e.g., `var LEVELS`, `var BUILDINGS`, `const questions`). When adding questions to narrative games, consider extracting to `data/games/` for reusability.
