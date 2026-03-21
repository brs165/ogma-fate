# Ogma - A Fate Condensed Generator Suite

An offline, browser-based random content generator for **Fate Condensed** tabletop RPG campaigns.

> *Named for the Celtic god of eloquence - the one who gave language its shape. Also a backronym: **Offline Game Master's Aid**.* Offline after first visit. Pure random tables with a clean UI.

> **16 generators · 8 campaign worlds · offline after first load**

> *Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.*

---

## Quick Start

1. Download and unzip the archive - or clone this repo
2. Open `index.html` in any modern browser
3. Pick a campaign world
4. Pick a generator and click **Roll**

Hosted on GitHub Pages. Works fully offline after first load via service worker.


---

## If you expect `npm install`

| Your expectation | Reality in Ogma |
|-----------------|-----------------|
| `npm install` | Nothing to install — no build step |
| `npm run dev` | Run `npx serve .` or any static server |
| `npm run build` | No build — source files ARE the app |
| `import` / `require` | Globals loaded by `<script>` tag order |
| TypeScript | Plain JS with comments |
| `.env` files | Config lives in `core/config.js` |
| HMR / hot reload | Manual browser refresh |

---

## Campaign Worlds

| World | Genre | Tagline |
|-------|-------|---------|
| **The Long After** | Sword-and-planet dying earth | The world that replaced it thinks the debris is magic |
| **Neon Abyss** | Cyberpunk dystopia | Your augments are your résumé and your leash |
| **Shattered Kingdoms** | Dark fantasy | Magic is the scar tissue of a war that broke the world |
| **Void Runners** | Blue-collar space western | Everyone else is trying to make the ship payment |
| **The Gaslight Chronicles** | Gothic cosmic horror | The Enlightenment lied |
| **The Long Road** | Lyrical post-apocalypse | The question is what kind of world you build with what you salvage |
| **Dust and Iron** | Frontier western | Railroad money. Frontier justice. The weight of the old war. |
| **The dVenti Realm** | High fantasy / D&D bridge | The Senate collapsed 30 years ago. The vaults are still here. |

Each world has deep thematic table content. The same 16 generators produce tonally distinct output in every world.

---

## Generators

| Generator | Output |
|-----------|--------|
| **Minor NPC** | Name · 1–2 aspects · skills · stress track |
| **Major NPC** | Name · 5 aspects · full skill pyramid · 2 stunts |
| **Scene Setup** | 3–5 situation aspects by category · 2–4 zones · scene framing questions |
| **Campaign Frame** | Current issue · impending issue · 3 setting aspects |
| **Encounter** | Opposition stat blocks · scene aspects · victory/defeat conditions · twist |
| **Adventure Seed** | 3-scene scenario skeleton · opposition · twist · campaign tie-in |
| **Compel Offer** | Situation · consequence · event/decision framing template |
| **Challenge** | Type · primary/opposing skills · success and failure states · stakes |
| **Contest** | Opposed exchanges · two sides · victory track · tie-twists · stakes |
| **Consequence** | Severity (random or selectable) · named aspect · context · compel hook |
| **Faction** | Name · goal · method · weakness · named face NPC |
| **Complication** | New aspect · arriving NPC · environment shift · spotlight note |
| **PC Backstory** | Session zero questions · relationship web exercise · opening hook |
| **Obstacle** *(universal)* | Hazard · Block · Distraction per Fate Condensed p.49–51 |
| **Countdown** *(universal)* | Named clock · trigger condition · zero outcome |
| **Constraint** *(universal)* | Limitation · Resistance with bypass method |

---

## Features

**Campaign Intros** - Each campaign opens with an animated intro sequence with a distinct voice per world. Skip anytime. Replay via **▶ Intro** in the nav or mobile **⋯** menu.

**Fate Point Tracker** - ◎ FP opens a floating panel. Add PCs by name, set refresh, spend and recover. Persists to `localStorage`.

**Inspiration Mode** - ✦ 3 draws three random results from different generators as a creative triptych.

**GM Tips** - 🎭 adds coaching overlays: invoke/compel examples, D&D contrast notes, rules references inline with every result.

**Table Manager** - 🎛 Customize lets you exclude entries, lock specific entries, or add your own custom content to any string table. Saved per campaign via IndexedDB.

