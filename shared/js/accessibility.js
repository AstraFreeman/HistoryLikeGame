/* accessibility.js — Floating settings panel: theme, font size, motion, contrast.
 * Uses DOM creation methods (no innerHTML). Persists to localStorage.
 */
(function () {
  'use strict';

  var KEYS = {
    theme: 'histgame_theme',
    font: 'histgame_fontsize',
    motion: 'histgame_reducemotion',
    contrast: 'histgame_highcontrast'
  };

  var defaults = {
    theme: 'dark',
    font: 'normal',
    motion: false,
    contrast: false
  };

  function detectSystemDefaults() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      defaults.theme = 'light';
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      defaults.motion = true;
    }
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      defaults.contrast = true;
    }
  }

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function save(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* noop */ }
  }

  function getSettings() {
    return {
      theme: load(KEYS.theme) || defaults.theme,
      font: load(KEYS.font) || defaults.font,
      motion: load(KEYS.motion) === 'true' || (load(KEYS.motion) === null && defaults.motion),
      contrast: load(KEYS.contrast) === 'true' || (load(KEYS.contrast) === null && defaults.contrast)
    };
  }

  function applySettings(s) {
    var html = document.documentElement;
    var body = document.body;

    // Theme
    if (s.theme === 'light') {
      body.classList.add('theme-light');
    } else {
      body.classList.remove('theme-light');
    }

    // Font size
    html.classList.remove('font-lg', 'font-xl');
    if (s.font === 'large') html.classList.add('font-lg');
    else if (s.font === 'xlarge') html.classList.add('font-xl');

    // Reduced motion
    if (s.motion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }

    // High contrast
    if (s.contrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  }

  function saveAll(s) {
    save(KEYS.theme, s.theme);
    save(KEYS.font, s.font);
    save(KEYS.motion, String(s.motion));
    save(KEYS.contrast, String(s.contrast));
  }

  // --- Build UI with DOM methods ---

  function createStyle() {
    var style = document.createElement('style');
    style.textContent = [
      '.a11y-gear{position:fixed;bottom:16px;left:16px;z-index:9999;width:44px;height:44px;',
      'border-radius:50%;border:2px solid rgba(255,255,255,0.2);background:rgba(30,30,50,0.85);',
      'color:#fff;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:transform 0.3s ease,background 0.3s ease;}',
      '.a11y-gear:hover{transform:rotate(90deg);background:rgba(59,130,246,0.8);}',
      '.theme-light .a11y-gear{background:rgba(220,220,215,0.9);color:#1a1a2e;border-color:rgba(0,0,0,0.15);}',
      '.theme-light .a11y-gear:hover{background:rgba(59,130,246,0.8);color:#fff;}',
      '.a11y-panel{position:fixed;bottom:70px;left:16px;z-index:9998;width:280px;',
      'background:rgba(20,20,40,0.95);border:1px solid rgba(255,255,255,0.15);',
      'border-radius:16px;padding:20px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
      'box-shadow:0 8px 32px rgba(0,0,0,0.4);transform:translateY(10px);opacity:0;',
      'pointer-events:none;transition:transform 0.3s ease,opacity 0.3s ease;}',
      '.a11y-panel.open{transform:translateY(0);opacity:1;pointer-events:auto;}',
      '.theme-light .a11y-panel{background:rgba(245,245,240,0.97);border-color:rgba(0,0,0,0.12);',
      'box-shadow:0 8px 32px rgba(0,0,0,0.12);color:#1a1a2e;}',
      '.a11y-title{font-size:15px;font-weight:700;margin-bottom:16px;display:flex;',
      'align-items:center;gap:8px;color:inherit;}',
      '.a11y-row{display:flex;justify-content:space-between;align-items:center;',
      'margin-bottom:12px;font-size:13px;color:inherit;}',
      '.a11y-row:last-child{margin-bottom:0;}',
      '.a11y-toggle{position:relative;width:44px;height:24px;border-radius:12px;',
      'background:rgba(255,255,255,0.15);border:none;cursor:pointer;transition:background 0.2s ease;padding:0;}',
      '.a11y-toggle.on{background:#3b82f6;}',
      '.a11y-toggle-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;',
      'border-radius:50%;background:#fff;transition:left 0.2s ease;pointer-events:none;}',
      '.a11y-toggle.on .a11y-toggle-knob{left:22px;}',
      '.theme-light .a11y-toggle{background:rgba(0,0,0,0.12);}',
      '.a11y-seg{display:flex;gap:4px;}',
      '.a11y-seg-btn{padding:4px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);',
      'background:transparent;color:inherit;font-size:12px;cursor:pointer;transition:all 0.2s ease;}',
      '.a11y-seg-btn.active{background:#3b82f6;color:#fff;border-color:#3b82f6;}',
      '.theme-light .a11y-seg-btn{border-color:rgba(0,0,0,0.15);}',
      '.theme-light .a11y-seg-btn.active{background:#3b82f6;color:#fff;border-color:#3b82f6;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function createToggle(isOn, onChange) {
    var btn = document.createElement('button');
    btn.className = 'a11y-toggle' + (isOn ? ' on' : '');
    btn.type = 'button';
    var knob = document.createElement('span');
    knob.className = 'a11y-toggle-knob';
    btn.appendChild(knob);
    btn.addEventListener('click', function () {
      var nowOn = !btn.classList.contains('on');
      btn.classList.toggle('on', nowOn);
      onChange(nowOn);
    });
    return btn;
  }

  function createSegmented(options, activeValue, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'a11y-seg';
    var btns = [];
    options.forEach(function (opt) {
      var b = document.createElement('button');
      b.className = 'a11y-seg-btn' + (opt.value === activeValue ? ' active' : '');
      b.type = 'button';
      b.textContent = opt.label;
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        onChange(opt.value);
      });
      btns.push(b);
      wrap.appendChild(b);
    });
    return wrap;
  }

  function createRow(labelText, control) {
    var row = document.createElement('div');
    row.className = 'a11y-row';
    var label = document.createElement('span');
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(control);
    return row;
  }

  function buildPanel(settings) {
    var panel = document.createElement('div');
    panel.className = 'a11y-panel';

    var title = document.createElement('div');
    title.className = 'a11y-title';
    title.textContent = 'Налаштування';
    panel.appendChild(title);

    // Theme toggle
    var themeToggle = createSegmented(
      [{ label: 'Темна', value: 'dark' }, { label: 'Світла', value: 'light' }],
      settings.theme,
      function (val) { settings.theme = val; saveAll(settings); applySettings(settings); }
    );
    panel.appendChild(createRow('Тема', themeToggle));

    // Font size
    var fontSeg = createSegmented(
      [{ label: 'A', value: 'normal' }, { label: 'A+', value: 'large' }, { label: 'A++', value: 'xlarge' }],
      settings.font,
      function (val) { settings.font = val; saveAll(settings); applySettings(settings); }
    );
    panel.appendChild(createRow('Розмір тексту', fontSeg));

    // Reduced motion
    var motionToggle = createToggle(settings.motion, function (on) {
      settings.motion = on;
      saveAll(settings);
      applySettings(settings);
    });
    panel.appendChild(createRow('Менше анімацій', motionToggle));

    // High contrast
    var contrastToggle = createToggle(settings.contrast, function (on) {
      settings.contrast = on;
      saveAll(settings);
      applySettings(settings);
    });
    panel.appendChild(createRow('Висока контрастність', contrastToggle));

    return panel;
  }

  function init() {
    detectSystemDefaults();
    var settings = getSettings();

    createStyle();
    applySettings(settings);

    // Gear button
    var gear = document.createElement('button');
    gear.className = 'a11y-gear';
    gear.type = 'button';
    gear.setAttribute('aria-label', 'Налаштування доступності');
    gear.textContent = '\u2699';

    // Panel
    var panel = buildPanel(settings);

    gear.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== gear) {
        panel.classList.remove('open');
      }
    });

    document.body.appendChild(panel);
    document.body.appendChild(gear);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
