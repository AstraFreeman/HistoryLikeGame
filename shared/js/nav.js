/* nav.js — Injects sticky navigation bar on DOMContentLoaded
 *
 * Usage: Add data attributes to <body>:
 *   data-section="Козацька доба"
 *   data-game-title="Вікторина"
 *   data-home-url="../../index.html"
 *   data-nav="false"       — skip nav entirely
 *   data-nav="overlay"     — floating corner button instead of bar
 */

(function () {
  'use strict';

  function createNav() {
    var body = document.body;
    var navMode = body.getAttribute('data-nav');

    if (navMode === 'false') return;

    var homeUrl = body.getAttribute('data-home-url') || 'index.html';
    var section = body.getAttribute('data-section') || '';
    var title = body.getAttribute('data-game-title') || document.title;

    // Overlay mode: floating button
    if (navMode === 'overlay') {
      var floatBtn = document.createElement('a');
      floatBtn.href = homeUrl;
      floatBtn.className = 'floating-home';
      floatBtn.textContent = '\u2190 \u041D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u0443';
      document.body.appendChild(floatBtn);
      return;
    }

    // Standard sticky bar
    var nav = document.createElement('header');
    nav.className = 'game-nav';

    var backLink = document.createElement('a');
    backLink.href = homeUrl;
    backLink.textContent = '\u2190 \u041D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u0443';
    nav.appendChild(backLink);

    if (section) {
      var sep1 = document.createElement('span');
      sep1.className = 'nav-sep';
      sep1.textContent = '/';
      nav.appendChild(sep1);

      var sectionEl = document.createElement('span');
      sectionEl.className = 'nav-title';
      sectionEl.textContent = section;
      nav.appendChild(sectionEl);
    }

    if (title && title !== section) {
      var sep2 = document.createElement('span');
      sep2.className = 'nav-sep';
      sep2.textContent = '/';
      nav.appendChild(sep2);

      var titleEl = document.createElement('span');
      titleEl.className = 'nav-title';
      titleEl.style.color = 'var(--color-text-secondary)';
      titleEl.textContent = title;
      nav.appendChild(titleEl);
    }

    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNav);
  } else {
    createNav();
  }
})();
