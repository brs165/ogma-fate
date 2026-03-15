// ============================================================
// FATE GENERATOR SUITE - Campaign Intro Engine
// core/intro.js  v31
//
// Self-contained overlay. No dependencies. No build step.
// Detects world from <html data-campaign="..."> or URL.
// First visit: full sequence. Return visit: title card only.
// Skip: click anywhere, Space, Enter, Escape.
// ============================================================

(function() {
  'use strict';

  // ── Config ────────────────────────────────────────────────
  var FADE_MS = 700;

  // ── CGA Palette ──────────────────────────────────────────
  var C = {
    K:  '#000000', dB: '#0000AA', dG: '#00AA00', dC: '#00AAAA',
    dR: '#AA0000', dM: '#AA00AA', Br: '#AA5500', lG: '#AAAAAA',
    dK: '#555555', bB: '#5555FF', bG: '#55FF55', bC: '#55FFFF',
    bR: '#FF5555', bM: '#FF55FF', bY: '#FFFF55', WH: '#FFFFFF',
    // Gold for index
    gd: '#D4A832', dGd: '#8B6914',
  };

  // Wrap text in a coloured span
  function col(color, text) {
    return '<span style="color:' + color + '">' + text + '</span>';
  }

  // ── World detection ───────────────────────────────────────
  function detectWorld() {
    // Check data-campaign on <html>
    var attr = document.documentElement.getAttribute('data-campaign');
    if (attr) return attr;
    // Check URL
    var url = window.location.pathname;
    if (url.indexOf('cyberpunk') !== -1)    return 'cyberpunk';
    if (url.indexOf('postapoc') !== -1)     return 'postapoc';
    if (url.indexOf('western') !== -1)      return 'western';
    if (url.indexOf('fantasy') !== -1)      return 'fantasy';
    if (url.indexOf('space') !== -1)        return 'space';
    if (url.indexOf('victorian') !== -1)    return 'victorian';
    if (url.indexOf('thelongafter') !== -1) return 'thelongafter';
    return 'index';
  }

  // ── World meta ────────────────────────────────────────────
  var META = {
    index: {
      bg:    'radial-gradient(ellipse at 50% 40%, #0a0800 0%, #000 70%)',
      title: 'FATE CONDENSED',
      sub:   'SIX WORLDS. YOUR TABLE.',
    },
    cyberpunk: {
      bg:    'radial-gradient(ellipse at 15% 85%, #001818 0%, #000 65%)',
      title: 'NEON ABYSS',
      sub:   'CORPORATE DYSTOPIA IN MERIDIAN',
    },
    postapoc: {
      bg:    'radial-gradient(ellipse at 50% 95%, #150a00 0%, #000 65%)',
      title: 'THE LONG ROAD',
      sub:   'THE BEAUTIFUL APOCALYPSE',
    },
    fantasy: {
      bg:    'radial-gradient(ellipse at 80% 15%, #160016 0%, #000 65%)',
      title: 'SHATTERED KINGDOMS',
      sub:   'THE WEIGHT OF HISTORY',
    },
    space: {
      bg:    'radial-gradient(ellipse at 50% 50%, #00000f 0%, #000 75%)',
      title: 'VOID RUNNERS',
      sub:   'BLUE-COLLAR SPACE WESTERN',
    },
    victorian: {
      bg:    'radial-gradient(ellipse at 30% 25%, #0c0c0c 0%, #000 65%)',
      title: 'THE GASLIGHT CHRONICLES',
      sub:   'GOTHIC COSMIC HORROR IN GASLIT LONDON',
    },
    thelongafter: {
      bg:    'radial-gradient(ellipse at 60% 75%, #001000 0%, #000 65%)',
      title: 'THE LONG AFTER',
      sub:   'SWORD-AND-PLANET DYING EARTH',
    },
  };

  // ── Sequence definitions ──────────────────────────────────
  // Each step: { txt, col, d(elay ms), tw(typewriter bool), cd(char delay ms), fade(ms), gap }
  // gap = true means empty line with extra spacing

  // ── INDEX - three movements ───────────────────────────────
  // Voice: the game itself talking to the table before anything starts.
  // Movement 1: what this isn't. Movement 2: what it is. Movement 3: CTA.
  function seqIndex() {
    var D = 38;
    var gd = C.gd; var dGd = C.dGd; var WH = C.WH; var dK = C.dK; var lG = C.lG;
    return [
      {txt:'', d:300},
      // Movement 1 - what it isn't
      {txt:'This is not about winning.',           col:lG,  tw:1, cd:D,      d:200},
      {txt:'',                                                                d:200},
      {txt:'The dice do not decide what happens.', col:lG,  tw:1, cd:D*0.8,  d:80},
      {txt:'They decide how much it costs.',       col:WH,  tw:1, cd:D,      d:80},
      {txt:'',                                                                d:400},
      {txt:'There are no hit points.',             col:lG,  tw:1, cd:D*0.8,  d:120},
      {txt:'There are consequences.',              col:WH,  tw:1, cd:D*1.2,  d:80},
      {txt:'',                                                                d:500},
      // Movement 2 - what it is
      {txt:'You are the protagonists.',            col:gd,  tw:1, cd:D,      d:300},
      {txt:'Not adventurers. Not characters.',     col:dGd, tw:1, cd:D*0.7,  d:80},
      {txt:'',                                                                d:200},
      {txt:'Protagonists.',                        col:gd,  tw:1, cd:D*2.5,  d:80},
      {txt:'',                                                                d:400},
      {txt:'The GM is a fan of your characters.', col:lG,  tw:1, cd:D*0.7,  d:200},
      {txt:'Not your enemy.',                      col:WH,  tw:1, cd:D*1.5,  d:80},
      {txt:'Not a neutral arbiter.',               col:lG,  tw:1, cd:D*0.8,  d:80},
      {txt:'',                                                                d:300},
      {txt:'A fan.',                               col:gd,  tw:1, cd:D*3,    d:80},
      {txt:'',                                                                d:500},
      {txt:'Your aspects are true about you.',     col:lG,  tw:1, cd:D*0.7,  d:200},
      {txt:'They invite the story to complicate you.', col:lG, tw:1, cd:D*0.65, d:80},
      {txt:'',                                                                d:300},
      {txt:'Accept the complication.',             col:gd,  tw:1, cd:D,      d:200},
      {txt:'Earn the fate point.',                 col:gd,  tw:1, cd:D,      d:80},
      {txt:'Spend it when it matters.',            col:WH,  tw:1, cd:D,      d:80},
      {txt:'',                                                                d:600},
      // Movement 3 - CTA
      {txt:'Six worlds.',                          col:WH,  tw:1, cd:D*1.5,  d:300},
      {txt:'One system.',                          col:WH,  tw:1, cd:D*1.5,  d:80},
      {txt:'Infinite stories.',                    col:gd,  tw:1, cd:D*1.5,  d:80},
      {txt:'',                                                                d:500},
      {txt:'Get your friends.',                    col:WH,  tw:1, cd:D*1.2,  d:200},
      {txt:'',                                                                d:200},
      {txt:'Tempt your fates.',                    col:gd,  tw:1, cd:D*1.8,  d:100},
      {txt:'',                                                                d:800},
      {txt:'FATE CONDENSED GENERATOR SUITE',       col:WH,  title:true,      d:300},
      {txt:'A FATE CONDENSED CAMPAIGN TOOLKIT  //  6 WORLDS  //  16 GENERATORS', col:dGd, sub:true, d:200},
      {txt:'',                                                                d:300},
    ];
  }

  // ── NEON ABYSS - Cyberpunk ────────────────────────────────
  // Mr. Robot register: already inside the job, flat voiceover.
  // Grounded in: Meridian vertical city, OmniSec, augments as leash,
  // kill switches, fixers, "résumé and your leash"
  function seqCyberpunk() {
    var D = 36;
    return [
      {txt:'', d:200},
      {txt:'> MERIDIAN CITY-NET  //  DISTRICT 7 NODE',          col:C.dC, tw:1, cd:26, d:60},
      {txt:'> AUTHENTICATION: GHOST CREDENTIALS - ACCEPTED',    col:C.bG, tw:1, cd:20, d:40},
      {txt:'> ALTITUDE: SUB-LEVEL 12  //  CORP ACCESS: NONE',   col:C.dC, tw:1, cd:20, d:40},
      {txt:'> OmniSec SWEEP: SCHEDULED IN 4 MINUTES',           col:C.bR, tw:1, cd:20, d:80},
      {txt:'', d:340},
      {txt:'Meridian is a vertical city.',                               tw:1, col:C.bC, cd:D,      d:100},
      {txt:'Altitude is wealth.',                                        tw:1, col:C.bC, cd:D,      d:60},
      {txt:'', d:200},
      {txt:'The corporations own the infrastructure.',                   tw:1, col:C.lG, cd:D,      d:80},
      {txt:'They own the law.',                                          tw:1, col:C.lG, cd:D,      d:60},
      {txt:'And through augmentation contracts,',                        tw:1, col:C.lG, cd:D,      d:60},
      {txt:'they own the bodies of the people who work for them.',       tw:1, col:C.lG, cd:D*0.7,  d:60},
      {txt:'', d:300},
      {txt:'Your augments are your résumé.',                            tw:1, col:C.WH, cd:D,      d:100},
      {txt:'', d:80},
      {txt:'They are also your leash.',                                  tw:1, col:C.bR, cd:D*1.3,  d:80},
      {txt:'', d:400},
      {txt:'The kill switch is standard.',                               tw:1, col:C.dC, cd:D*0.8,  d:100},
      {txt:'You knew that when you signed.',                             tw:1, col:C.dC, cd:D*0.8,  d:60},
      {txt:'', d:300},
      {txt:'The run starts in four minutes.',                            tw:1, col:C.bY, cd:D,      d:120},
      {txt:'The corp doesn\'t know you\'re here.',                       tw:1, col:C.bC, cd:D,      d:60},
      {txt:'', d:200},
      {txt:'Don\'t spend that on something stupid.',                     tw:1, col:C.WH, cd:D*1.2,  d:80},
      {txt:'', d:700},
      {txt:'NEON ABYSS',                                         col:C.WH, title:true, d:250},
      {txt:'FATE CONDENSED  //  CORPORATE DYSTOPIA IN MERIDIAN', col:C.dC, sub:true,   d:140},
      {txt:'', d:300},
      {txt:'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', col:C.dC, d:80},
    ];
  }

  // ── THE LONG ROAD - Post-Apoc ─────────────────────────────
  // Last of Us register: calm expertise before catastrophe.
  // Grounded in: "The world collapsed. Nature came back."
  // highways=forests, cities=coral reefs, Reclamation Cult,
  // Clean Zone, "not how to survive but what kind of world"
  function seqPostApoc() {
    var F = 2000;
    return [
      {txt:'', d:500},
      {txt:'SURFACE RECOVERY COMMISSION',                    col:C.dK, fade:1400, d:300},
      {txt:'SETTLEMENT VIABILITY REPORT - YEAR ONE',         col:C.dK, fade:1200, d:100},
      {txt:'', d:600},
      {txt:'The world collapsed.',                           col:C.bY, fade:F,    d:400},
      {txt:'Nature came back.',                              col:C.bY, fade:F,    d:300},
      {txt:'', d:400},
      {txt:'The highways are forests now.',                  col:C.lG, fade:1800, d:400},
      {txt:'The cities are coral reefs of concrete and vine.', col:C.lG, fade:1800, d:300},
      {txt:'', d:500},
      {txt:'Nature is not hostile.',                         col:C.dK, fade:1600, d:400},
      {txt:'It is indifferent.',                             col:C.dK, fade:1600, d:200},
      {txt:'Its indifference is gorgeous.',                  col:C.lG, fade:1800, d:200},
      {txt:'', d:700},
      {txt:'The Reclamation Cult says what you do is blasphemy.', col:C.bR, fade:2000, d:400},
      {txt:'The Clean Zone draws people like a compass needle.',   col:C.bY, fade:2000, d:300},
      {txt:'', d:600},
      {txt:'The question is not how to survive.',            col:C.lG, fade:1800, d:500},
      {txt:'', d:300},
      {txt:'The question is what kind of world',             col:C.lG, fade:1800, d:400},
      {txt:'you build with what you salvage.',               col:C.WH, fade:2600, d:200},
      {txt:'', d:1000},
      {txt:'THE LONG ROAD',                                  col:C.WH, title:true, fade:2800, d:400},
      {txt:'FATE CONDENSED  //  THE BEAUTIFUL APOCALYPSE',   col:C.Br, sub:true,  fade:2200, d:200},
    ];
  }

  // ── SHATTERED KINGDOMS - Fantasy ─────────────────────────
  // Witcher/Malazan register: narrated doom, weight of history.
  // Grounded in: magic as ecological wound, Blight rewrites not kills,
  // Old Oaths waking, dead rise as creditors, Inquisition
  function seqFantasy() {
    return [
      {txt:'', d:400},
      {txt:'FROM THE RECORD OF BROKEN THRONES',    col:C.dM, fade:700,  d:200},
      {txt:'On the nature of ecological wounds',   col:C.dM, fade:600,  d:100},
      {txt:'', d:600},
      {txt:'" Magic is not power. "',              col:C.WH, fade:900,  d:300},
      {txt:'" It is the scar tissue',              col:C.WH, fade:900,  d:300},
      {txt:'  of a war that broke the world. "',   col:C.WH, fade:900,  d:200},
      {txt:'', d:500},
      {txt:'The Blight does not kill.',            col:C.lG, fade:1000, d:400},
      {txt:'It rewrites.',                         col:C.bR, fade:1200, d:300},
      {txt:'', d:500},
      {txt:'The throne is broken.',                col:C.lG, fade:900,  d:400},
      {txt:'The Inquisition hunts anyone',         col:C.lG, fade:900,  d:300},
      {txt:'who remembers what the magic was for.',col:C.dM, fade:900,  d:200},
      {txt:'', d:500},
      {txt:'The Old Oaths are waking.',            col:C.bR, fade:1000, d:400},
      {txt:'', d:300},
      {txt:'The dead are rising -',                col:C.lG, fade:1000, d:400},
      {txt:'not as enemies.',                      col:C.WH, fade:1200, d:300},
      {txt:'', d:300},
      {txt:'As creditors.',                        col:C.bR, fade:1600, d:300},
      {txt:'', d:800},
      {txt:'You are oath-bearers, deserters,',     col:C.dM, fade:900,  d:400},
      {txt:'hedge-practitioners, swords-for-hire', col:C.dM, fade:900,  d:200},
      {txt:'in a kingdom coming apart.',           col:C.lG, fade:1000, d:200},
      {txt:'', d:800},
      {txt:'SHATTERED KINGDOMS',                   col:C.WH, title:true, fade:1400, d:350},
      {txt:'FATE CONDENSED  //  THE WEIGHT OF HISTORY', col:C.dM, sub:true, fade:1200, d:200},
      {txt:'', d:200},
      {txt:'══════════════════════════════════════════════════════', col:C.dM, fade:800, d:100},
    ];
  }

  // ── VOID RUNNERS - Space ──────────────────────────────────
  // Firefly/Expanse register: blue-collar, ship payment.
  // Grounded in: CTA controls routes, Signal (coordinates + date),
  // 40 mins sensory deprivation per jump, Ghost Fleet
  function seqSpace() {
    var D = 44;
    return [
      {txt:'', d:300},
      {txt:'CREW LOG  //  INDEPENDENT VESSEL',       col:C.dB, tw:1, cd:22, d:80},
      {txt:'CTA TRANSIT AUTHORITY - UNREGISTERED',   col:C.dB, tw:1, cd:22, d:60},
      {txt:'FUEL STATUS: 11 DAYS',                   col:C.bR, tw:1, cd:22, d:60},
      {txt:'SHIP PAYMENT: 18 DAYS OVERDUE',          col:C.bR, tw:1, cd:22, d:80},
      {txt:'', d:400},
      {txt:'The Colonial Transit Authority',                     tw:1, col:C.bB, cd:D*0.7, d:100},
      {txt:'controls the jump routes.',                          tw:1, col:C.bB, cd:D*0.7, d:60},
      {txt:'They tax the fuel.',                                 tw:1, col:C.bB, cd:D*0.7, d:60},
      {txt:'They enforce the law when it\'s profitable.',        tw:1, col:C.dK, cd:D*0.6, d:60},
      {txt:'', d:300},
      {txt:'Everyone else is trying to make the ship payment.',  tw:1, col:C.lG, cd:D*0.6, d:100},
      {txt:'', d:400},
      {txt:'Jump transit takes forty minutes.',                  tw:1, col:C.WH, cd:D,     d:150},
      {txt:'Forty minutes of sensory deprivation.',              tw:1, col:C.lG, cd:D,     d:80},
      {txt:'Nobody comes out quite the same.',                   tw:1, col:C.bC, cd:D*1.1, d:80},
      {txt:'', d:500},
      {txt:'Three weeks ago someone transmitted a signal.',      tw:1, col:C.WH, cd:D*0.8, d:200},
      {txt:'Coordinates.',                                       tw:1, col:C.bC, cd:D*1.5, d:100},
      {txt:'And a date.',                                        tw:1, col:C.bR, cd:D*1.5, d:100},
      {txt:'', d:400},
      {txt:'Someone is expecting something.',                    tw:1, col:C.bC, cd:D*1.2, d:200},
      {txt:'', d:300},
      {txt:'The question is whether you get there first.',       tw:1, col:C.WH, cd:D,     d:100},
      {txt:'', d:700},
      {txt:'VOID RUNNERS',                                       col:C.WH, title:true, d:250},
      {txt:'FATE CONDENSED  //  BLUE-COLLAR SPACE WESTERN',      col:C.dB, sub:true,   d:140},
      {txt:'', d:300},
      {txt:'. . . . . . . . . . . . . . . . . . . . . . . . .', col:C.dB, d:80},
    ];
  }

  // ── GASLIGHT CHRONICLES - Victorian ──────────────────────
  // Penny Dreadful register: letter being written, second hand appears.
  // Grounded in: "Enlightenment promised reason...it lied",
  // Obsidian Lodge, "polite agreement not to notice",
  // entities have rules not in English
  function seqVictorian() {
    var D = 43;
    return [
      {txt:'', d:700},
      {txt:'London, November 1891',                             col:C.dK, tw:1, cd:32,     d:200},
      {txt:'', d:350},
      {txt:'The Enlightenment promised',                        col:C.WH, tw:1, cd:D,      d:100},
      {txt:'reason would banish the darkness.',                 col:C.WH, tw:1, cd:D*0.8,  d:80},
      {txt:'', d:300},
      {txt:'It lied.',                                          col:C.lG, tw:1, cd:D*2,    d:100},
      {txt:'', d:600},
      {txt:'The Obsidian Lodge contains what it can.',          col:C.WH, tw:1, cd:D*0.8,  d:200},
      {txt:'Scotland Yard investigates what it understands.',   col:C.lG, tw:1, cd:D*0.7,  d:100},
      {txt:'', d:400},
      {txt:'The horror is not that the monsters exist.',        col:C.WH, tw:1, cd:D*0.7,  d:200},
      {txt:'It\'s that they always have.',                      col:C.WH, tw:1, cd:D,      d:80},
      {txt:'', d:300},
      {txt:'The rational world has been',                       col:C.dK, tw:1, cd:D*0.8,  d:200},
      {txt:'a polite agreement not to notice.',                 col:C.dK, tw:1, cd:D*0.8,  d:80},
      {txt:'', d:500},
      {txt:'In the fog, in the mirrors -',                      col:C.lG, tw:1, cd:D,      d:300},
      {txt:'something ancient is paying attention.',            col:C.bR, tw:1, cd:D*0.9,  d:80},
      {txt:'', d:1000},
      // Second hand - different colour, uninvited
      {txt:'The entities have rules.',                          col:C.bR, tw:1, cd:D*1.3,  d:400},
      {txt:'The rules are not in English.',                     col:C.bR, tw:1, cd:D*1.6,  d:200},
      {txt:'', d:800},
      {txt:'THE GASLIGHT CHRONICLES',                           col:C.WH, title:true, d:300},
      {txt:'FATE CONDENSED  //  GOTHIC COSMIC HORROR IN GASLIT LONDON', col:C.dK, sub:true, d:200},
      {txt:'', d:300},
      {txt:'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', col:C.dK, d:80},
    ];
  }

  // ── THE LONG AFTER ────────────────────────────────────────
  // Thundarr/He-Man register: elder narrating myth to someone born after.
  // Grounded in: "world that replaced it thinks the debris is magic",
  // warlords read error messages, Phade not gods, vaults learn about you
  function seqLongAfter() {
    var F = 1600;
    return [
      {txt:'', d:900},
      {txt:'This is what we know.',                            col:C.bG, fade:1800, d:700},
      {txt:'', d:1000},
      {txt:'The world ended.',                                 col:C.dG, fade:F,    d:600},
      {txt:'', d:600},
      {txt:'The world that replaced it',                       col:C.dG, fade:F,    d:500},
      {txt:'thinks the debris is magic.',                      col:C.bG, fade:2000, d:300},
      {txt:'', d:900},
      {txt:'The ancient Phade vaults lie open',                col:C.dG, fade:1400, d:500},
      {txt:'in a landscape of sand and fungal forest.',        col:C.dG, fade:1400, d:300},
      {txt:'', d:600},
      {txt:'The warlords claim divine authority',              col:C.dK, fade:1400, d:500},
      {txt:'because they can read the error messages.',        col:C.bR, fade:1800, d:300},
      {txt:'', d:700},
      {txt:'The Phade are not gods.',                          col:C.bG, fade:2000, d:600},
      {txt:'', d:500},
      {txt:'The warlords know this.',                          col:C.dK, fade:1400, d:400},
      {txt:'The people do not.',                               col:C.bR, fade:1800, d:300},
      {txt:'', d:1000},
      {txt:'Every vault teaches you something.',               col:C.dG, fade:1600, d:600},
      {txt:'', d:500},
      {txt:'And something in the vault',                       col:C.dK, fade:1400, d:400},
      {txt:'learns about you.',                                col:C.bG, fade:2200, d:300},
      {txt:'', d:1200},
      {txt:'THE LONG AFTER',                                   col:C.bG, title:true, fade:2800, d:400},
      {txt:'FATE CONDENSED  //  SWORD-AND-PLANET DYING EARTH', col:C.dG, sub:true,  fade:2200, d:300},
      {txt:'', d:300},
      {txt:'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', col:C.dG, fade:1400, d:100},
    ];
  }


  // ── DUST AND IRON ─────────────────────────────────────────
  // Register: bone-dry, economical, one word at a time.
  // The land as character. The law as the problem.
  function seqWestern() {
    var D = 1.0;
    return [
      {txt:'', d:900},
      {txt:'The survey stakes went in at dawn.',               col:C.bY, fade:1600, d:600},
      {txt:'', d:800},
      {txt:'The homesteaders pulled them up by noon.',         col:C.dG, fade:1400, d:500},
      {txt:'', d:600},
      {txt:'The Harker Company rode in at three.',             col:C.bR, fade:1800, d:400},
      {txt:'', d:1200},
      {txt:'The law came too.',                                col:C.dK, fade:1400, d:600},
      {txt:'', d:500},
      {txt:'The law was on the company side.',                 col:C.bR, fade:2000, d:400},
      {txt:'', d:1000},
      {txt:'This is the frontier.',                            col:C.bY, fade:1800, d:700},
      {txt:'', d:600},
      {txt:'It has always worked this way.',                   col:C.dK, fade:1600, d:500},
      {txt:'', d:800},
      {txt:'Until today.',                                     col:C.WH, fade:2200, d:300},
      {txt:'', d:1400},
      {txt:'DUST AND IRON',                                    col:C.bY, title:true, fade:2800, d:400},
      {txt:'FATE CONDENSED  //  FRONTIER WESTERN',             col:C.dY, sub:true,  fade:2200, d:300},
      {txt:'', d:300},
      {txt:'- - - - - - - - - - - - - - - - - - - - - - - -', col:C.dY, fade:1400, d:100},
    ];
  }

  var SEQUENCES = {
    index:       seqIndex,
    cyberpunk:   seqCyberpunk,
    postapoc:    seqPostApoc,
    fantasy:     seqFantasy,
    space:       seqSpace,
    victorian:   seqVictorian,
    thelongafter: seqLongAfter,
    western:      seqWestern,
  };

  // ── Title card (return visit) ─────────────────────────────
  function seqTitleCard(worldKey) {
    var m = META[worldKey] || META.index;
    var titleCol = worldKey === 'cyberpunk'   ? C.bC  :
                   worldKey === 'postapoc'    ? C.bY  :
                   worldKey === 'fantasy'     ? C.bM  :
                   worldKey === 'space'       ? C.bB  :
                   worldKey === 'victorian'   ? C.lG  :
                   worldKey === 'thelongafter'? C.bG  :
                   worldKey === 'western'     ? C.bY  :
                   C.gd; // index
    return [
      {txt:'', d:400},
      {txt:m.title, col:titleCol, title:true, fade:1000, d:300},
      {txt:m.sub,   col:C.dK,    sub:true,   fade:800,  d:200},
      {txt:'', d:600},
    ];
  }

  // ── Overlay builder ───────────────────────────────────────
  function buildOverlay(worldKey) {
    var meta = META[worldKey] || META.index;
    var ov = document.createElement('div');
    ov.id = 'fate-intro-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Campaign introduction');
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'background:' + meta.bg,
      'font-family:\'Courier New\',\'Lucida Console\',Consolas,monospace',
      'font-size:14px', 'line-height:1.45',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:60px 24px 100px',
      'cursor:pointer',
      'transition:opacity ' + FADE_MS + 'ms ease',
      'opacity:1',
    ].join(';');

    // CRT layer 1 - static scanlines
    var scan = document.createElement('div');
    scan.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;' +
      'background:repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,' +
      'rgba(0,0,0,0.13) 3px,rgba(0,0,0,0.13) 4px);';
    ov.appendChild(scan);

    // CRT layer 2 - rolling scan band (reduced-motion aware)
    var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!noMotion) {
      var roll = document.createElement('div');
      roll.className = 'fate-crt-roll';
      roll.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;' +
        'background:linear-gradient(to bottom,' +
        'transparent 0%,rgba(255,255,255,0.012) 48%,rgba(255,255,255,0.025) 50%,' +
        'rgba(255,255,255,0.012) 52%,transparent 100%);' +
        'animation:fate-crt-roll 7s linear infinite;';
      ov.appendChild(roll);
    }

    // CRT layer 3 - vignette
    var vig = document.createElement('div');
    vig.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;' +
      'background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,0.55) 100%);';
    ov.appendChild(vig);

    // Content
    var content = document.createElement('div');
    content.className = 'fate-intro-content';
    content.style.cssText = 'position:relative;z-index:2;max-width:640px;width:100%;';
    ov.appendChild(content);

    // Skip hint
    var hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;bottom:20px;left:24px;' +
      'color:#1e1e1e;font-size:9px;letter-spacing:2px;text-transform:uppercase;';
    hint.textContent = 'click or press any key to skip';
    ov.appendChild(hint);

    return {ov: ov, content: content};
  }

  // ── Animation engine ──────────────────────────────────────
  var timers = [];
  var done = false;
  var overlayEl = null;

  function clearTimers() {
    timers.forEach(function(t) { clearTimeout(t); });
    timers = [];
  }

  function dismiss() {
    if (!overlayEl) return;
    clearTimers();
    overlayEl.style.opacity = '0';
    var el = overlayEl;
    setTimeout(function() {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, FADE_MS);
    overlayEl = null;
  }

  function makeDelay(ms) {
    return new Promise(function(res) {
      timers.push(setTimeout(res, ms));
    });
  }

  function typewriteEl(el, txt, cd, col) {
    return new Promise(function(res) {
      var i = 0;
      var cursorStyle = 'display:inline-block;width:7px;height:0.88em;' +
        'vertical-align:text-bottom;background:' + (col || '#AAAAAA') + ';' +
        'animation:fate-blink 0.75s step-end infinite;';

      function tick() {
        if (!overlayEl) { res(); return; }
        if (i > txt.length) { el.innerHTML = txt; res(); return; }
        el.innerHTML = txt.slice(0, i) +
          (i < txt.length
            ? '<span style="' + cursorStyle + '"></span>'
            : '');
        i++;
        timers.push(setTimeout(tick, cd + Math.random() * cd * 0.25));
      }
      tick();
    });
  }

  async function runSequence(seq, content) {
    for (var i = 0; i < seq.length; i++) {
      if (!overlayEl) return;
      var s = seq[i];

      var el = document.createElement('span');
      el.style.cssText = 'display:block;white-space:pre-wrap;';
      el.className = 'fate-crt-line';

      // Title / sub styling
      if (s.title) {
        el.style.cssText += 'font-size:1.57em;letter-spacing:9px;text-transform:uppercase;' +
          'margin:28px 0 6px;color:' + (s.col || '#FFFFFF') + ';';
      } else if (s.sub) {
        el.style.cssText += 'font-size:0.71em;letter-spacing:3px;color:' + (s.col || '#555555') + ';';
      } else {
        el.style.color = s.col || '#AAAAAA';
      }

      // Fade setup
      if (s.fade) {
        el.style.opacity = '0';
        el.style.transition = 'opacity ' + s.fade + 'ms ease';
      } else {
        el.style.opacity = '1';
      }

      content.appendChild(el);
      content.appendChild(document.createTextNode('\n'));

      // Delay before this step
      if (s.d) await makeDelay(s.d);
      if (!overlayEl) return;

      if (s.tw) {
        el.style.opacity = '1';
        await typewriteEl(el, s.txt || '', s.cd || 40, s.col);
      } else {
        el.textContent = s.txt || '';
        if (s.fade) {
          // Force reflow
          void el.offsetHeight;
          el.style.opacity = '1';
          await makeDelay(s.fade * 0.3); // let it breathe
        }
      }
    }
  }

  // Enter prompt after sequence completes
  async function showEnterPrompt(content, worldKey) {
    if (!overlayEl) return;
    var accentCol = worldKey === 'cyberpunk'    ? C.bC  :
                    worldKey === 'postapoc'     ? C.bY  :
                    worldKey === 'fantasy'      ? C.bM  :
                    worldKey === 'space'        ? C.bB  :
                    worldKey === 'victorian'    ? C.lG  :
                    worldKey === 'thelongafter' ? C.bG  :
                    C.gd;
    await makeDelay(400);
    if (!overlayEl) return;
    var p = document.createElement('div');
    p.style.cssText = 'margin-top:24px;font-size:11px;letter-spacing:3px;' +
      'color:' + accentCol + ';animation:fate-blink 1s step-end infinite;';
    p.textContent = '[ CLICK OR PRESS ANY KEY TO ENTER ]';
    content.appendChild(p);
  }

  // ── Inject keyframe CSS ───────────────────────────────────
  function injectCSS() {
    if (document.getElementById('fate-intro-css')) return;
    var style = document.createElement('style');
    style.id = 'fate-intro-css';
    style.textContent = [
      '@keyframes fate-blink{0%,100%{opacity:1}50%{opacity:0}}',
      '@keyframes fate-crt-roll{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}',
      // Phosphor glow on typed text - applied per-element by renderLine
      '.fate-crt-line{text-shadow:0 0 6px currentColor,0 0 2px currentColor;}',
      '@media(prefers-reduced-motion:reduce){.fate-crt-roll{animation:none!important}}',
      // Desktop scale-up - wider column, larger type
      '@media(min-width:900px){' +
        '#fate-intro-overlay{font-size:17px!important;padding:80px 48px 120px!important}' +
        '.fate-intro-content{max-width:860px!important}' +
      '}',
      '@media(min-width:1400px){' +
        '#fate-intro-overlay{font-size:19px!important}' +
        '.fate-intro-content{max-width:1000px!important}' +
      '}',
    ].join('');
    document.head.appendChild(style);
  }

  // ── Main entry ────────────────────────────────────────────
  function init() {
    injectCSS();

    var worldKey = detectWorld();
    var seqFn = SEQUENCES[worldKey];
    if (!seqFn) return; // unknown world, bail

    var seen = false;
    try { seen = LS.getIntroSeen(worldKey); } catch(e) {}

    var seq = seen ? seqTitleCard(worldKey) : seqFn();

    var built = buildOverlay(worldKey);
    overlayEl = built.ov;
    var content = built.content;

    document.body.appendChild(overlayEl);

    // Mark as seen
    try { LS.setIntroSeen(worldKey, true); } catch(e) {}

    // Skip handlers
    function skip() {
      done = true;
      dismiss();
    }
    overlayEl.addEventListener('click', skip);
    function keySkip(e) {
      if (['Space','Enter','Escape'].indexOf(e.code) !== -1 || e.key) {
        document.removeEventListener('keydown', keySkip);
        skip();
      }
    }
    document.addEventListener('keydown', keySkip);

    // Run
    runSequence(seq, content).then(function() {
      if (!overlayEl) return;
      showEnterPrompt(content, worldKey).then(function() {
        // Auto-dismiss title cards after a short pause
        if (seen) {
          setTimeout(function() { if (overlayEl) dismiss(); }, 2200);
        }
      });
    });
  }

  // ── Public API ────────────────────────────────────────────
  // window.fateReplayIntro() - forces the full sequence regardless
  // of whether the user has seen it before. Called by nav button.
  window.fateReplayIntro = function() {
    var worldKey = detectWorld();
    // Clear seen flag so full sequence plays
    try { LS.removeIntroSeen(worldKey); } catch(e) {}
    // Dismiss any existing overlay cleanly, then reinit
    if (overlayEl) dismiss();
    setTimeout(init, overlayEl ? FADE_MS + 50 : 0);
  };

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay so React app can mount underneath
    setTimeout(init, 80);
  }

})();
