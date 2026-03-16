/* asset-validator.js — Validates image assets, shows red square for missing.
 * Usage: AssetValidator.createImg(src, alt, container)
 * Returns an <img> element; on error shows a red placeholder with the expected filename.
 */
(function () {
  'use strict';

  function createImg(src, alt, opts) {
    opts = opts || {};
    var img = document.createElement('img');
    img.alt = alt || '';
    if (opts.className) img.className = opts.className;
    if (opts.style) img.style.cssText = opts.style;
    img.addEventListener('error', function () {
      var placeholder = document.createElement('div');
      placeholder.style.cssText = 'background:#e00;color:#fff;display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);padding:var(--space-xs);text-align:center;word-break:break-all;' + (opts.style || '');
      if (opts.className) placeholder.className = opts.className;
      placeholder.style.width = opts.width || '100px';
      placeholder.style.height = opts.height || '100px';
      var fname = src.split('/').pop();
      placeholder.textContent = fname;
      if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img);
      }
    });
    img.src = src;
    return img;
  }

  window.AssetValidator = {
    createImg: createImg
  };
})();
