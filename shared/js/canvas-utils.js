/* canvas-utils.js — Canvas creation, resize, collision detection, physics
 *
 * Usage:
 *   var cu = CanvasUtils.setup('gameCanvas', 'gameContainer');
 *   // cu.canvas, cu.ctx available
 *   // Call CanvasUtils.checkCollisionAABB(a, b) for collision
 */

(function () {
  'use strict';

  var canvas = null;
  var ctx = null;
  var container = null;

  function setup(canvasId, containerId) {
    canvas = document.getElementById(canvasId);
    container = document.getElementById(containerId);
    if (!canvas || !container) return null;

    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    return { canvas: canvas, ctx: ctx };
  }

  function resize() {
    if (!canvas || !container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  function getSize() {
    return {
      width: canvas ? canvas.width : 0,
      height: canvas ? canvas.height : 0
    };
  }

  // AABB collision between two rects { x, y, w, h }
  function checkCollisionAABB(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  // Circle-circle collision { x, y, r }
  function checkCollisionCircle(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist < a.r + b.r;
  }

  // Ball reflection off walls, returns updated velocity { vx, vy }
  function reflectOffWalls(ball, bounds) {
    // ball: { x, y, r, vx, vy }
    // bounds: { left, top, right, bottom }
    var vx = ball.vx;
    var vy = ball.vy;

    if (ball.x - ball.r <= bounds.left || ball.x + ball.r >= bounds.right) {
      vx = -vx;
    }
    if (ball.y - ball.r <= bounds.top || ball.y + ball.r >= bounds.bottom) {
      vy = -vy;
    }

    return { vx: vx, vy: vy };
  }

  // Clear canvas with optional background
  function clear(bgColor) {
    if (!ctx || !canvas) return;
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  window.CanvasUtils = {
    setup: setup,
    resize: resize,
    getSize: getSize,
    checkCollisionAABB: checkCollisionAABB,
    checkCollisionCircle: checkCollisionCircle,
    reflectOffWalls: reflectOffWalls,
    clear: clear
  };
})();
