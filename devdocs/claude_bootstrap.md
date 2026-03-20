# Ogma — Claude Bootstrap

> **What this is:** The single file that reconstitutes the entire Ogma project for a new Claude session.
> Paste this file as your first message, or point Claude at it with "read devdocs/claude_bootstrap.md".
> Everything needed to start working is here. No other context required.
>
> **Last updated:** 2026.03.214
> **Update rule:** Update this file whenever a major capability ships, a constraint changes, a world is added, or QA numbers change. When the build number ends in `.2`, review ALL devdocs before shipping.

---

## The project in one paragraph

**Ogma** is a browser-based, fully offline progressive web app that generates ready-to-use Fate Condensed TTRPG content for Game Masters. It has four pillars: **Learn** (interactive Fate tutorials), **Prep** (16 generators × 8 campaign worlds = 128 combinations), **Table** (full-screen canvas session surface with cards, players, dice, zones, multiplayer sync), and **Export** (Fari JSON, Markdown, print/PDF). No AI in the output. No backend. No build step. Offline after first load via service worker.

**Live:** https://ogma.net (Cloudflare Pages)
**Repo:** github.com/brs165/ogma-fate
**Working directory:** `/home/claude/fate-suite-new/`
**Current version:** 2026.03.214
**QA baseline:** 103/103 named assertions · 128/128 smoke (8 worlds × 16 generators)

---

## Architecture — non-negotiable constraints

- **HTTPS-first.** Requires web server for first load. `file://` dropped in v91. Use localhost or GitHub Pages.
- **React 18 via CDN UMD.** `React.createElement` aliased as `h`. No JSX, no bundler, no TypeScript.
- **No build step.** Raw `<script>` tags. The entire stack runs in Node for testing.
- **Offline after first load.** Service worker (sw.js) caches APP_SHELL. IDB (Dexie 4) for persistence.
- **GitHub deployment is blocked from the container** (egress restrictions). Workflow: build in container → download zip → push locally.
- **No AI in generated output.** The tables are hand-authored. This is intentional and permanent.
- **`<base href="/">` on all campaign pages.** Cloudflare Pages Pretty URLs strip `.html`; base href ensures `../core/` relative paths resolve correctly.

**Script load order (campaign pages — must not change without updating sw.js and all campaign HTML):**
```
shared.js → universal.js → [campaign].js → engine.js → db.js →
ui-primitives.js → ui-renderers.js → ui-modals.js → ui-landing.js → ui.js → intro.js
```
Campaign pages also load `assets/js/partysocket.js` before `ui-renderers.js` (multiplayer WebSocket client).

**`core/engine.js`** has zero React/DOM dependencies — stays testable in Node. Never import React into it.

---

## Key files

