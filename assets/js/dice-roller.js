// dice-roller.js — Ogma 4dF dice roller widget
// Self-contained, no dependencies. Mounts into any element with class="dice-roller-mount"
// Optionally reads data-skill (integer) and data-mode ("basic" | "skill") from the mount element.
// UX-01: Sprint 2

(function() {
  'use strict';

  var ADJECTIVES = [
    [-4, 'Abysmal',    '#FF3B30'],
    [-3, 'Terrible',   '#FF6B4A'],
    [-2, 'Poor',       '#FF9500'],
    [-1, 'Mediocre',   '#FFCC00'],
    [0,  'Average',    '#8E8E93'],
    [1,  'Fair',       '#34C759'],
    [2,  'Good',       '#30D158'],
    [3,  'Great',      '#32ADE6'],
    [4,  'Superb',     '#5E5CE6'],
    [5,  'Fantastic',  '#BF5AF2'],
    [6,  'Epic',       '#FF375F'],
    [7,  'Legendary',  '#FF6ABD'],
    [8,  'Legendary+', '#FF6ABD'],
  ];

  function getAdj(n) {
    for (var i = 0; i < ADJECTIVES.length; i++) {
      if (ADJECTIVES[i][0] === n) return {label: ADJECTIVES[i][1], color: ADJECTIVES[i][2]};
    }
    if (n < -4) return {label: 'Abysmal', color: '#FF3B30'};
    return {label: 'Legendary+', color: '#FF6ABD'};
  }

  function rollDie() {
    return ['+', '+', '0', '0', '-', '-'][Math.floor(Math.random() * 6)];
  }

  function dieValue(face) {
    return face === '+' ? 1 : face === '-' ? -1 : 0;
  }

  function outcomeLabel(raw, skill) {
    var total = raw + skill;
    if (total >= 3) return 'Success with Style';
    if (total >= 1) return 'Success';
    if (total === 0) return 'Tie';
    return 'Fail';
  }

  // ── Safe DOM helpers — no innerHTML, no string interpolation ─────────────
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(k) {
        if (k === 'textContent') { node.textContent = attrs[k]; }
        else { node.setAttribute(k, attrs[k]); }
      });
    }
    if (children) {
      children.forEach(function(c) { if (c) node.appendChild(c); });
    }
    return node;
  }

  function makeDieSpan(face, hidden) {
    var cls = hidden
      ? 'dr-die dr-die-hidden'
      : 'dr-die dr-die-' + (face === '+' ? 'pos' : face === '-' ? 'neg' : 'zero');
    var span = document.createElement('span');
    span.className = cls;
    span.setAttribute('aria-hidden', 'true');
    span.textContent = hidden ? '?' : (face === '-' ? '−' : face);
    return span;
  }

  function buildWidget(mountEl) {
    var skill = parseInt(mountEl.getAttribute('data-skill') || '0', 10);
    if (isNaN(skill)) skill = 0;
    var mode  = mountEl.getAttribute('data-mode') || 'basic';
    var label = mountEl.getAttribute('data-label') || null;
    var id    = 'dr-' + Math.random().toString(36).slice(2, 8);
    var rolling = false;

    // ── Build widget via DOM (no innerHTML interpolation) ────────────────
    var topChildren = [];
    if (label) {
      topChildren.push(el('span', {class: 'dr-label', textContent: label}));
      if (mode === 'skill') {
        var skillText = (skill >= 0 ? '+' : '') + skill;
        topChildren.push(el('span', {class: 'dr-label', textContent: '—'}));
        topChildren.push(el('span', {class: 'dr-skill-badge'},
          [el('span', {class: 'dr-skill-val', textContent: skillText})]));
      }
    } else {
      var modeTitle = mode === 'skill' ? '4DF — SKILL ROLL' : '4DF — RAW ROLL';
      topChildren.push(el('span', {class: 'dr-label', textContent: modeTitle}));
      if (mode === 'skill') {
        var skillText2 = (skill >= 0 ? '+' : '') + skill;
        topChildren.push(el('span', {class: 'dr-skill-badge'},
          [el('span', {class: 'dr-skill-val', textContent: skillText2})]));
      }
    }

    var diceRow = el('div', {
      class: 'dr-dice-row',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    }, [
      makeDieSpan(null, true),
      makeDieSpan(null, true),
      makeDieSpan(null, true),
      makeDieSpan(null, true),
    ]);

    var resultRow = el('div', {'class': 'dr-result-row', 'aria-live': 'polite'},
      [el('span', {'class': 'dr-result-placeholder', textContent: '—'})]);

    var btn = el('button', {
      'class': 'dr-btn',
      'type': 'button',
      'aria-label': 'Roll 4 Fate dice',
      textContent: 'Roll 4dF',
    });

    var widget = el('div', {
      'class': 'dr-widget',
      'id': id,
      'role': 'region',
      'aria-label': label || '4dF dice roller',
    }, [
      el('div', {'class': 'dr-top'}, topChildren),
      diceRow,
      resultRow,
      btn,
    ]);

    // Clear mount and attach
    while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    mountEl.appendChild(widget);

    // ── Roll logic ────────────────────────────────────────────────────────
    btn.addEventListener('click', function() {
      if (rolling) return;
      rolling = true;
      btn.disabled = true;
      btn.textContent = '…';

      var faces = [rollDie(), rollDie(), rollDie(), rollDie()];

      // Flicker phase
      var flickers = 0;
      var flickerInterval = setInterval(function() {
        while (diceRow.firstChild) diceRow.removeChild(diceRow.firstChild);
        for (var i = 0; i < 4; i++) {
          var f = ['+', '0', '-'][Math.floor(Math.random() * 3)];
          var span = document.createElement('span');
          span.className = 'dr-die dr-die-hidden dr-die-spin';
          span.textContent = f;
          diceRow.appendChild(span);
        }
        flickers++;
        if (flickers >= 5) {
          clearInterval(flickerInterval);
          revealDice(faces);
        }
      }, 80);
    });

    function revealDice(faces) {
      var revealed = [false, false, false, false];

      function renderDice() {
        while (diceRow.firstChild) diceRow.removeChild(diceRow.firstChild);
        for (var i = 0; i < 4; i++) {
          if (revealed[i]) {
            var f = faces[i];
            var cls = 'dr-die dr-die-pop dr-die-' + (f === '+' ? 'pos' : f === '-' ? 'neg' : 'zero');
            var span = document.createElement('span');
            span.className = cls;
            span.textContent = f === '-' ? '−' : f;
            diceRow.appendChild(span);
          } else {
            diceRow.appendChild(makeDieSpan(null, true));
          }
        }
      }

      var idx = 0;
      var revealInterval = setInterval(function() {
        revealed[idx] = true;
        renderDice();
        idx++;
        if (idx >= 4) {
          clearInterval(revealInterval);
          showResult(faces);
        }
      }, 120);
    }

    function showResult(faces) {
      var raw   = faces.reduce(function(s, f) { return s + dieValue(f); }, 0);
      var total = raw + skill;
      var adj   = getAdj(total);
      var outcome = outcomeLabel(raw, skill);

      while (resultRow.firstChild) resultRow.removeChild(resultRow.firstChild);

      var totalSpan = document.createElement('span');
      totalSpan.className = 'dr-total';
      totalSpan.style.color = adj.color; // safe: hardcoded hex from ADJECTIVES
      totalSpan.textContent = (total >= 0 ? '+' : '') + total;

      var adjSpan = document.createElement('span');
      adjSpan.className = 'dr-adj';
      adjSpan.style.color = adj.color;
      adjSpan.textContent = adj.label; // safe: hardcoded string from ADJECTIVES

      resultRow.appendChild(totalSpan);
      resultRow.appendChild(adjSpan);

      if (mode === 'skill') {
        var outcomeSpan = document.createElement('span');
        outcomeSpan.className = 'dr-outcome dr-outcome-' + outcome.replace(/\s+/g, '-').toLowerCase();
        outcomeSpan.textContent = outcome; // safe: hardcoded from outcomeLabel()
        resultRow.appendChild(outcomeSpan);
      }

      rolling = false;
      btn.disabled = false;
      btn.textContent = 'Roll again';
    }
  }

  function initAll() {
    var mounts = document.querySelectorAll('.dice-roller-mount');
    for (var i = 0; i < mounts.length; i++) {
      buildWidget(mounts[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Global bridge for dynamic mounting (hero modal etc)
  window.ogmaMountDiceRollers = function(nodes) {
    Array.prototype.forEach.call(nodes, buildWidget);
  };

})();
