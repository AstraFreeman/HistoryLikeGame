/* timeline-engine.js — Reusable chronological sorting game engine
 *
 * Usage:
 *   <script src="shared/js/timeline-engine.js"></script>
 *   <script>
 *     TimelineGame.init({
 *       rounds: [ { name: '...', events: [ { text: '...', year: '1917', detail: '...' }, ... ] } ],
 *       containerId: 'eventList',
 *       checkBtnId: 'checkBtn',
 *       hintBtnId: 'hintBtn',
 *       resetBtnId: 'resetBtn',
 *       scoreId: 'score',
 *       roundId: 'round',
 *       attemptsId: 'attempts'
 *     });
 *   </script>
 */

(function () {
  'use strict';

  var cfg, els;
  var currentRound = 0;
  var score = 0;
  var attempts = 0;
  var correctOrder = [];
  var hintsUsed = 0;

  function getEl(id) {
    return id ? document.getElementById(id) : null;
  }

  function init(config) {
    cfg = {
      rounds: config.rounds || [],
      title: config.title || ''
    };

    els = {
      container: getEl(config.containerId || 'eventList'),
      checkBtn: getEl(config.checkBtnId || 'checkBtn'),
      hintBtn: getEl(config.hintBtnId || 'hintBtn'),
      resetBtn: getEl(config.resetBtnId || 'resetBtn'),
      score: getEl(config.scoreId || 'score'),
      round: getEl(config.roundId || 'round'),
      attempts: getEl(config.attemptsId || 'attempts'),
      roundName: getEl(config.roundNameId || 'roundName'),
      totalRounds: getEl(config.totalRoundsId || 'totalRounds')
    };

    if (els.totalRounds) els.totalRounds.textContent = cfg.rounds.length;

    if (els.checkBtn) els.checkBtn.addEventListener('click', checkOrder);
    if (els.hintBtn) els.hintBtn.addEventListener('click', giveHint);
    if (els.resetBtn) els.resetBtn.addEventListener('click', resetRound);

    currentRound = 0;
    score = 0;
    attempts = 0;
    loadRound();
    if (window.HLGAnalytics) HLGAnalytics.startSession();
  }

  function loadRound() {
    if (currentRound >= cfg.rounds.length) {
      showFinalResult();
      return;
    }

    var round = cfg.rounds[currentRound];
    hintsUsed = 0;

    // Store correct order
    correctOrder = round.events.slice();

    // Shuffle events
    var shuffled = round.events.slice();
    shuffleArray(shuffled);

    // Avoid giving the correct order by accident
    if (shuffled.length > 1 && arraysEqual(shuffled, correctOrder)) {
      var tmp = shuffled[0];
      shuffled[0] = shuffled[shuffled.length - 1];
      shuffled[shuffled.length - 1] = tmp;
    }

    renderEvents(shuffled);
    updateUI();

    if (els.roundName) els.roundName.textContent = round.name || '';
    if (els.checkBtn) els.checkBtn.disabled = false;
    if (els.hintBtn) els.hintBtn.disabled = false;
  }

  function renderEvents(events) {
    if (!els.container) return;
    els.container.textContent = '';

    events.forEach(function (ev, i) {
      var item = document.createElement('div');
      item.className = 'timeline-item';
      item.setAttribute('draggable', 'true');
      item.dataset.index = i;
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'listitem');
      item.setAttribute('aria-label', ev.text);

      var handle = document.createElement('span');
      handle.className = 'timeline-handle';
      handle.textContent = '\u2630';
      item.appendChild(handle);

      var textEl = document.createElement('span');
      textEl.className = 'timeline-text';
      textEl.textContent = ev.text;
      item.appendChild(textEl);

      var yearEl = document.createElement('span');
      yearEl.className = 'timeline-year';
      yearEl.style.visibility = 'hidden';
      yearEl.textContent = ev.year;
      item.appendChild(yearEl);

      // Store event data
      item._eventData = ev;

      els.container.appendChild(item);
    });

    setupDragDrop();
    setupClickSwap();
    setupTouchDrag();
  }

  /* ── Drag & Drop (mouse) ── */
  var draggedItem = null;

  function setupDragDrop() {
    var items = els.container.querySelectorAll('.timeline-item');
    items.forEach(function (item) {
      item.addEventListener('dragstart', function (e) {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires setData
        e.dataTransfer.setData('text/plain', '');
      });

      item.addEventListener('dragend', function () {
        item.classList.remove('dragging');
        clearDropIndicators();
        draggedItem = null;
      });

      item.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedItem && draggedItem !== item) {
          clearDropIndicators();
          item.classList.add('drag-over');
        }
      });

      item.addEventListener('dragleave', function () {
        item.classList.remove('drag-over');
      });

      item.addEventListener('drop', function (e) {
        e.preventDefault();
        if (draggedItem && draggedItem !== item) {
          swapElements(draggedItem, item);
        }
        clearDropIndicators();
      });
    });
  }

  function clearDropIndicators() {
    var items = els.container.querySelectorAll('.timeline-item');
    items.forEach(function (it) { it.classList.remove('drag-over'); });
  }

  /* ── Click-to-swap (accessibility) ── */
  var selectedItem = null;

  function setupClickSwap() {
    var items = els.container.querySelectorAll('.timeline-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (selectedItem && selectedItem !== item) {
          swapElements(selectedItem, item);
          selectedItem.classList.remove('selected');
          selectedItem = null;
        } else if (selectedItem === item) {
          selectedItem.classList.remove('selected');
          selectedItem = null;
        } else {
          if (selectedItem) selectedItem.classList.remove('selected');
          selectedItem = item;
          item.classList.add('selected');
        }
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  /* ── Touch drag ── */
  function setupTouchDrag() {
    var touchItem = null;
    var touchClone = null;
    var startY = 0;

    els.container.addEventListener('touchstart', function (e) {
      var item = e.target.closest('.timeline-item');
      if (!item) return;
      touchItem = item;
      startY = e.touches[0].clientY;
      item.classList.add('dragging');

      // Create visual clone
      touchClone = item.cloneNode(true);
      touchClone.className = 'timeline-item timeline-clone';
      touchClone.style.position = 'fixed';
      touchClone.style.width = item.offsetWidth + 'px';
      touchClone.style.zIndex = '9999';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.opacity = '0.85';
      var rect = item.getBoundingClientRect();
      touchClone.style.left = rect.left + 'px';
      touchClone.style.top = rect.top + 'px';
      document.body.appendChild(touchClone);
    }, { passive: true });

    els.container.addEventListener('touchmove', function (e) {
      if (!touchItem || !touchClone) return;
      e.preventDefault();
      var y = e.touches[0].clientY;
      var rect = touchItem.getBoundingClientRect();
      touchClone.style.top = (rect.top + (y - startY)) + 'px';
      startY = y;

      // Highlight target
      clearDropIndicators();
      var target = getItemAtPoint(e.touches[0].clientX, y);
      if (target && target !== touchItem) {
        target.classList.add('drag-over');
      }
    }, { passive: false });

    els.container.addEventListener('touchend', function (e) {
      if (!touchItem) return;
      touchItem.classList.remove('dragging');
      clearDropIndicators();

      if (touchClone) {
        touchClone.remove();
        touchClone = null;
      }

      var touch = e.changedTouches[0];
      var target = getItemAtPoint(touch.clientX, touch.clientY);
      if (target && target !== touchItem) {
        swapElements(touchItem, target);
      }
      touchItem = null;
    }, { passive: true });
  }

  function getItemAtPoint(x, y) {
    var items = els.container.querySelectorAll('.timeline-item');
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      if (y >= r.top && y <= r.bottom && x >= r.left && x <= r.right) {
        return items[i];
      }
    }
    return null;
  }

  function swapElements(a, b) {
    // Clear any check results
    var items = els.container.querySelectorAll('.timeline-item');
    items.forEach(function (it) {
      it.classList.remove('correct', 'incorrect');
      var yr = it.querySelector('.timeline-year');
      if (yr) yr.style.visibility = 'hidden';
    });

    var parent = a.parentNode;
    var aNext = a.nextSibling;
    var bNext = b.nextSibling;

    if (aNext === b) {
      parent.insertBefore(b, a);
    } else if (bNext === a) {
      parent.insertBefore(a, b);
    } else {
      parent.insertBefore(a, bNext);
      parent.insertBefore(b, aNext);
    }
  }

  /* ── Game logic ── */
  function checkOrder() {
    var items = els.container.querySelectorAll('.timeline-item');
    var allCorrect = true;
    var roundScore = 0;

    items.forEach(function (item, i) {
      var yr = item.querySelector('.timeline-year');
      if (item._eventData === correctOrder[i]) {
        item.classList.remove('incorrect');
        item.classList.add('correct');
        if (yr) {
          yr.style.visibility = 'visible';
        }
        roundScore += 10;
      } else {
        item.classList.remove('correct');
        item.classList.add('incorrect');
        allCorrect = false;
      }
    });

    attempts++;
    updateUI();

    if (allCorrect) {
      // Penalty for retries
      var penalty = Math.max(0, (attempts - 1) * 2);
      score += Math.max(0, roundScore - penalty);
      updateUI();

      // Show all years
      items.forEach(function (item) {
        var yr = item.querySelector('.timeline-year');
        if (yr) yr.style.visibility = 'visible';
      });

      if (els.checkBtn) els.checkBtn.disabled = true;
      if (els.hintBtn) els.hintBtn.disabled = true;

      // Show details after short delay
      setTimeout(function () {
        showRoundComplete();
      }, 800);
    }
  }

  function giveHint() {
    var items = els.container.querySelectorAll('.timeline-item');
    // Find first incorrectly placed item that can be hinted
    for (var i = 0; i < items.length; i++) {
      if (items[i]._eventData === correctOrder[i]) continue;

      // Find where correctOrder[i] currently is
      for (var j = 0; j < items.length; j++) {
        if (items[j]._eventData === correctOrder[i] && j !== i) {
          // Flash the correct event for this position
          items[j].classList.add('hint-flash');
          setTimeout((function (el) {
            return function () { el.classList.remove('hint-flash'); };
          })(items[j]), 1500);

          hintsUsed++;
          // Penalty for hints
          score = Math.max(0, score - 5);
          updateUI();
          return;
        }
      }
    }
  }

  function resetRound() {
    var round = cfg.rounds[currentRound];
    var shuffled = round.events.slice();
    shuffleArray(shuffled);

    if (shuffled.length > 1 && arraysEqual(shuffled, correctOrder)) {
      var tmp = shuffled[0];
      shuffled[0] = shuffled[shuffled.length - 1];
      shuffled[shuffled.length - 1] = tmp;
    }

    renderEvents(shuffled);
    if (els.checkBtn) els.checkBtn.disabled = false;
    if (els.hintBtn) els.hintBtn.disabled = false;
  }

  function showRoundComplete() {
    var round = cfg.rounds[currentRound];
    // Build modal content
    var overlay = document.createElement('div');
    overlay.className = 'overlay active';

    var modal = document.createElement('div');
    modal.className = 'modal modal-win active';
    modal.style.maxHeight = '80vh';
    modal.style.overflowY = 'auto';

    var heading = document.createElement('h2');
    heading.textContent = 'Раунд завершено!';
    modal.appendChild(heading);

    var subheading = document.createElement('p');
    subheading.style.marginBottom = 'var(--space-md)';
    subheading.textContent = round.name;
    modal.appendChild(subheading);

    // Show event details
    var list = document.createElement('div');
    list.style.textAlign = 'left';
    correctOrder.forEach(function (ev) {
      var detail = document.createElement('div');
      detail.style.cssText = 'margin-bottom:var(--space-sm);padding:var(--space-sm);background:rgba(255,255,255,0.05);border-radius:var(--radius-sm);';

      var title = document.createElement('strong');
      title.style.color = 'var(--color-accent-orange)';
      title.textContent = ev.year + ' — ' + ev.text;
      detail.appendChild(title);

      if (ev.detail) {
        var desc = document.createElement('p');
        desc.style.cssText = 'margin-top:4px;font-size:var(--text-sm);color:var(--color-text-secondary);';
        desc.textContent = ev.detail;
        detail.appendChild(desc);
      }

      list.appendChild(detail);
    });
    modal.appendChild(list);

    // Next / Finish button
    var btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.marginTop = 'var(--space-md)';

    if (currentRound + 1 < cfg.rounds.length) {
      btn.textContent = 'Наступний раунд';
    } else {
      btn.textContent = 'Завершити';
    }

    btn.addEventListener('click', function () {
      overlay.remove();
      modal.remove();
      currentRound++;
      attempts = 0;
      loadRound();
    });
    modal.appendChild(btn);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    overlay.addEventListener('click', function () {
      overlay.remove();
      modal.remove();
      currentRound++;
      attempts = 0;
      loadRound();
    });
  }

  function showFinalResult() {
    if (window.HLGAnalytics) HLGAnalytics.endSession({ score: score, won: true, attempts: attempts });
    if (!els.container) return;
    els.container.textContent = '';

    if (els.checkBtn) els.checkBtn.disabled = true;
    if (els.hintBtn) els.hintBtn.disabled = true;
    if (els.resetBtn) els.resetBtn.disabled = true;

    var overlay = document.createElement('div');
    overlay.className = 'overlay active';

    var modal = document.createElement('div');
    modal.className = 'modal modal-win active';

    var heading = document.createElement('h2');
    heading.textContent = 'Гру завершено!';
    modal.appendChild(heading);

    var scoreText = document.createElement('p');
    scoreText.style.cssText = 'font-size:var(--text-xl);margin:var(--space-md) 0;';
    scoreText.textContent = 'Ваш рахунок: ' + score;
    modal.appendChild(scoreText);

    var msg = document.createElement('p');
    var maxScore = 0;
    cfg.rounds.forEach(function (r) { maxScore += r.events.length * 10; });
    if (score >= maxScore * 0.8) {
      msg.textContent = 'Чудовий результат! Ви добре знаєте хронологію!';
    } else if (score >= maxScore * 0.5) {
      msg.textContent = 'Непоганий результат! Продовжуйте вивчати історію!';
    } else {
      msg.textContent = 'Спробуйте ще раз для кращого результату!';
    }
    modal.appendChild(msg);

    var btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.marginTop = 'var(--space-md)';
    btn.textContent = 'Грати знову';
    btn.addEventListener('click', function () {
      overlay.remove();
      modal.remove();
      currentRound = 0;
      score = 0;
      attempts = 0;
      if (els.resetBtn) els.resetBtn.disabled = false;
      loadRound();
    });
    modal.appendChild(btn);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
  }

  function updateUI() {
    if (els.score) els.score.textContent = score;
    if (els.round) els.round.textContent = currentRound + 1;
    if (els.attempts) els.attempts.textContent = attempts;
  }

  /* ── Helpers ── */
  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  window.TimelineGame = {
    init: init
  };
})();