| File | Role |
|------|------|
| `data/shared.js` | GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, SKILL_LABEL, TABLE_GROUPS, ALL_SKILLS, `CAMPAIGNS = {}` |
| `data/shared-lite.js` | 2.8KB landing bootstrap (96% JS reduction — campaign data loads on demand) |
| `data/universal.js` | Setting-agnostic tables merged at runtime via `mergeUniversal()` |
| `data/[world].js` | Campaign tables (8 files: thelongafter, cyberpunk, fantasy, space, victorian, postapoc, western, dVentiRealm) |
| `core/engine.js` | All generator logic: `generate()`, `pick()`, `fillTemplate()`, `mergeUniversal()`, `filteredTables()`, `toMarkdown()`, `toFariJSON()` |
| `core/ui-primitives.js` | React aliases (`h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment`), TIMING, RA_ICONS, theme/textsize helpers, all FD card primitives, `scoreAspect()` |
| `core/ui-renderers.js` | All 16 result renderers + `renderResult()` + `renderCard()` (FlipCard) + `StuntSuggester` + **Table canvas** (`PrepCanvas`, `TpHeroModal`, `TpGenDropdown`, `TpPlayerRow`, `TpDicePanel`, `TpCardBody`, `TpTurnBar`) |
| `core/ui-modals.js` | `Modal` primitive, `ShareDrawer`, `KBShortcutsModal`, `SettingsModal`, `VaultPanel`, `QuickFindBar`, `SessionDoc` |
| `core/ui-landing.js` | `CAMPAIGN_PAGES`, `CAMPAIGN_INFO`, `CAMPAIGN_GUIDE_PAGES` + `LandingApp` |
| `core/ui.js` | `TableManagerModal`, `MilestoneTracker`, `PopcornTracker`, `CountdownTracker`, `FatePointTracker`, `SessionPackPanel`, `ResultHelpPanel`, `CampaignApp` (main shell) — also contains `createTableSync`, `generateTableRoomCode`, sync state vars, `hostTable`/`joinTable`/`disconnectTable` |
| `core/db.js` | Dexie 4 IDB wrapper. `LS` (localStorage prefs), `DB` (IDB sessions + cards). Migration from legacy localStorage on first open. |
| `core/intro.js` | Campaign intro animation engine. Guide pages (`guide-*.html`) do NOT trigger the fullscreen overlay — `isGuidePage()` guard added. |
| `sw.js` | Service worker. `APP_SHELL` array must include every HTML page and core asset. Cache name = `fate-generator-{CalVer}`. CDN scripts are NOT intercepted — `if (isCDN) return` lets browser handle with full CORS headers. `self.skipWaiting()` on install for immediate takeover. |
| `assets/css/theme.css` | Full design system (~2200 lines). Dark/light themes, campaign accent vars, all component CSS including Table canvas (`.cc-*`, `.tp-*`, `.rs-*`, `.dr-*`, hero modal, gen callout, dropdown menus). |
| `assets/js/partysocket.js` | **Vendored 101-line WebSocket reconnect client** — see partysocket section below. |
| `assets/js/dice-roller.js` | `buildWidget()` dice roller. Exposes `window.ogmaMountDiceRollers(nodes)` for dynamic mounting in hero modal. |
| `campaigns/run.html` | Run session surface (~1700 lines inline React). Canvas, player roster, FP tracker, dice roller, GM/player view, multiplayer sync (`createSync`, `hostOnline`, `joinRoom`). |
| `_headers` | Cloudflare Pages CSP — `script-src` allows cdnjs + cloudflareinsights; `connect-src` allows `wss://*.workers.dev`. NOT in SW APP_SHELL (CF Pages consumes it). |
| `qa_named.js` | 103 named assertions. Run before every release. `node devdocs/qa_named.js` |
| `devdocs/bump-version.sh` | CalVer stamping. Run before every zip. `bash devdocs/bump-version.sh` |
| `devdocs/BACKLOG.md` | **Source of truth** for all planned work |
| `devdocs/CHANGELOG.md` | Complete version history, reverse-chronological |
| `devdocs/claude_bootstrap.md` | **This file** |

---

## The 8 campaign worlds

| Key | Name | Tagline |
|-----|------|---------|
| `thelongafter` | The Long After | The past is high-tech. Ancient Phade vaults litter a dying world. |
| `cyberpunk` | Neon Abyss | Corporate dystopia in Meridian. |
| `fantasy` | Shattered Kingdoms | The empire fell. The ashes are still warm. |
| `space` | Void Runners | Freelancers, salvage, and the things that live in the dark between stars. |
| `victorian` | The Gaslight Chronicles | Gothic cosmic horror. The veil is thin in the gaslit streets. |
| `postapoc` | The Long Road | The world ended. The convoy keeps moving. |
| `western` | Dust and Iron | Frontier justice. Railroad money. The weight of the old war. |
| `dVentiRealm` | The dVenti Realm | The Senate collapsed 30 years ago. The vaults are still here. |

---

## The Table canvas

`PrepCanvas` in `core/ui-renderers.js` is the full-screen interactive session surface. Key concepts:

