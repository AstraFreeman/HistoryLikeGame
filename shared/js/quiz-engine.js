/* quiz-engine.js — Reusable quiz logic for password-gated question pages
 *
 * Usage:
 *   <script src="shared/js/quiz-engine.js"></script>
 *   <script>
 *     QuizGame.init({
 *       questions: [
 *         { id: 'answer1', type: 'text', correct: '1709' },
 *         { id: 'q2', type: 'choice', group: 'MRK', correct: 'Автономія' },
 *         { id: 'q3', type: 'choice', group: 'style', correct: 'бароко' }
 *       ],
 *       password: 'Скоропадський Іван',
 *       passwordBlockId: 'passwordBlock',
 *       passwordDisplayId: 'password'
 *     });
 *   </script>
 */

(function () {
  'use strict';

  var selections = {};

  function selectAnswer(button, answer, group) {
    var buttons = button.parentElement.querySelectorAll('.option-btn, button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('selected');
    }
    button.classList.add('selected');
    selections[group] = answer;
  }

  function setTheme(theme) {
    var root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--color-bg-primary', '#f4f4f9');
      root.style.setProperty('--color-text-primary', '#333');
      root.style.setProperty('--game-accent', '#007bff');
    } else if (theme === 'dark') {
      root.style.setProperty('--color-bg-primary', '#1a1a2e');
      root.style.setProperty('--color-text-primary', '#f1f5f9');
      root.style.setProperty('--game-accent', '#f97316');
    }
  }

  function init(config) {
    var questions = config.questions || [];
    var password = config.password || '';
    var blockId = config.passwordBlockId || 'passwordBlock';
    var displayId = config.passwordDisplayId || 'password';

    // Store config for check
    window._quizConfig = {
      questions: questions,
      password: password,
      blockId: blockId,
      displayId: displayId
    };
  }

  function checkAnswers() {
    var cfg = window._quizConfig;
    if (!cfg) return false;

    var allCorrect = true;

    for (var i = 0; i < cfg.questions.length; i++) {
      var q = cfg.questions[i];

      if (q.type === 'text') {
        var input = document.getElementById(q.id);
        if (!input || input.value.trim() !== q.correct) {
          allCorrect = false;
          break;
        }
      } else if (q.type === 'choice') {
        if (selections[q.group] !== q.correct) {
          allCorrect = false;
          break;
        }
      }
    }

    if (allCorrect) {
      var block = document.getElementById(cfg.blockId);
      var display = document.getElementById(cfg.displayId);
      if (display) display.textContent = cfg.password;
      if (block) block.style.display = 'block';
      return true;
    } else {
      alert('\u041D\u0435 \u0432\u0441\u0456 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437!');
      return false;
    }
  }

  window.QuizGame = {
    init: init,
    checkAnswers: checkAnswers,
    selectAnswer: selectAnswer,
    setTheme: setTheme
  };
})();
