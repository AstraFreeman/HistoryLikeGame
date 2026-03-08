# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Історія як гра" (History as a Game) — a Ukrainian-language educational web project that teaches Ukrainian history through interactive browser-based games. Pure static HTML/CSS/JS with no build system, package manager, or test framework.

## Running the Project

Open any HTML file directly in a browser, or serve with any static file server:
```bash
python3 -m http.server 8000
```
The entry point is `index.html`.

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
    canvas-utils.js           # window.CanvasUtils — canvas helpers
    ui-utils.js               # window.UIUtils — modal/notification helpers
    assistant.js              # Octopus mascot (keyboard movement, GIF states)
    accessibility.js          # Floating accessibility settings panel
  templates/
    quiz-question.html        # Template for quiz pages, loads data via ?id= param
    falling-answer.html       # Template for falling-answer games, loads data via ?id=
data/
  quiz/                       # 23 quiz data files (crstm-s-{row}-{col}.js)
  falling/                    # 3 falling-game data files (period-{n}-{name}.js)
  assistant/                  # Assistant facts database
  games/                      # Game-specific data files (solitaire, bobble, puzzle, kafe)
games/
  narrative/                  # Story-driven, interactive, and unique game pages
    masachuchi/               # Apple-catching canvas game (own image/ subdir)
    new-makako-1/             # Falling game variant (own styles.css, script.js)
    tower-defense.html        # Three.js tower defense game (Period 5)
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
```

## Architecture

**Hub-and-spoke:** `index.html` links to all games. Games use shared CSS/JS via `<link>` and `<script>` tags (no ES modules — must work with `file://`).

**Shared JS modules** attach APIs to `window.*`:
- `window.QuizGame.init(config)` — quiz engine
- `window.FallingGame.init(config)` — falling-answer engine
- `window.CanvasUtils` — canvas helpers
- `window.UIUtils` — modal/notification helpers
- `accessibility.js` — auto-injected floating settings panel (theme, font, motion, contrast)

**Navigation** via `nav.js`: reads `data-section`, `data-game-title`, `data-home-url` from `<body>`. Use `data-nav="overlay"` for fullscreen games (floating button), `data-nav="false"` to skip. AR pages use an inline floating `<a>` tag instead.

**Quiz template system:** `shared/templates/quiz-question.html?id=1-1` dynamically loads `data/quiz/crstm-s-1-1.js` which sets `window.QUIZ_DATA`. Same pattern for falling games.

**CSS theming:** `theme.css` defines CSS custom properties. Pages can override with `--game-accent`, `--game-bg` etc. Dark glassmorphism base with vibrant accents.

## Key Conventions

- **Language:** All UI text in Ukrainian. Only first word in a sentence capitalized (Ukrainian rule)
- **No build step:** Files served as-is. No transpilation, bundling, or minification
- **Naming:** kebab-case for files and directories
- **AR pages** depend on CDN-hosted A-Frame and AR.js libraries
- **Paths from game pages:** Games in `games/*/` use `../../shared/`, `../../assets/` etc.

## Accessibility

`shared/js/accessibility.js` creates a floating gear button on all pages with settings:
- **Theme:** dark/light (CSS class `.theme-light` on `<body>`)
- **Font size:** normal/large/xlarge (`.font-lg`, `.font-xl` on `<html>`)
- **Reduced motion:** (`.reduce-motion` on `<html>`)
- **High contrast:** (`.high-contrast` on `<html>`)

Persists to localStorage keys: `histgame_theme`, `histgame_fontsize`, `histgame_reducemotion`, `histgame_highcontrast`.

Early theme detection `<script>` in `<head>` of `index.html` prevents FOUC. Uses safe DOM creation methods (no innerHTML).