**Player View** - 👥 hides all GM coaching notes, leaving only player-facing content for projecting at the table.

**Session Zero Wizard** - `campaigns/sessionzero.html` walks a new table through Fate Condensed character creation with D&D contrast notes at every step.

**Coming from D&D?** - `campaigns/transition.html` is a side-by-side guide covering every major conceptual difference between D&D 5e and Fate Condensed.

**Export** - ↓ MD copies results as formatted Markdown. 🖨 Print hides all UI chrome and formats cleanly for A4/Letter.

**Pinned Results** - 📌 saves any result to a persistent pinned list (IndexedDB). Survives reloads.

**Consequence Severity Selector** - When the Consequence generator is active, a severity bar appears: Random / Mild / Moderate / Severe.

**Universal Content Toggle** - Merges 163 setting-agnostic entries into campaign tables. Default on. Saved to `localStorage`.

**Dark / Light Mode** - ◑ toggle, saved to `localStorage`.

**Offline / PWA** - Works fully offline after first load. Installable on iOS, Android, and desktop Chrome.

---

## File Structure

```
fate-suite/
├── index.html                    ← Landing page (loads all campaign data)
│
├── campaigns/
│   ├── cyberpunk.html            ┐
│   ├── fantasy.html              │
│   ├── postapoc.html             ├─ Campaign generator pages
│   ├── space.html                │
│   ├── thelongafter.html         │
│   ├── victorian.html            ┘
│   ├── guide-cyberpunk.html      ┐
│   ├── guide-fantasy.html        │
│   ├── guide-postapoc.html       ├─ Campaign world guide pages (static HTML)
│   ├── guide-space.html          │
│   ├── guide-thelongafter.html   │
│   ├── guide-victorian.html      ┘
│   ├── sessionzero.html          ← Session Zero character creation wizard
│   └── transition.html           ← Coming from D&D? guide
│
├── core/
│   ├── engine.js                 ← Pure logic - generators, table prefs, markdown export
│   │                               Zero React/DOM dependencies - testable in Node
│   ├── ui.js                     ← CampaignApp shell, sync, all campaign components
│   ├── ui-renderers.js           ← 16 result renderers (dossier cards)
│   ├── ui-table.js               ← PrepCanvas + Table canvas components
│   ├── ui-run.js                 ← Run session surface components
│   ├── ui-modals.js              ← Modal, ShareDrawer, Settings, Vault, QuickFind
│   ├── ui-primitives.js          ← React aliases (h), FD primitives, ErrorBoundary
│   ├── ui-landing.js             ← Landing page components
│   ├── db.js                     ← IndexedDB wrapper with localStorage fallback
│   ├── config.js                 ← OGMA_CONFIG (REPO_BASE, DEFAULT_SYNC_HOST)
│   └── intro.js                  ← Campaign intro overlay engine (self-contained, no deps)
│
├── data/
│   ├── shared.js                 ← GENERATORS, HELP_CONTENT, ALL_SKILLS, CAMPAIGNS = {}
│   ├── universal.js              ← Setting-agnostic tables: obstacles, countdowns,
│   │                               constraints, stunts, consequences, compels, templates
│   ├── cyberpunk.js              ← Neon Abyss tables
│   ├── fantasy.js                ← Shattered Kingdoms tables
│   ├── postapoc.js               ← The Long Road tables
│   ├── space.js                  ← Void Runners tables
│   ├── thelongafter.js           ← The Long After tables
│   ├── victorian.js              ← The Gaslight Chronicles tables
│   ├── western.js                ← Dust and Iron tables
│   └── dVentiRealm.js            ← dVenti Realm tables
│
├── assets/
│   ├── css/theme.css             ← Design system, dark/light, print, campaign theming
│   ├── img/og-default.png        ← OpenGraph social preview (1200×630)
│   └── favicons/                 ← icon.svg, icon-32/192/512.png, apple-touch-icon.png
│
├── manifest.json                 ← PWA manifest (install, shortcuts, icons)
├── sw.js                         ← Service worker - cache-first, offline-first
├── ROADMAP.md                    ← Open work — source of truth for all planned work
├── CHANGELOG.md                  ← Full version history
├── ARCHITECTURE.md               ← Architecture deep-dive for contributors
├── LICENSING.md                  ← CC BY 3.0 compliance and required attributions
├── docs/                         ← Contributor reference docs + ADRs + AI session docs
├── scripts/                      ← Build tools (bump-version.sh, PDF builders, CDN verify)
├── tests/                        ← Test suite (engine.test.js, qa_named.js)
└── README.md                     ← This file
```

