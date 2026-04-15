/* game-engine.js — Reusable falling-answer game engine
 *
 * Usage:
 *   <script src="shared/js/game-engine.js"></script>
 *   <script>
 *     FallingGame.init({
 *       questions: [ { question: "...", answer: "1648" }, ... ],
 *       lives: 3,
 *       winScore: 15,
 *       dropSpeed: 1,
 *       addInterval: 5000,
 *       maxActive: 5,
 *       winImage: 'image/Cossack.jpg',
 *       shuffle: true,  // NEW: randomize question order (default: false)
 *       gameAreaId: 'gameArea',
 *       inputId: 'input',
 *       scoreId: 'score',
 *       livesId: 'lives',
 *       startBtnId: 'startButton',
 *       restartBtnId: 'restartButton',
 *       exitBtnId: 'exitButton',
 *       answersListId: 'answersList',
 *       winOverlayId: 'winOverlay',
 *       winMessageId: 'winMessage',
 *       loseOverlayId: 'loseOverlay',
 *       loseMessageId: 'loseMessage'
 *     });
 *   </script>
 */

(function () {
  'use strict';

  // Fisher-Yates shuffle
  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  var cfg, els;
  var activeQuestions = [];
  var usedQuestions = new Set();
  var score = 0;
  var lives = 0;
  var gameInterval = null;
  var dropInterval = null;
  var shuffleIndex = 0;  // For sequential mode when shuffle=true

  function getEl(id) {
    return id ? document.getElementById(id) : null;
  }

  function init(config) {
    cfg = {
      questions: config.questions || [],
      lives: config.lives || 3,
      winScore: config.winScore || 15,
      dropSpeed: config.dropSpeed || 1,
      addInterval: config.addInterval || 5000,
      maxActive: config.maxActive || 5,
      winImage: config.winImage || '',
      shuffle: config.shuffle === true  // NEW: enable shuffling
    };

    // NEW: Shuffle questions if requested
    if (cfg.shuffle && cfg.questions.length > 1) {
      cfg.questions = shuffleArray(cfg.questions.slice());
    }

    els = {
      gameArea: getEl(config.gameAreaId || 'gameArea'),
      input: getEl(config.inputId || 'input'),
      score: getEl(config.scoreId || 'score'),
      lives: getEl(config.livesId || 'lives'),
      startBtn: getEl(config.startBtnId || 'startButton'),
      restartBtn: getEl(config.restartBtnId || 'restartButton'),
      exitBtn: getEl(config.exitBtnId || 'exitButton'),
      answersList: getEl(config.answersListId || 'answersList'),
      winOverlay: getEl(config.winOverlayId || 'winOverlay'),
      winMessage: getEl(config.winMessageId || 'winMessage'),
      loseOverlay: getEl(config.loseOverlayId || 'loseOverlay'),
      loseMessage: getEl(config.loseMessageId || 'loseMessage'),
      pauseMenu: getEl(config.pauseMenuId || 'pauseMenu'),
      resumeBtn: getEl(config.resumeBtnId || 'resumeButton')
    };

    bindEvents();
  }

  function bindEvents() {
    if (els.startBtn) els.startBtn.addEventListener('click', startGame);
    if (els.restartBtn) els.restartBtn.addEventListener('click', function () {
      resetGame();
      startGame();
    });
    if (els.exitBtn) els.exitBtn.addEventListener('click', function () {
      resetGame();
      alert('\u0412\u0438 \u0432\u0438\u0439\u0448\u043B\u0438 \u0437 \u0433\u0440\u0438. \u0414\u043E \u0437\u0443\u0441\u0442\u0440\u0456\u0447\u0456!');
    });
    if (els.resumeBtn) els.resumeBtn.addEventListener('click', resumeGame);

    if (els.input) {
      els.input.addEventListener('input', function () {
        checkAnswer(els.input.value.trim());
      });
    }

    // Numpad buttons
    var numButtons = document.querySelectorAll('.num-btn, .numButton');
    numButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-value');
        if (val !== null && els.input) {
          els.input.value += val;
          checkAnswer(els.input.value.trim());
        }
      });
    });

    // Clear button
    var clearBtn = document.getElementById('clearButton');
    if (clearBtn && els.input) {
      clearBtn.addEventListener('click', function () {
        els.input.value = '';
      });
    }

    // Overlay dismiss
    if (els.winOverlay) els.winOverlay.addEventListener('click', hideWin);
    if (els.loseOverlay) els.loseOverlay.addEventListener('click', hideLose);
  }

  function startGame() {
    if (window.HLGAnalytics) HLGAnalytics.startSession();
    resetGame();
    if (els.input) {
      els.input.disabled = false;
      els.input.focus();
    }
    if (els.startBtn) els.startBtn.disabled = true;
    if (els.restartBtn) els.restartBtn.disabled = false;

    addQuestion();
    gameInterval = setInterval(addQuestion, cfg.addInterval);
    dropInterval = setInterval(moveQuestions, 50);
  }

  function resetGame() {
    activeQuestions.forEach(function (q) { q.element.remove(); });
    activeQuestions = [];
    usedQuestions.clear();
    shuffleIndex = 0;  // NEW: reset sequential index
    score = 0;
    lives = cfg.lives;
    updateUI();
    if (els.answersList) els.answersList.textContent = '';
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    if (els.input) els.input.value = '';
    hideWin();
    hideLose();
  }

  function addQuestion() {
    if (activeQuestions.length >= cfg.maxActive) return;

    var data;

    // NEW: Sequential selection when shuffle mode enabled
    if (cfg.shuffle) {
      if (shuffleIndex >= cfg.questions.length) {
        shuffleIndex = 0;
      }
      data = cfg.questions[shuffleIndex];
      shuffleIndex++;
    } else {
      // Original random selection logic
      if (usedQuestions.size >= cfg.questions.length) {
        usedQuestions.clear();
      }

      var available = cfg.questions.filter(function (q) {
        return !usedQuestions.has(q.question);
      });
      if (available.length === 0) return;

      data = available[Math.floor(Math.random() * available.length)];
      usedQuestions.add(data.question);
    }

    var el = document.createElement('div');
    el.className = 'falling-question';
    el.textContent = data.question;

    var areaWidth = els.gameArea ? els.gameArea.offsetWidth : 500;
    var startX = Math.random() * (areaWidth - 150);
    el.style.left = startX + 'px';
    el.style.top = '0px';

    if (els.gameArea) els.gameArea.appendChild(el);

    activeQuestions.push({
      question: data.question,
      answer: data.answer,
      element: el,
      top: 0
    });
  }

  function moveQuestions() {
    var areaHeight = els.gameArea ? els.gameArea.offsetHeight : 400;

    for (var i = activeQuestions.length - 1; i >= 0; i--) {
      var q = activeQuestions[i];
      q.top += cfg.dropSpeed;
      q.element.style.top = q.top + 'px';

      if (q.top > areaHeight) {
        addMissedAnswer(q.question, q.answer);
        q.element.remove();
        activeQuestions.splice(i, 1);
        loseLife();
      }
    }
  }

  function addMissedAnswer(question, answer) {
    if (!els.answersList) return;
    var item = document.createElement('div');
    item.className = 'answer-item';

    var strong = document.createElement('strong');
    strong.textContent = question;
    item.appendChild(strong);

    var span = document.createElement('span');
    span.textContent = '\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C: ' + answer;
    item.appendChild(span);

    els.answersList.appendChild(item);
    els.answersList.scrollTop = els.answersList.scrollHeight;
  }

  function loseLife() {
    lives--;
    updateUI();
    if (lives <= 0) {
      endGame(false);
    }
  }

  function checkAnswer(input) {
    if (!input) return;
    var idx = -1;
    for (var i = 0; i < activeQuestions.length; i++) {
      if (activeQuestions[i].answer.toLowerCase() === input.toLowerCase()) {
        idx = i;
        break;
      }
    }

    if (idx !== -1) {
      activeQuestions[idx].element.remove();
      activeQuestions.splice(idx, 1);
      score++;
      updateUI();
      if (els.input) els.input.value = '';

      if (score >= cfg.winScore) {
        endGame(true);
      }
    }
  }

  function endGame(isWin) {
    if (window.HLGAnalytics) HLGAnalytics.endSession({ score: score, won: isWin });
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    activeQuestions.forEach(function (q) { q.element.remove(); });
    activeQuestions = [];
    if (els.input) els.input.disabled = true;

    if (isWin) {
      showWin();
    } else {
      showLose();
    }

    if (els.restartBtn) els.restartBtn.disabled = true;
    if (els.startBtn) els.startBtn.disabled = false;
  }

  function showWin() {
    if (els.winOverlay) els.winOverlay.classList.add('active');
    if (els.winMessage) els.winMessage.classList.add('active');
  }

  function hideWin() {
    if (els.winOverlay) els.winOverlay.classList.remove('active');
    if (els.winMessage) els.winMessage.classList.remove('active');
  }

  function showLose() {
    if (els.loseOverlay) els.loseOverlay.classList.add('active');
    if (els.loseMessage) els.loseMessage.classList.add('active');
  }

  function hideLose() {
    if (els.loseOverlay) els.loseOverlay.classList.remove('active');
    if (els.loseMessage) els.loseMessage.classList.remove('active');
  }

  function pauseGame() {
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    if (els.pauseMenu) els.pauseMenu.style.display = 'block';
  }

  function resumeGame() {
    if (els.pauseMenu) els.pauseMenu.style.display = 'none';
    gameInterval = setInterval(addQuestion, cfg.addInterval);
    dropInterval = setInterval(moveQuestions, 50);
  }

  function updateUI() {
    if (els.score) els.score.textContent = score;
    if (els.lives) els.lives.textContent = lives;
  }

  window.FallingGame = {
    init: init,
    startGame: startGame,
    resetGame: resetGame,
    pauseGame: pauseGame,
    resumeGame: resumeGame
  };
})();
