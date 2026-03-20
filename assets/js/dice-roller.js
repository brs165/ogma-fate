// dice-roller.js — Ogma 4dF dice roller widget
// Self-contained, no dependencies. Mounts into any element with class="dice-roller-mount"
// Optionally reads data-skill (integer) and data-mode ("basic" | "skill") from the mount element.
// UX-01: Sprint 2

(function() {
  'use strict';

  var FACES = ['+1', '0', '0', '-1', '-1', '+1']; // real fate die distribution: 2x+1, 2x0, 2x-1
  var ADJECTIVES = [
    [-4, 'Abysmal', '#FF3B30'],
    [-3, 'Terrible', '#FF6B4A'],
    [-2, 'Poor', '#FF9500'],
    [-1, 'Mediocre', '#FFCC00'],
    [0, 'Average', '#8E8E93'],
    [1, 'Fair', '#34C759'],
    [2, 'Good', '#30D158'],
    [3, 'Great', '#32ADE6'],
    [4, 'Superb', '#5E5CE6'],
    [5, 'Fantastic', '#BF5AF2'],
    [6, 'Epic', '#FF375F'],
    [7, 'Legendary', '#FF6ABD'],
    [8, 'Legendary+', '#FF6ABD'],
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

  function dieFaceHTML(face, revealed, idx) {
    var sym = revealed ? face : '?';
    var cls = 'dr-die dr-die-' + (revealed ? (face === '+' ? 'pos' : face === '-' ? 'neg' : 'zero') : 'hidden');
    return '<span class="' + cls + '" data-idx="' + idx + '" aria-hidden="true">' + sym + '</span>';
  }

  function outcomeLabel(raw, skill) {
    var total = raw + skill;
    if (total >= 3) return 'Success with Style';
    if (total >= 1) return 'Success';
    if (total === 0) return 'Tie';
    return 'Fail';
  }

  function buildWidget(mountEl) {
    var skill = parseInt(mountEl.getAttribute('data-skill') || '0', 10);
    var mode  = mountEl.getAttribute('data-mode') || 'basic';
    var label = mountEl.getAttribute('data-label') || null;

    var id = 'dr-' + Math.random().toString(36).slice(2, 8);
    var rolling = false;

    mountEl.innerHTML =
      '<div class="dr-widget" id="' + id + '" role="region" aria-label="' + (label || '4dF dice roller') + '">' +
        '<div class="dr-top">' +
          (label ? '<span class="dr-label">' + label + '</span>' : '') +
          (mode === 'skill' ? '<span class="dr-skill-badge">Skill <span class="dr-skill-val">' + (skill >= 0 ? '+' + skill : skill) + '</span></span>' : '') +
        '</div>' +
        '<div class="dr-dice-row" aria-live="polite" aria-atomic="true">' +
          '<span class="dr-die dr-die-hidden" aria-hidden="true">?</span>' +
          '<span class="dr-die dr-die-hidden" aria-hidden="true">?</span>' +
          '<span class="dr-die dr-die-hidden" aria-hidden="true">?</span>' +
          '<span class="dr-die dr-die-hidden" aria-hidden="true">?</span>' +
        '</div>' +
        '<div class="dr-result-row" aria-live="polite">' +
          '<span class="dr-result-placeholder">Roll the dice →</span>' +
        '</div>' +
        '<button class="dr-btn" type="button" aria-label="Roll 4 Fate dice">Roll 4dF</button>' +
      '</div>';

    var widget   = document.getElementById(id);
    var diceRow  = widget.querySelector('.dr-dice-row');
    var resultRow = widget.querySelector('.dr-result-row');
    var btn      = widget.querySelector('.dr-btn');

    btn.addEventListener('click', function() {
      if (rolling) return;
      rolling = true;
      btn.disabled = true;
      btn.textContent = '…';

      // Roll immediately but animate reveal
      var faces = [rollDie(), rollDie(), rollDie(), rollDie()];

      // Flicker phase — 4 rapid scrambles
      var flickers = 0;
      var flickerInterval = setInterval(function() {
        var html = '';
        for (var i = 0; i < 4; i++) {
          var f = ['+', '0', '-'][Math.floor(Math.random() * 3)];
          html += '<span class="dr-die dr-die-hidden dr-die-spin">' + f + '</span>';
        }
        diceRow.innerHTML = html;
        flickers++;
        if (flickers >= 5) {
          clearInterval(flickerInterval);
          revealDice(faces);
        }
      }, 80);
    });

    function revealDice(faces) {
      // Reveal each die with a stagger
      var revealed = [false, false, false, false];

      function renderDice() {
        var html = '';
        for (var i = 0; i < 4; i++) {
          if (revealed[i]) {
            var f = faces[i];
            var cls = f === '+' ? 'dr-die-pos' : f === '-' ? 'dr-die-neg' : 'dr-die-zero';
            html += '<span class="dr-die ' + cls + ' dr-die-pop">' + f + '</span>';
          } else {
            html += '<span class="dr-die dr-die-hidden">?</span>';
          }
        }
        diceRow.innerHTML = html;
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
      var raw = faces.reduce(function(s, f) { return s + dieValue(f); }, 0);
      var total = raw + skill;
      var adj = getAdj(total);
      var outcome = outcomeLabel(raw, skill);

      var html = '<span class="dr-total" style="color:' + adj.color + '">' +
        (total >= 0 ? '+' : '') + total +
        '</span>' +
        '<span class="dr-adj" style="color:' + adj.color + '">' + adj.label + '</span>';

      if (mode === 'skill') {
        html += '<span class="dr-outcome dr-outcome-' + outcome.replace(/\s+/g, '-').toLowerCase() + '">' + outcome + '</span>';
      }

      resultRow.innerHTML = html;

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
})();

// Global bridge for dynamic mounting (hero modal etc)
window.ogmaMountDiceRollers = function(nodes) {
  Array.prototype.forEach.call(nodes, buildWidget);
};