- **Cards** live in `pinnedCards[]` (from `props.pinnedCards`/`props.setPinnedCards`). Position/size/extras live in `extras{}` keyed by card ID. Persisted to IDB via `persistCanvas()`.
- **Players** are `players[]` in local PrepCanvas state (not CampaignApp state). Synced via `updPlayer()`.
- **Hero modal** (`TpHeroModal`): tapping a card body (`.tp-card-expand-btn`) opens a full-screen FlipCard with blur backdrop. Synced to remote players via `card_expand` WebSocket message.
- **Category dropdowns** (`TpGenDropdown`): Characters / Scene / Mechanics / GM Note in the generate sub-bar callout.
- **Multiplayer**: `tableSync` prop from CampaignApp. `persistCanvas()` broadcasts state to players. Players receive `welcome`/`state` messages and apply via `useEffect` on `tableSync`. Card expand/collapse syncs via `card_expand`/`card_collapse` messages.
- **IDB key**: `SAVE_KEY = 'tp_canvas_' + campId`. Loaded on mount, saved on every state change.

---

## Multiplayer architecture

**Server:** `ogma-sync` Cloudflare Workers Durable Object at `ogma-sync.brs165.workers.dev`. Source: separate `ogma-sync/` repo (not in `fate-suite-new/`). DO class uses `new_sqlite_classes` migration (required for free tier).

**Client (run.html):** `createSync()` in run.html. GM role: `broadcastState()` on every `persist()`. Player role: receives `welcome`/`state`, applies to local React state.

**Client (Table/PrepCanvas):** `createTableSync()` in `core/ui.js`. Same protocol. `hostTable()`/`joinTable()`/`disconnectTable()` in CampaignApp. PrepCanvas receives `tableSync` prop and handles its own incoming state via `useEffect`.

**partysocket**: vendored at `assets/js/partysocket.js`. Loaded via `<script>` tag on all campaign pages and run.html. Exposes `window.PartySocket`. Auto-reconnects with exponential backoff. **Never replace with CDN** — no UMD build exists on any CDN.

**URL**: players join via `?room=XXXX`. CampaignApp and run.html both read `window.location.search` for auto-join on load. CF Pages strips `.html`, so join links use canonical paths (base href fixes this).

---

## QA — every release, no exceptions

```bash
# 1. Syntax (all core files)
node --check core/ui.js && node --check core/ui-primitives.js && \
node --check core/ui-renderers.js && node --check core/ui-modals.js && \
node --check core/ui-landing.js && node --check core/engine.js && \
node --check core/db.js && node --check core/intro.js

# 2. Smoke test (128/128 — 8 worlds × 16 generators)
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128  errors:'+errs.length);"

# 3. Named assertions (103 total)
node devdocs/qa_named.js
```

**Release checklist:**
1. `bash devdocs/bump-version.sh` — stamps CalVer in sw.js, all HTML asset refs, about.html
2. Update `devdocs/BACKLOG.md` — version header + completed items
3. All 3 QA gates green
4. `cd /home/claude && zip -r /mnt/user-data/outputs/ogma-YYYY.MM.B.zip fate-suite-new/ --exclude "*.DS_Store" --exclude "fate-suite-new/.git/*" -q`

---

## Rules accuracy — Fate Condensed is the authority

| Rule | FCon correct | Common mistake |
|------|-------------|----------------|
| Stress boxes | ALL are 1-point | Core has escalating 1/2/3 boxes |
| Advancement | **Milestone** (session-end), **Breakthrough** (arc-end) | "Significant milestone" — does NOT exist in FCon |
| Stunts cost | 3 free, each beyond = −1 Refresh. **Never cost a Fate Point.** | NA-03 catches Fate Point stunts |
| Stunt scope | Must not fire every roll | "+2 to all Fight rolls" is illegal |
| Major NPC refresh | `Math.max(1, 3 - Math.max(0, stunts.length - 3))` | Hardcoded values |
| GM fate point pool | 1 per PC (shared, not per NPC) | Per-NPC pool |
| Opposition skill cap | Max 5 (Superb) | NA-66 catches violations |
| Consequence recovery | Treatment overcome FIRST, then timing | Timing starts immediately |

**FCon sources (priority order):** Condensed SRD → Core SRD → FAE SRD → Adversary Toolkit → System Toolkit → Horror Toolkit, Book of Hanz, Fate Space (supplementary)

