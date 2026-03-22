# Ogma — Claude Session Bootstrap

> Read this first at the start of every AI session.
> For outstanding owner-gated tasks see the **Active** section in `ROADMAP.md`.

---

## How to work

**Bias toward action.** The owner describes a problem. Read the relevant files, then fix it. Don't ask clarifying questions unless genuinely blocked. If two interpretations are equally valid, pick the less disruptive one, execute it, and note the assumption.

**Read before touching.** The codebase has load-order dependencies, paren-balance constraints, and encoding rules that break silently. Check CONVENTIONS.md before changing anything structural. The "Before changing any CSS" and "diff against known-good first" sections exist because we learned these the hard way.

**QA is not optional.** Run the full suite after every change. Bump version and zip only after all pass. "It looks right" is not QA.

**Deliver complete work.** When something is fixed it compiles, QA passes, and there's a zip. No partial fixes. No "you could also try."

**Propose before building complex features.** Anything touching multiple files or introducing a new pattern: describe the approach first, wait for confirmation. Simple fixes: just fix it.

**Workshop mode.** When reviewing or assessing, speak in distinct disciplinary voices with genuine disagreement where it exists. Engineering worries about things UX doesn't. Rules catches things content misses. One voice with different labels isn't a team.

**Tight writing.** As long as needed, no longer. No restating what was just said. No compliments before engaging. If something is a bad idea, say why and offer an alternative.

---

## What is Ogma?

Offline-first browser PWA for Fate Condensed GMs. 16 generators × 8 worlds. No build step — source files are the app. Deployed at ogma.net (Cloudflare Pages).

**Repo:** github.com/brs165/ogma-fate  
**Working dir:** repo root after `git clone`  
**Current version + QA baseline:** see `ROADMAP.md` header

---

## Key files

| File/Dir | Purpose |
|----------|---------|
| `core/engine.js` | All `generate*()` functions, PRNG, table ops. Pure JS — no React/DOM. |
| `core/ui.js` | `CampaignApp` shell — main campaign page component |
| `core/ui-renderers.js` | 16 result renderers + `renderCard()` → `cv4Card` (600×380, 5 categories, GM guidance back, interactive stress/countdown/contest/consequence, world colour via CSS vars) |
| `core/ui-table.js` | `PrepCanvas` + all Table canvas components |
| `core/ui-modals.js` | Modal, ShareDrawer, Settings, Vault, QuickFind, KBShortcuts |
| `core/ui-primitives.js` | React aliases (`h`), FD card primitives, `ErrorBoundary`, `scoreAspect()` |
| `core/ui-landing.js` | Landing page components |
| `core/ui-board.js` | `BoardApp` — unified Prep/Play canvas. Play mode: `BoardPlayerRow`, `BoardTurnBar`, `BoardPlayPanel`, player/round/FP/sync state |
| `core/ui-run.js` | **STRIPPED v330** — tombstone only. `createTableSync` in `ui.js` is the live sync factory. |
| `core/db.js` | Dexie 4 IDB wrapper, memStore fallback, `navigator.storage.persist()`, `DB.printCards()` — must live in second IIFE (`window.DB` block). First IIFE is localStorage prefs only. |
| `core/config.js` | `OGMA_CONFIG`: `REPO_BASE` (auto-detect), `DEFAULT_SYNC_HOST` |
| `core/intro.js` | Campaign intro animation (DOM, not React) |
| `data/shared.js` | `CAMPAIGNS={}`, `GENERATORS`, `ALL_SKILLS`, `HELP_CONTENT` |
| `data/universal.js` | Cross-world content merged at runtime |
| `data/[world].js` | 8 world data files |
| `sw.js` | Service worker, APP_SHELL cache |
| `ROADMAP.md` | **Source of truth** for all open work |
| `CHANGELOG.md` | Full version history |
| `tests/qa_named.js` | Named QA assertions |
| `scripts/bump-version.sh` | CalVer stamp — run before every zip/deploy |

---

## Engineering rules (non-negotiable)

