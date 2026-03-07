/* ui-utils.js — Shared UI helpers: modals, score updates, notifications
 *
 * Usage:
 *   UIUtils.showModal('winMessage', 'winOverlay');
 *   UIUtils.hideModal('winMessage', 'winOverlay');
 *   UIUtils.updateText('score', '15');
 *   UIUtils.showNotification('Correct!', 2000);
 */

(function () {
  'use strict';

  function showModal(modalId, overlayId) {
    var modal = document.getElementById(modalId);
    var overlay = overlayId ? document.getElementById(overlayId) : null;
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
  }

  function hideModal(modalId, overlayId) {
    var modal = document.getElementById(modalId);
    var overlay = overlayId ? document.getElementById(overlayId) : null;
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  function updateText(elementId, text) {
    var el = document.getElementById(elementId);
    if (el) el.textContent = text;
  }

  function showNotification(message, duration) {
    duration = duration || 3000;

    var existing = document.querySelector('.ui-notification');
    if (existing) existing.remove();

    var note = document.createElement('div');
    note.className = 'ui-notification';
    note.textContent = message;

    // Inline styles for notification (self-contained)
    note.style.cssText = [
      'position: fixed',
      'top: 20px',
      'left: 50%',
      'transform: translateX(-50%)',
      'background: var(--glass-bg, rgba(255,255,255,0.1))',
      'backdrop-filter: blur(12px)',
      'border: 1px solid var(--glass-border, rgba(255,255,255,0.12))',
      'color: var(--color-text-primary, #f1f5f9)',
      'padding: 12px 24px',
      'border-radius: var(--radius-full, 9999px)',
      'font-size: var(--text-sm, 0.875rem)',
      'z-index: 2000',
      'animation: slideIn 0.3s ease',
      'pointer-events: none'
    ].join('; ');

    document.body.appendChild(note);

    setTimeout(function () {
      note.style.opacity = '0';
      note.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { note.remove(); }, 300);
    }, duration);
  }

  function updateScore(scoreId, value) {
    updateText(scoreId, String(value));
  }

  function updateLives(livesId, value) {
    updateText(livesId, String(value));
  }

  window.UIUtils = {
    showModal: showModal,
    hideModal: hideModal,
    updateText: updateText,
    updateScore: updateScore,
    updateLives: updateLives,
    showNotification: showNotification
  };
})();
