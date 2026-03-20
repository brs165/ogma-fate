// ════════════════════════════════════════════════════════════════════════
// data/campaigns-meta.js — Lightweight campaign metadata for index.html
//
// PERF-01: index.html previously loaded all 6 full campaign data files
// (~600KB) that LandingApp never uses. This file provides only what
// LandingApp needs: meta.id, meta.icon, meta.name per campaign.
//
// Load ONLY on index.html. Campaign pages load the full data files.
// ════════════════════════════════════════════════════════════════════════

// Bootstrap CAMPAIGNS global (normally initialised by shared.js on campaign pages)
if (typeof CAMPAIGNS === 'undefined') { var CAMPAIGNS = {}; }

(function() {
  var meta = [
    {id: 'thelongafter', icon: '\u25c8', name: 'The Long After'},
    {id: 'cyberpunk',    icon: '\u2b21', name: 'Neon Abyss'},
    {id: 'fantasy',      icon: '\u2726', name: 'Shattered Kingdoms'},
    {id: 'space',        icon: '\u25ef', name: 'Void Runners'},
    {id: 'victorian',    icon: '\u2295', name: 'The Gaslight Chronicles'},
    {id: 'postapoc',     icon: '\u25fb', name: 'The Long Road'},
    {id: 'western',      icon: '\u2605', name: 'Dust and Iron'},
    {id: 'dVentiRealm',  icon: '\u2694', name: 'dVenti Realm'},
  ];
  meta.forEach(function(m) {
    CAMPAIGNS[m.id] = { meta: m };
  });
})();
