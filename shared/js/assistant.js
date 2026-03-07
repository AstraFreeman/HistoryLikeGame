/* assistant.js — Octopus mascot: keyboard movement, click interactions, GIF states
 * Gracefully no-ops when octopus element is missing.
 */

(function () {
  'use strict';

  var assistantElement = null;
  var moveSpeed = 20;
  var isMovingByKeyboard = false;

  function initAssistant(octopusElement) {
    if (!octopusElement) {
      return false;
    }

    assistantElement = octopusElement;
    setupKeyboardControls();
    return true;
  }

  function setupKeyboardControls() {
    document.addEventListener('keydown', function (event) {
      if (!assistantElement || assistantElement.classList.contains('hidden')) {
        return;
      }

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
        isMovingByKeyboard = true;
        assistantElement.src = 'assets/images/Sprut_Move.gif';

        setTimeout(function () {
          if (isMovingByKeyboard) {
            assistantElement.src = 'assets/images/Sprut_Idle.gif';
            isMovingByKeyboard = false;
          }
        }, 500);
      }
    });
  }

  function onAssistantClick() {
    var messages = [
      '\u041F\u0440\u0438\u0432\u0456\u0442! \u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0439 \u0441\u0442\u0440\u0456\u043B\u043A\u0438 \u043D\u0430 \u043A\u043B\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456, \u0449\u043E\u0431 \u043F\u0435\u0440\u0435\u043C\u0456\u0449\u0430\u0442\u0438 \u043C\u0435\u043D\u0435!',
      '\u041D\u0430\u0442\u0438\u0441\u043A\u0430\u0439 \u043A\u043D\u043E\u043F\u043A\u0438 \u0432\u043D\u0438\u0437\u0443 \u0434\u043B\u044F \u0432\u0437\u0430\u0454\u043C\u043E\u0434\u0456\u0457!',
      '\u041E\u0431\u0438\u0440\u0430\u0439 \u0456\u0441\u0442\u043E\u0440\u0438\u0447\u043D\u0456 \u043F\u0435\u0440\u0456\u043E\u0434\u0438 \u0442\u0430 \u0432\u0438\u0432\u0447\u0430\u0439 \u0456\u0441\u0442\u043E\u0440\u0456\u044E \u0423\u043A\u0440\u0430\u0457\u043D\u0438!',
      '\u0426\u0456\u043A\u0430\u0432\u0456 \u0444\u0430\u043A\u0442\u0438 \u0447\u0435\u043A\u0430\u044E\u0442\u044C \u043D\u0430 \u0442\u0435\u0431\u0435!'
    ];

    var factBox = document.getElementById('factBox');
    if (factBox) {
      factBox.textContent = messages[Math.floor(Math.random() * messages.length)];
      factBox.classList.remove('hidden');
      setTimeout(function () {
        factBox.classList.add('hidden');
      }, 3000);
    }
  }

  function isAssistantMoving() {
    return isMovingByKeyboard;
  }

  window.initAssistant = initAssistant;
  window.onAssistantClick = onAssistantClick;
  window.isAssistantMoving = isAssistantMoving;
})();