---

## partysocket (multiplayer WebSocket client)

`assets/js/partysocket.js` is a **vendored 101-line drop-in**, not the npm package.

The `partysocket` npm package ships ESM + CJS only — no UMD/IIFE/global build exists at any version. Every CDN URL (jsdelivr, unpkg) returns either `text/plain` (CJS served wrong MIME) or broken ESM (unresolved internal imports). There is no `dist/index.global.js` or `window.PartySocket` build.

**Do NOT replace this with a CDN script tag.** The vendored file implements exactly the API surface Ogma uses (`new PartySocket({host,room,query})`, `send`, `close`, `addEventListener`) with exponential backoff reconnect and message queuing. It is stable, same-origin, and requires no maintenance.

---

## Critical file write rules

| Rule | Enforcement |
|------|-------------|
| All Python `open()` file writes must use `encoding='utf-8'` explicitly | `open(path, 'w', encoding='utf-8')` — no default codec |
| All emoji and multi-byte chars in JS strings written from Python must use JS unicode escapes (`'\\uD83C\\uDFB2'`), never raw characters | Raw chars become surrogate pairs in Python source |
| Large block replacements must use **Node.js `fs.writeFileSync`**, not Python `str.replace()` | Node owns the encoding |
| After every write: `node --check <file> && echo OK` before proceeding | Catches syntax errors before QA or zip |

---

## Navigation structure (v214)

**Top bar:** Worlds | Prep | Learn | Help | Table (always visible) | theme toggle

**Generate sidebar (left tab):**
- Characters, Scenes, Pacing, World (generators)
- Tools: History, Session Notes, KB Shortcuts
- Settings: Customize Tables, Settings, Light/Dark

**Prep sidebar (right tab):**
- Tools: Countdown Tracker

**Removed:** Run button (top bar), Quick Prep Pack, Table Prep (Vault), FP Tracker, Navigate section

---

## What's open right now

**Testing (waiting on owner):**
- MP-07 / MP-13: Two-tab and two-network multiplayer tests — pending owner's 10hr test session
- Visual redesign confirmation (v214 fixed CSS duplicate bug that was cancelling styles)

**Parked, agreed:**
- "Join a Table" card on index.html — 30min, explicitly parked
- PDF books: Shattered Kingdoms, Neon Abyss, Void Runners, dVenti Realm, Dust and Iron (5 remaining)
- MP Phase 4 stretch: dice sync, remote rolling, cursor presence, session log

**Community (non-code):**
- WS-11: r/FATErpg post — draft in `gtm-launch-copy.md`. Blocked on repo going public.

**Parking lot (formal review 2027.03.01):** PERF-02, UX-18, PL-01, PL-02, SPA-06, EXP-01 (Fari export code preserved)

---

## How to start a new session

```
1. Read devdocs/BACKLOG.md — what's current?
2. Run baseline QA: node devdocs/qa_named.js
3. Check syntax: node --check core/ui.js && node --check core/ui-renderers.js
4. Build
```

---

## Absolute rules (never violate)

- No build steps, bundlers, or TypeScript
- No AI in generated output
- No shipping without all QA gates passing (syntax + smoke 128/128 + named 103/103)
- No `file://` references — use localhost or GitHub Pages
- No stunt that charges a Fate Point (NA-03 catches this)
- No opposition skill rating > 5 (NA-66 catches this)
- No "significant milestone" — not a FCon term
- No RPGAwesome — removed v91, replaced with native emoji
- No direct GitHub push from container — always deliver zip
- `bump-version.sh` before every zip, no exceptions
- `<base href="/">` must be present on all campaign HTML pages
- `_headers` must NOT be in SW APP_SHELL (CF Pages consumes it, never serves it as a URL)
- CDN scripts must NOT be in SW CDN_SCRIPTS — `if (isCDN) return` passes them through to browser
- **Never replace `assets/js/partysocket.js` with a CDN tag**

*This file is the single source of truth for new Claude sessions. Keep it current.*
