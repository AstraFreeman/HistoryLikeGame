/* analytics.js — Lightweight, private learning analytics (localStorage only).
 * Tracks anonymous game sessions: module ID, duration, attempts, score.
 * No network requests, no cookies, no fingerprinting.
 * API: window.HLGAnalytics
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'histgame_analytics';
  var MAX_RECORDS = 10000;
  var EVICT_BATCH = 100;
  var TEACHER_EMAIL = 'korniienko.serhii@kdpu.edu.ua';

  // ── Current session state ──
  var session = null;

  // ── Storage helpers ──
  function loadSessions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveSessions(arr) {
    var data = JSON.stringify(arr);
    try {
      localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      // QuotaExceededError — evict oldest records and retry
      if (arr.length > EVICT_BATCH) {
        arr.splice(0, EVICT_BATCH);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
        } catch (e2) { /* give up */ }
      }
    }
  }

  // ── Module ID resolution ──
  function resolveModuleId() {
    // ?id= param (used by template pages)
    try {
      var params = new URLSearchParams(window.location.search);
      var id = params.get('id');
      if (id) return id;
    } catch (e) { /* URLSearchParams not supported */ }

    // Fallback: extract from pathname
    var path = window.location.pathname;
    var match = path.match(/([^/]+?)(?:\.html?)?$/);
    return match ? match[1] : 'unknown';
  }

  // ── Public API ──

  function startSession(moduleId, opts) {
    opts = opts || {};
    session = {
      moduleId: moduleId || resolveModuleId(),
      t0: Date.now(),
      attempts: opts.attempts || 0
    };
  }

  function endSession(opts) {
    if (!session) return;
    opts = opts || {};

    var record = {
      m: session.moduleId,
      t0: session.t0,
      dt: Date.now() - session.t0,
      a: opts.attempts || session.attempts || 1,
      s: opts.score != null ? opts.score : 0,
      w: !!opts.won
    };

    var arr = loadSessions();
    // Enforce max records
    if (arr.length >= MAX_RECORDS) {
      arr.splice(0, arr.length - MAX_RECORDS + 1);
    }
    arr.push(record);
    saveSessions(arr);

    session = null;
  }

  function cancelSession() {
    session = null;
  }

  function getSessions() {
    return loadSessions();
  }

  function getOverview() {
    var arr = loadSessions();
    var totalTime = 0;
    var modules = {};
    for (var i = 0; i < arr.length; i++) {
      totalTime += arr[i].dt || 0;
      modules[arr[i].m] = true;
    }
    return {
      totalSessions: arr.length,
      totalTime: totalTime,
      uniqueModules: Object.keys(modules).length
    };
  }

  function getModuleSummary(id) {
    var arr = loadSessions();
    var plays = 0;
    var totalScore = 0;
    var totalTime = 0;
    var bestScore = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].m === id) {
        plays++;
        totalScore += arr[i].s || 0;
        totalTime += arr[i].dt || 0;
        if ((arr[i].s || 0) > bestScore) bestScore = arr[i].s;
      }
    }
    return {
      plays: plays,
      avgScore: plays ? Math.round(totalScore / plays * 10) / 10 : 0,
      avgTime: plays ? Math.round(totalTime / plays) : 0,
      bestScore: bestScore
    };
  }

  // ── Export ──
  function formatDuration(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function formatDate(ts) {
    var d = new Date(ts);
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yy = d.getFullYear();
    var hh = d.getHours();
    var mi = d.getMinutes();
    return (dd < 10 ? '0' : '') + dd + '.' +
           (mm < 10 ? '0' : '') + mm + '.' + yy + ' ' +
           (hh < 10 ? '0' : '') + hh + ':' +
           (mi < 10 ? '0' : '') + mi;
  }

  function exportJSON() {
    return JSON.stringify(loadSessions(), null, 2);
  }

  function exportCSV() {
    var arr = loadSessions();
    var lines = ['module,date,duration_sec,attempts,score,won'];
    for (var i = 0; i < arr.length; i++) {
      var r = arr[i];
      lines.push([
        r.m,
        formatDate(r.t0),
        Math.round((r.dt || 0) / 1000),
        r.a || 1,
        r.s || 0,
        r.w ? 1 : 0
      ].join(','));
    }
    return lines.join('\n');
  }

  function downloadFile(format) {
    var content, mime, ext;
    if (format === 'csv') {
      content = exportCSV();
      mime = 'text/csv;charset=utf-8';
      ext = 'csv';
    } else {
      content = exportJSON();
      mime = 'application/json;charset=utf-8';
      ext = 'json';
    }

    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'hlg-analytics.' + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function sendToTeacher() {
    var csv = exportCSV();
    var overview = getOverview();
    var subject = encodeURIComponent('HLG Analytics');
    var body = encodeURIComponent(
      'Дані аналітики "Історія як гра"\n' +
      'Ігор: ' + overview.totalSessions +
      ', Час: ' + formatDuration(overview.totalTime) +
      ', Модулів: ' + overview.uniqueModules + '\n\n' +
      csv
    );
    window.location.href = 'mailto:' + TEACHER_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  // ── Dashboard UI (mini-card for index.html) ──
  function renderDashboard(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var overview = getOverview();
    if (overview.totalSessions === 0) {
      var empty = document.createElement('p');
      empty.style.cssText = 'color:var(--color-text-secondary);text-align:center;';
      empty.textContent = 'Поки що немає даних. Зіграйте хоча б одну гру!';
      container.appendChild(empty);
      return;
    }

    var card = document.createElement('div');
    card.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--space-lg);align-items:center;justify-content:center;';

    // Stats
    var stats = [
      { label: 'Ігор зіграно', value: overview.totalSessions },
      { label: 'Загальний час', value: formatDuration(overview.totalTime) },
      { label: 'Унікальних модулів', value: overview.uniqueModules }
    ];

    for (var i = 0; i < stats.length; i++) {
      var stat = document.createElement('div');
      stat.style.cssText = 'text-align:center;min-width:100px;';

      var val = document.createElement('div');
      val.style.cssText = 'font-size:var(--text-2xl);font-weight:700;color:var(--color-accent-orange);';
      val.textContent = stats[i].value;
      stat.appendChild(val);

      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:var(--text-sm);color:var(--color-text-secondary);';
      lbl.textContent = stats[i].label;
      stat.appendChild(lbl);

      card.appendChild(stat);
    }

    container.appendChild(card);

    // Buttons row
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--space-sm);justify-content:center;margin-top:var(--space-lg);';

    // Send to teacher button
    var sendBtn = document.createElement('button');
    sendBtn.className = 'btn btn-primary btn-sm';
    sendBtn.type = 'button';
    sendBtn.style.cssText = 'display:inline-flex;align-items:center;gap:var(--space-xs);';
    var sendImg = document.createElement('img');
    sendImg.src = 'assets/images/rose.png';
    sendImg.alt = '';
    sendImg.style.cssText = 'width:20px;height:20px;';
    sendImg.addEventListener('error', function () { sendImg.style.display = 'none'; });
    sendBtn.appendChild(sendImg);
    var sendText = document.createTextNode('Надіслати викладачу');
    sendBtn.appendChild(sendText);
    sendBtn.addEventListener('click', sendToTeacher);
    btnRow.appendChild(sendBtn);

    // Details link
    var detailsLink = document.createElement('a');
    detailsLink.href = 'docs/analytics.html';
    detailsLink.className = 'btn btn-secondary btn-sm';
    detailsLink.textContent = 'Детальніше';
    btnRow.appendChild(detailsLink);

    container.appendChild(btnRow);
  }

  // ── Full export page UI ──
  function renderExport(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var arr = loadSessions();

    // Overview stats
    var overview = getOverview();
    var statsDiv = document.createElement('div');
    statsDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--space-lg);justify-content:center;margin-bottom:var(--space-xl);';

    var statItems = [
      { label: 'Ігор зіграно', value: overview.totalSessions },
      { label: 'Загальний час', value: formatDuration(overview.totalTime) },
      { label: 'Унікальних модулів', value: overview.uniqueModules }
    ];
    for (var si = 0; si < statItems.length; si++) {
      var sDiv = document.createElement('div');
      sDiv.style.cssText = 'text-align:center;min-width:100px;';
      var sVal = document.createElement('div');
      sVal.style.cssText = 'font-size:var(--text-2xl);font-weight:700;color:var(--color-accent-orange);';
      sVal.textContent = statItems[si].value;
      sDiv.appendChild(sVal);
      var sLbl = document.createElement('div');
      sLbl.style.cssText = 'font-size:var(--text-sm);color:var(--color-text-secondary);';
      sLbl.textContent = statItems[si].label;
      sDiv.appendChild(sLbl);
      statsDiv.appendChild(sDiv);
    }
    container.appendChild(statsDiv);

    if (arr.length === 0) {
      var empty = document.createElement('p');
      empty.style.cssText = 'color:var(--color-text-secondary);text-align:center;';
      empty.textContent = 'Немає збережених сесій. Зіграйте гру та поверніться сюди.';
      container.appendChild(empty);
      return;
    }

    // Table
    var tableWrap = document.createElement('div');
    tableWrap.style.cssText = 'overflow-x:auto;margin-bottom:var(--space-lg);';

    var table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:var(--text-sm);';

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var headers = ['Модуль', 'Дата', 'Тривалість', 'Спроби', 'Бал', 'Результат'];
    for (var h = 0; h < headers.length; h++) {
      var th = document.createElement('th');
      th.style.cssText = 'padding:var(--space-sm) var(--space-md);text-align:left;border-bottom:2px solid var(--glass-border);color:var(--color-text-primary);white-space:nowrap;';
      th.textContent = headers[h];
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    for (var ri = arr.length - 1; ri >= 0; ri--) {
      var r = arr[ri];
      var tr = document.createElement('tr');
      tr.style.cssText = 'border-bottom:1px solid var(--glass-border);';

      var cells = [
        r.m,
        formatDate(r.t0),
        formatDuration(r.dt || 0),
        r.a || 1,
        r.s || 0,
        r.w ? 'Перемога' : 'Програш'
      ];

      for (var ci = 0; ci < cells.length; ci++) {
        var td = document.createElement('td');
        td.style.cssText = 'padding:var(--space-sm) var(--space-md);color:var(--color-text-secondary);white-space:nowrap;';
        td.textContent = cells[ci];
        // Color the result column
        if (ci === 5) {
          td.style.color = r.w ? 'var(--color-accent-green)' : 'var(--color-accent-orange)';
          td.style.fontWeight = '600';
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);

    // Buttons
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--space-sm);justify-content:center;';

    // JSON button
    var jsonBtn = document.createElement('button');
    jsonBtn.className = 'btn btn-secondary btn-sm';
    jsonBtn.type = 'button';
    jsonBtn.textContent = 'Завантажити JSON';
    jsonBtn.addEventListener('click', function () { downloadFile('json'); });
    btnRow.appendChild(jsonBtn);

    // CSV button
    var csvBtn = document.createElement('button');
    csvBtn.className = 'btn btn-secondary btn-sm';
    csvBtn.type = 'button';
    csvBtn.textContent = 'Завантажити CSV';
    csvBtn.addEventListener('click', function () { downloadFile('csv'); });
    btnRow.appendChild(csvBtn);

    // Send to teacher button
    var sendBtn = document.createElement('button');
    sendBtn.className = 'btn btn-primary btn-sm';
    sendBtn.type = 'button';
    sendBtn.style.cssText = 'display:inline-flex;align-items:center;gap:var(--space-xs);';
    var sendImg = document.createElement('img');
    sendImg.src = '../assets/images/rose.png';
    sendImg.alt = '';
    sendImg.style.cssText = 'width:20px;height:20px;';
    sendImg.addEventListener('error', function () { sendImg.style.display = 'none'; });
    sendBtn.appendChild(sendImg);
    var sendTxt = document.createTextNode('Надіслати викладачу');
    sendBtn.appendChild(sendTxt);
    sendBtn.addEventListener('click', sendToTeacher);
    btnRow.appendChild(sendBtn);

    // Clear button
    var clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-ghost btn-sm';
    clearBtn.type = 'button';
    clearBtn.style.color = 'var(--color-accent-red, #ef4444)';
    clearBtn.textContent = 'Очистити дані';
    clearBtn.addEventListener('click', function () { clearAll(containerId); });
    btnRow.appendChild(clearBtn);

    container.appendChild(btnRow);
  }

  function clearAll(rerenderId) {
    if (!confirm('Видалити всі дані аналітики? Цю дію не можна скасувати.')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* noop */ }
    if (rerenderId) {
      var c = document.getElementById(rerenderId);
      if (c) {
        c.textContent = '';
        renderExport(rerenderId);
      }
    }
  }

  // ── Auto-save on page unload ──
  function onBeforeUnload() {
    if (session) {
      endSession({ score: 0, won: false });
    }
  }
  window.addEventListener('beforeunload', onBeforeUnload);

  // ── Expose API ──
  window.HLGAnalytics = {
    startSession: startSession,
    endSession: endSession,
    cancelSession: cancelSession,
    getSessions: getSessions,
    getOverview: getOverview,
    getModuleSummary: getModuleSummary,
    exportJSON: exportJSON,
    exportCSV: exportCSV,
    downloadFile: downloadFile,
    sendToTeacher: sendToTeacher,
    renderDashboard: renderDashboard,
    renderExport: renderExport,
    clearAll: clearAll
  };
})();
