/* assistant.js — Octopus mascot: keyboard movement, click interactions, GIF states,
 * navigation helper, secret triggers.
 * Gracefully no-ops when octopus element is missing.
 * Uses window.ASSISTANT_FACTS if available (from data/assistant/facts.js).
 */

(function () {
  'use strict';

  var assistantElement = null;
  var moveSpeed = 20;
  var currentState = 'idle'; // 'idle' | 'move' | 'dance'
  var moveTimeout = null;
  var basePath = 'assets/images/';
  var keyHoldStart = 0;
  var musicPlaying = false;
  var sugarAudio = null;

  // Pre-cached Image objects to prevent GIF flicker
  var cachedImages = {};
  var gifFiles = {
    idle: 'Sprut_Idle.gif',
    move: 'Sprut_Move.gif',
    dance: 'Sprut_Dance.gif'
  };

  // Secret triggers — regions that unlock easter eggs
  var secrets = {
    'top-left': { found: false, message: 'Ти знайшов таємний куток! Тут ховається стародавній скарб знань.' },
    'top-right': { found: false, message: 'Секрет розкрито! Чи знаєш ти, що козаки мали власну дипломатичну пошту?' },
    'bottom-left': { found: false, message: 'Схованка відкрита! Перша друкарня в Україні з\'явилася у Львові в 1573 році.' }
  };

  // Navigation tracking
  var VISITED_KEY = 'histgame_visited_pages';
  var SECRETS_KEY = 'histgame_secrets';

  function preloadImages() {
    for (var state in gifFiles) {
      var img = new Image();
      img.src = basePath + gifFiles[state];
      cachedImages[state] = img;
    }
  }

  function setState(newState) {
    if (newState === currentState || !assistantElement) return;
    currentState = newState;
    if (cachedImages[newState] && cachedImages[newState].src) {
      assistantElement.src = cachedImages[newState].src;
    }
  }

  function initAssistant(octopusElement, options) {
    if (!octopusElement) return false;

    assistantElement = octopusElement;

    // Allow custom base path for pages in subdirectories
    if (options && options.basePath) {
      basePath = options.basePath;
    }

    preloadImages();
    setupKeyboardControls();
    trackPageVisit();
    loadSecrets();

    return true;
  }

  function setupKeyboardControls() {
    document.addEventListener('keydown', function (event) {
      if (!assistantElement || assistantElement.classList.contains('hidden')) return;
      // Don't intercept arrows when user is in an input or game canvas
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      var rect = assistantElement.getBoundingClientRect();
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var currentRight = parseInt(window.getComputedStyle(assistantElement).right) || 20;
      var currentBottom = parseInt(window.getComputedStyle(assistantElement).bottom) || 20;
      var moved = false;

      switch (event.key) {
        case 'ArrowUp':
          if (rect.top > 0) {
            assistantElement.style.bottom = (currentBottom + moveSpeed) + 'px';
            moved = true;
          }
          break;
        case 'ArrowDown':
          if (rect.bottom < windowHeight) {
            assistantElement.style.bottom = (currentBottom - moveSpeed) + 'px';
            moved = true;
          }
          break;
        case 'ArrowLeft':
          if (rect.left > 0) {
            assistantElement.style.right = (currentRight + moveSpeed) + 'px';
            assistantElement.style.transform = 'scaleX(1)';
            moved = true;
          }
          break;
        case 'ArrowRight':
          if (rect.right < windowWidth) {
            assistantElement.style.right = (currentRight - moveSpeed) + 'px';
            assistantElement.style.transform = 'scaleX(-1)';
            moved = true;
          }
          break;
      }

      if (moved) {
        setState('move');
        // Clear previous timeout so we don't flicker back prematurely
        if (moveTimeout) clearTimeout(moveTimeout);
        moveTimeout = setTimeout(function () {
          setState('idle');
          moveTimeout = null;
        }, 500);

        // Check secret triggers after movement
        checkSecretTriggers();
      }

      // Track arrow key hold for music
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.key) !== -1) {
          if (keyHoldStart === 0) {
              keyHoldStart = Date.now();
          }
          if (Date.now() - keyHoldStart >= 5000 && !musicPlaying) {
              try {
                  var musicPath = basePath.replace('images/', 'music/') + 'sugar_slowed.mp3';
                  if (!musicPath.includes('music/')) {
                      musicPath = basePath + '../music/sugar_slowed.mp3';
                  }
                  sugarAudio = new Audio(musicPath);
                  sugarAudio.play().catch(function() {});
                  musicPlaying = true;
                  sugarAudio.addEventListener('ended', function() {
                      musicPlaying = false;
                  });
              } catch(e) { /* audio unavailable */ }
          }
      }
    });

    document.addEventListener('keyup', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.key) !== -1) {
            keyHoldStart = 0;
        }
    });
  }

  // --- Navigation helper ---

  function trackPageVisit() {
    try {
      var visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '{}');
      visited[window.location.pathname] = Date.now();
      localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
    } catch (e) { /* localStorage unavailable */ }
  }

  function getUnvisitedGames() {
    var allGames = [
      { name: 'Хронобій', path: 'games/narrative/washhand-1.html' },
      { name: 'Іст. block buster', path: 'games/narrative/new-makako-2.html' },
      { name: 'Стародавня історія', path: 'games/narrative/shiwafornia-2.html' },
      { name: 'Русь-Україна', path: 'games/narrative/new-orlan-1.html' },
      { name: 'Кара вікінга', path: 'games/narrative/masachuchi/masachuchi.html' },
      { name: 'ВКЛ вікторина', path: 'games/narrative/taxes-1.html' },
      { name: 'Історична косинка v2', path: 'games/narrative/solitaire-v2.html' },
      { name: 'Bobble Shooter', path: 'games/narrative/bobble-shooter.html' },
      { name: 'Українська революція', path: 'games/narrative/viraska.html' },
      { name: 'Історичний пазл', path: 'games/narrative/puzzle-phenikis.html' },
      { name: 'Характерне кафе', path: 'games/narrative/kafe-simulator.html' },
      { name: 'Пасянс', path: 'games/narrative/los-elviros-1.html' },
      { name: 'Різдвяна вікторина', path: 'games/quiz-hub/crstm-s-main.html' }
    ];

    try {
      var visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '{}');
      return allGames.filter(function (game) {
        // Check if any visited path ends with the game path
        for (var key in visited) {
          if (key.indexOf(game.path) !== -1) return false;
        }
        return true;
      });
    } catch (e) {
      return allGames;
    }
  }

  function suggestGame() {
    var unvisited = getUnvisitedGames();
    if (unvisited.length === 0) {
      return 'Ти вже відвідав усі ігри! Спробуй пройти їх ще раз на кращий результат.';
    }
    var game = unvisited[Math.floor(Math.random() * unvisited.length)];
    return 'Спробуй гру "' + game.name + '"! Ти ще не грав у неї.';
  }

  // --- Secret triggers ---

  function loadSecrets() {
    try {
      var saved = JSON.parse(localStorage.getItem(SECRETS_KEY) || '{}');
      for (var key in saved) {
        if (secrets[key]) secrets[key].found = saved[key];
      }
    } catch (e) { /* ignore */ }
  }

  function saveSecrets() {
    try {
      var data = {};
      for (var key in secrets) {
        data[key] = secrets[key].found;
      }
      localStorage.setItem(SECRETS_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function checkSecretTriggers() {
    if (!assistantElement) return;
    var rect = assistantElement.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var threshold = 80;

    var triggered = null;

    if (cx < threshold && cy < threshold && !secrets['top-left'].found) {
      secrets['top-left'].found = true;
      triggered = secrets['top-left'];
    } else if (cx > w - threshold && cy < threshold && !secrets['top-right'].found) {
      secrets['top-right'].found = true;
      triggered = secrets['top-right'];
    } else if (cx < threshold && cy > h - threshold && !secrets['bottom-left'].found) {
      secrets['bottom-left'].found = true;
      triggered = secrets['bottom-left'];
    }

    if (triggered) {
      saveSecrets();
      showSpeechBubble(triggered.message, 5000);
      if (getDiscoveredSecretsCount() === 3) {
          setTimeout(function() { showPasswordInput(); }, 5500);
      }
    }
  }

  function getDiscoveredSecretsCount() {
    var count = 0;
    for (var key in secrets) {
      if (secrets[key].found) count++;
    }
    return count;
  }

  // --- Speech bubble ---

  function showSpeechBubble(text, duration) {
    duration = duration || 8000;
    var factBox = document.getElementById('factBox');
    if (factBox) {
      factBox.textContent = text;
      factBox.classList.remove('hidden');
      setTimeout(function () {
        factBox.classList.add('hidden');
      }, duration);
    }
  }

  // --- Click handler (uses external facts if available) ---

  function onAssistantClick() {
    var messages;

    // Use external facts database if available
    if (window.ASSISTANT_FACTS) {
      var facts = window.ASSISTANT_FACTS;
      var pool = (facts.general || []).slice();

      // Add current page section facts if we can detect the period
      var bodyEl = document.body;
      var section = bodyEl && bodyEl.getAttribute('data-section');
      if (facts.byPeriod) {
        // On index page, pick from all periods
        for (var p in facts.byPeriod) {
          pool = pool.concat(facts.byPeriod[p]);
        }
      }
      messages = pool;
    }

    // Fallback messages
    if (!messages || messages.length === 0) {
      messages = [
        'Привіт! Використовуй стрілки на клавіатурі, щоб переміщати мене!',
        'Натискай кнопки внизу для взаємодії!',
        'Обирай історичні періоди та вивчай історію України!',
        'Цікаві факти чекають на тебе!'
      ];
    }

    // Every 3rd click, suggest an unvisited game instead
    onAssistantClick._count = (onAssistantClick._count || 0) + 1;
    var text;
    if (onAssistantClick._count % 3 === 0) {
      text = suggestGame();
    } else {
      text = messages[Math.floor(Math.random() * messages.length)];
    }

    var secretsFound = getDiscoveredSecretsCount();
    if (secretsFound > 0 && secretsFound < 3 && onAssistantClick._count % 5 === 0) {
      text = 'Ти знайшов ' + secretsFound + '/3 секретів! Шукай інші — рухай мене по кутках екрану.';
    }

    showSpeechBubble(text);
  }

  function isAssistantMoving() {
    return currentState === 'move';
  }

  function showPasswordInput() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:10000;backdrop-filter:blur(8px);';

    var label = document.createElement('p');
    label.textContent = 'Введіть пароль';
    label.style.cssText = 'color:#ffd700;font-size:var(--text-2xl);margin-bottom:15px;font-weight:bold;';
    overlay.appendChild(label);

    var hint = document.createElement('p');
    hint.textContent = 'Підказка: Люблю історію';
    hint.style.cssText = 'color:#aaa;font-size:var(--text-base);margin-bottom:20px;';
    overlay.appendChild(hint);

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Пароль...';
    input.style.cssText = 'padding:12px 20px;font-size:var(--text-lg);border-radius:8px;border:2px solid #ffd700;background:rgba(255,255,255,0.1);color:white;text-align:center;width:280px;';
    overlay.appendChild(input);

    var msg = document.createElement('p');
    msg.style.cssText = 'color:#ff6b6b;font-size:var(--text-sm);margin-top:10px;min-height:20px;';
    overlay.appendChild(msg);

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:12px;margin-top:15px;';

    var submitBtn = document.createElement('button');
    submitBtn.textContent = 'Підтвердити';
    submitBtn.style.cssText = 'padding:12px 30px;font-size:var(--text-base);background:linear-gradient(135deg,#ffd700,#ffa500);border:none;border-radius:8px;color:#2d3748;font-weight:bold;cursor:pointer;';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрити';
    closeBtn.style.cssText = 'padding:12px 30px;font-size:var(--text-base);background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.3);border-radius:8px;color:white;cursor:pointer;';

    btnRow.appendChild(submitBtn);
    btnRow.appendChild(closeBtn);
    overlay.appendChild(btnRow);

    submitBtn.addEventListener('click', function() {
        if (input.value === 'L0v3 H1sT0r') {
            try { localStorage.setItem('histgame_christmas_unlocked', 'true'); } catch(e) {}
            msg.style.color = '#22c55e';
            msg.textContent = 'Правильно! Різдвяний розділ розблоковано!';
            // Try to reveal Christmas section if on index page
            var christmasSection = document.getElementById('christmas-section');
            if (christmasSection) christmasSection.style.display = '';
            setTimeout(function() { overlay.remove(); }, 2000);
        } else {
            msg.style.color = '#ff6b6b';
            msg.textContent = 'Невірний пароль. Спробуйте ще раз.';
            input.value = '';
        }
    });

    closeBtn.addEventListener('click', function() { overlay.remove(); });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') submitBtn.click();
    });

    document.body.appendChild(overlay);
    setTimeout(function() { input.focus(); }, 100);
  }

  window.initAssistant = initAssistant;
  window.onAssistantClick = onAssistantClick;
  window.isAssistantMoving = isAssistantMoving;
})();