| Rule | Why |
|------|-----|
| Python `open()` → `encoding='utf-8'` | Default codec corrupts emoji |
| Emoji in JS strings written from Python → unicode escapes | Raw chars become surrogate pairs |
| Large JS replacements → `fs.writeFileSync` in Node | Node owns encoding |
| Never redeclare `h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment` | All declared as `const` in `ui-primitives.js` — re-declaring with `var` in any other file is a `SyntaxError`. Full list of globals from `ui-primitives.js`: `h`, `useState`, `useCallback`, `useEffect`, `useRef`, `Fragment`, `RA_ICONS`, `TIMING`, `FaShareIcon`, `FaCartPlusIcon`, `FaFileArrowDownIcon`, `FaFileArrowUpIcon`. `ErrorBoundary` is also global (class component, sole exception to hooks-only rule). |
| After every write: `node --check <file> && echo OK` | Catch syntax before QA |
| Never replace `assets/js/partysocket.js` with a CDN tag | No UMD build exists |
| `_headers` must NOT be in SW `APP_SHELL` | Cloudflare Pages consumes it server-side |
| CDN scripts must NOT be SW-intercepted | SW intercept strips CORS headers |
| `<base href="/">` on all campaign HTML pages | CF Pages Pretty URLs strip `.html` |
| No `_redirects` file in repo | File removed v290 — caused redirect conflicts. CF Pages Pretty URLs handles `.html` stripping. Do not re-add. |
| `var foo = props.foo` not `var foo = foo` | Self-referential prop destructuring silently produces `undefined`, causing `ReferenceError` at render (v299 crash, v307 crash). Always write `props.X`. |
| All state vars used in `BoardApp` render must be declared | Undeclared vars are `undefined` globals — falsy gates work but setter calls throw. Declare every `useState` before use (v307 lesson). |
| Local function names must not shadow global renderers | `PrepCanvas` had `function renderCard(card,inZoneMode)` — shadowed global `renderCard(genId,data,...)` causing `card.id` crash (v321). Rename local functions when they conflict. |
| `printCards` belongs in `window.DB` (second IIFE in db.js) | First IIFE is localStorage prefs only. Anything that needs to be on `DB.X` must go in the second IIFE's `window.DB` object. (v325 lesson) |
| CI: use `npm install` not `npm ci` when no lock file committed | `npm ci` requires `package-lock.json`. `cache: 'npm'` on `setup-node` also requires a lock file. Use `npm install` or commit the lock file. |
| CI: QA job runs `tests/qa_named.js` not `devdocs/qa_named.js` | Path changed when tests/ dir was created. Always reference `tests/` not `devdocs/`. |
| `tableSyncCtx` object replaces 9 drilled sync props | `CampaignApp → PrepCanvas`: pass one context object, destructure inside. Avoids 9-prop drilling. See ARCHITECTURE.md sync section. |
| Write-only `useState` → `useRef` | If you never read the state value in JSX/render, it's not state — it's a ref. `useState` triggers re-renders; `useRef` does not. |
| `addPlayer(nameArg?)` accepts optional name | Passing a name skips the `prompt()`. Used by TBL-01 `player_hello` handler. Fallback is `prompt()` for manual GM add. |
| All `useState` calls go at the top of a component | Interleaving state declarations with effects and functions makes a component unreadable and fragile to reorganise. |
| Extract hooks when a component owns >3 related state+effect+handler groups | Use plain functions that call `useState`/`useEffect` — no React Context needed. Return an object, destructure in the parent. See useChromeHooks, useGeneratorSession, useBoardPlayState, useBoardSync. |
| Local function names must not shadow global `renderCard` | ui-table.js has a local `renderTpCard` (was `renderCard` — renamed v321). Shadowing the global caused a TypeError crash. Any new local function inside PrepCanvas must check for name collisions with `ui-renderers.js` globals. |
| **Option B layout**: no topbar in `CampaignApp` | `sb-slim-bar` (mobile-only header). Sidebar has `.sb-header` (wordmark + world chip) + Generate/Navigate tab pair. Navigate panel owns: All Worlds, Learn, Help, Board, Table Prep, theme toggle, online status. Do not add a new `<header class="topbar">` to campaign pages. |
| Card view must show all data fields | `cv4Front*` renderers in `ui-renderers.js` render every field in the generator output. When adding a new data field to a generator, update its `cv4Front*` function. Card view = dossier view in terms of information completeness. |

---

## QA commands

```bash
# Syntax check core files
node --check core/engine.js && node --check core/ui.js && node --check core/ui-table.js && node --check core/ui-board.js && node --check core/ui-renderers.js && node --check core/db.js

# Named assertions
node tests/qa_named.js

# Unit tests
node tests/engine.test.js

# Smoke test (128 generators × 8 worlds)
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128 errors:'+errs.length);if(errs.length)process.exit(1);"

# CDN integrity check
node scripts/check-cdn-versions.js

# Bump version (run before every deploy)
bash scripts/bump-version.sh
```

---

## Architecture — key decisions

| Decision | What | ADR |
|----------|------|-----|
| No build step | Source files = deployed files | `docs/decisions/0001-no-build-step.md` |
| React 18 via CDN UMD | `h` alias for `React.createElement` | `docs/decisions/0002-react-via-cdn.md` |
| Dexie 4 for IndexedDB | Promise-based, schema migrations | `docs/decisions/0003-dexie-for-storage.md` |
| Offline-first SW | Cache-first, all assets in `APP_SHELL` | `docs/decisions/0004-offline-first.md` |
| `ErrorBoundary` | Sole permitted class component | `core/ui-primitives.js` |