### Script Load Order

Each campaign page loads scripts in this exact order:

```html
<script src="https://cdnjs.cloudflare.com/.../react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/.../react-dom.production.min.js"></script>
<script src="../data/shared.js?v=N"></script>
<script src="../data/universal.js?v=N"></script>
<script src="../data/[campaign].js?v=N"></script>
<script src="../core/engine.js?v=N"></script>
<script src="../core/ui-renderers.js?v=N"></script>
<script src="../core/ui-table.js?v=N"></script>
<script src="../core/ui-modals.js?v=N"></script>
<script src="../core/ui-landing.js?v=N"></script>
<script src="../core/ui.js?v=N"></script>
<script src="../core/db.js?v=N"></script>
<script src="../core/intro.js?v=N"></script>
```

`index.html` loads all six campaign data files. The `?v=N` parameter is stamped by `bump-version.sh`.

---

## Architecture Notes

- **No build step.** Raw JavaScript via `<script>` tags. React 18 via CDN UMD.
- Currently var-only — migrating to ES Modules in a future sprint.
- **Pure random tables.** Deterministic, instant, offline - no network calls of any kind.
- **Variety Matrix.** Tables using `{t:[...], v:{...}}` produce thousands of unique combinations from compact data. `fillTemplate()` picks a template and substitutes `{VarName}` tokens.
- **Universal layer.** `mergeUniversal()` concatenates setting-agnostic entries into campaign tables without mutating the originals.
- **IndexedDB persistence.** Session state and table preferences stored per campaign, with in-memory fallback.

---

## Smoke Test

Verify all 96 generator/campaign combinations after editing data files:

```bash
node -e "
var CAMPAIGNS={};
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(c){
  eval(fs.readFileSync('data/'+c+'.js','utf8'));
});
eval(fs.readFileSync('core/engine.js','utf8'));
var camps=['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'];
var gens=['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'];
var errs=[];var total=0;
camps.forEach(function(camp){
  var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});
  gens.forEach(function(gen){
    try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}
    catch(e){errs.push(camp+'/'+gen+': '+e.message);}
  });
});
console.log('Smoke: '+total+'/96  errors:'+errs.length);
"
```

Expected: `Smoke: 96/96  errors:0`

For the full named assertion suite, run `node qa_named.js` from the project root.

---

## Rules Accuracy

Built against **Fate Condensed** (Evil Hat, 2020), audited against the full Fate SRD library:

- Stress boxes are all single-point (not Fate Core's escalating model)
- Major NPC stress calculated from Physique/Will per Fate Condensed p.12
- Initiative is popcorn/Balsera-style - acting character picks who goes next
- Stunts are `+2 to [Skill] when [Condition]` or a once-per-scene special effect
- Full 19-skill list including Academics
- GM fate point pool = 1 per PC (shared pool, not per-NPC)
- Create Advantage tie on a new aspect yields a boost, not a free invoke
- Consequence recovery requires a treatment overcome roll before clearing timers begin
- Opposition follows the Fate Adversary Toolkit threat/hitter/boss/filler framework

---

## Versioning

**CalVer:** `YYYY.MM.B` - year · month · build within that month. Run `bump-version.sh` before every zip. No argument needed - the script reads the current version and auto-increments.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

Most valuable contributions:
1. **Rules accuracy reports** — cite the FCon SRD page
2. **Content quality** — world voice, aspect quality bar
3. **Accessibility** — WCAG 2.1 AA, keyboard nav, screen reader
4. **Bug reports** — include world + generator type

---

## License

CC BY 3.0 - see `LICENSING.md` for required attribution blocks.

Fate™ is a trademark of Evil Hat Productions, LLC. This is an independent fan project, not affiliated with or endorsed by Evil Hat Productions.