**Script load order** (enforced by `<script>` tag sequence in every campaign HTML):
```
[React CDN] → [ReactDOM CDN] → shared.js → universal.js → [world].js →
config.js → engine.js → [Dexie CDN] → db.js → ui-primitives.js → partysocket.js →
ui-renderers.js → ui-table.js → ui-modals.js → ui-landing.js → ui.js → intro.js
```
Board page: same up to ui-primitives.js, then: ui-renderers.js → ui-table.js → ui-modals.js → ui.js → ui-board.js (no ui-landing.js, no intro.js)
Run page: `run.html` now redirects to `board.html?mode=play` — no longer loads ui-run.js as root

---

## Multiplayer (ogma-sync)

- GM browser is source of truth. `ogma-sync` is a dumb Cloudflare Worker relay.
- First `?role=gm` connection gets GM tag — subsequent claims downgraded to player.
- `gmOnly` cards are filtered client-side before broadcast — server never sees them.
- Self-host: deploy `ogma-sync/`, update `OGMA_CONFIG.DEFAULT_SYNC_HOST` in `core/config.js`.
- See `ogma-sync/README.md` for full self-hosting guide.

---

## CDN dependencies

| Library | Version | SRI |
|---------|---------|-----|
| React | 18.2.0 | `sha384-tMH8h3BGESGckSAVGZ82T9n90ztNXxvdwvdM6UoR56cYcf+0iGXBliJ29D+wZ/x8` |
| ReactDOM | 18.2.0 | `sha384-bm7MnzvK++ykSwVJ2tynSE5TRdN+xL418osEVF2DE/L/gfWHj91J2Sphe582B1Bh` |
| Dexie | 4.0.10 | `sha384-3VWLzUTczDc/wazaoH+b5qG4iME0duPONRO281rRiaFkfpV/b3w5uxrvod7rCHcW` |

See `docs/sri-update.md` for how to update hashes when bumping versions.

---

## Stack context for AI sessions

- **No JSX, no transpilation.** All React is `React.createElement` aliased as `h()`.
- **No ES modules.** All files use global script tags in declared load order. `const`/`let` are used in some UI files (see code-quality.md var/const split) but there are no `import`/`export` statements anywhere.
- **No npm at runtime.** `package.json` exists for dev tools (ESLint) only.
- **Globals matter.** `CAMPAIGNS`, `GENERATORS`, `DB`, `LS`, `h`, `useState` etc. are globals — not imports.
- **Test harness is Node + `eval()`.** `qa_named.js` and `engine.test.js` run in Node using `eval()` to load files. Top-level `eval()` in Node leaks into scope; `'use strict'` blocks this — never add it to test files.
- **Emoji in Python writes must be unicode escapes.** `'\uD83C\uDFB2'` not `'🎲'`.
- **Code quality standards:** `docs/code-quality.md` — naming, file size, var/const split, comment standards, h() indentation.
- **ESLint config:** `eslint.config.cjs` — run `npm run lint` to check var/const split and no-redeclare of ui-primitives globals.

---

## Campaign world voices

Each world has a distinct register. Content must sound native — not interchangeable.

| World | ID | Voice in one line |
|-------|----|--------------------|
| The Long After | `thelongafter` | Elegiac, mythic. Things have names from before the collapse. The nostalgia is the danger. |
| Neon Abyss | `cyberpunk` | Transhumanist anxiety. The chrome is a leash. Precision over action-movie energy. |
| Shattered Kingdoms | `fantasy` | Wound-lore. Magic is scar tissue. Everything has a cost that compounds. |
| Void Runners | `space` | Blue-collar solidarity. The ship payment is always due. Competence, not heroism. |
| The Gaslight Chronicles | `victorian` | The Enlightenment was a mistake. Horror in the implication, not the reveal. |
| The Long Road | `postapoc` | Lyrical, not grimdark. The question is what you build. Loss as texture. |
| Dust and Iron | `western` | Frontier justice. The land doesn't care. Violence has weight and aftermath. |
| dVenti Realm | `dVentiRealm` | Post-collapse political thriller. Bureaucracy as obstruction, loyalty as currency. |

> For deep content work load `docs/claude/WORLD-VOICES.md` alongside this file.


---

## Further reference

| What | Where |
|------|-------|
| Open backlog + owner tasks | `ROADMAP.md` |
| Engineering conventions + accessibility rules | `docs/claude/CONVENTIONS.md` |
| Campaign voices + world tone notes | `docs/claude/WORLD-VOICES.md` |
| Data schema reference | `docs/data-schema.md` |
| Code quality standards | `docs/code-quality.md` — naming, file size, var/const split, h() indent, globals |
| Content authoring guide | `docs/content-authoring.md` |
| Architecture deep-dive | `ARCHITECTURE.md` |
| Full ADRs | `docs/decisions/` |
