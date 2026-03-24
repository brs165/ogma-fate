# Ogma — Project Memory (AI Session Handoff)

> Snapshot of architecture state for model-switching and session continuity.
> Keep in sync with ROADMAP.md and CHANGELOG.md.
> **Last updated:** v2026.03.387

---

## Active voices (workshop mode)

| Voice | When active | Owns |
|-------|-------------|------|
| **Engineering** | All sessions | Load order, encoding, syntax, no-build-step contract, `node --check` after every write |
| **Rules / Content** | All sessions | FCon SRD compliance, world voice consistency, flags Fate Core bleed |
| **QA** | All sessions | 242/242 · 59/59 · 89/89 · 128/128 gate, named assertions for every fixed bug |
| **UX** | UI / nav / discoverability work | Task completion, time-to-first-value, 44px touch targets, 375px parity, severity ratings |
| **Product Strategist** | Feature decisions, prioritisation | User segment × impact × effort; "if users can't find it, it doesn't exist" |
| **Mechanical Auditor** | World data / content work | Scores tables 1–10: Voice, Narrative Interconnectivity, Mechanical Integrity, Editorial Polish, Structural Pacing |

User segments: new GM · experienced player · D&D convert · complete beginner · solo prep GM · at-table group use.

See `docs/claude/BOOTSTRAP.md` → Active voices for full role descriptions.

---



Offline-first browser PWA for Fate Condensed GMs. 16 generators × 8 worlds. Source files are the deployed app — no build step required for development. Deployed at ogma.net (Cloudflare Pages). Repo: github.com/brs165/ogma-fate.

---

## Current state

| Item | Value |
|------|-------|
| Version | `2026.03.387` |
| Named QA | 242/242 |
| Unit tests | 59/59 |
| Export round-trip | 89/89 |
| Smoke | 128/128 (16 generators × 8 worlds) |
| Working dir | repo root |
| Deploy | Cloudflare Pages (push to main) |

---

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18.2.0 via CDN UMD — `React.createElement` aliased as `h()` |
| Storage | Dexie 4.0.10 (IndexedDB), `memStore` fallback |
| Offline | Service Worker, cache-first, all APP_SHELL assets |
| Multiplayer | `ogma-sync` Cloudflare Worker relay, PartySocket |
| Styling | Vanilla CSS — Field Dispatch design system |
| Fonts | Fraunces (display), Martian Mono (mono), system-ui (body) |
| Build | Optional: `scripts/build.js` (3-tier, see docs/BUILD.md) |
| No | JSX, transpilation, ES modules, npm at runtime |

---

## File map

| File | Purpose |
|------|---------|
| `core/engine.js` | All `generate*()` functions, PRNG, table ops. Pure JS. |
| `core/ui.js` | `CampaignApp` — main campaign page shell |
| `core/ui-renderers.js` | 16 result renderers + `cv4Card` (600×380, 5 categories, GM guidance back) |
| `core/ui-table.js` | `PrepCanvas` + all canvas card components |
| `core/ui-modals.js` | Modal, ExportModal, Settings, Vault, QuickFind, KBShortcuts |
| `core/ui-primitives.js` | `h` alias, FD card primitives, `ErrorBoundary`, `scoreAspect()` |
| `core/ui-landing.js` | Landing page components |
| `core/ui-board.js` | `BoardApp` — inline Prep/Play canvas |
| `core/db.js` | Dexie 4 IDB wrapper (second IIFE = `window.DB`) |
| `core/config.js` | `OGMA_CONFIG`: `REPO_BASE`, `DEFAULT_SYNC_HOST` |
| `core/intro.js` | Campaign intro animation (DOM, not React) |
| `data/shared.js` | `CAMPAIGNS={}`, `GENERATORS`, `ALL_SKILLS`, `HELP_CONTENT` |
| `data/universal.js` | Cross-world content merged at runtime |
| `data/[world].js` | 8 world data files |
| `sw.js` | Service worker — APP_SHELL cache-first |
| `scripts/build.js` | Optional 3-tier build pipeline (see docs/BUILD.md) |
| `scripts/bump-version.sh` | CalVer stamp — run before every zip/deploy |
| `tests/qa_named.js` | 198 named assertions |
| `tests/engine.test.js` | 59 unit tests |
| `tests/export-roundtrip.test.js` | 89 export/import round-trip assertions |
| `ROADMAP.md` | Source of truth for all open work |
| `CHANGELOG.md` | Full version history |
| `docs/BUILD.md` | Build pipeline guide |
| `docs/claude/BOOTSTRAP.md` | AI session startup checklist (read first) |
| `docs/claude/CONVENTIONS.md` | Accessibility + engineering rules |
| `docs/claude/WORLD-VOICES.md` | World tone notes for content work |

---

## Architecture decisions

| Decision | What |
|----------|------|
| No build step | Source files = deployed files. `build.js` is optional optimisation only. |
| React 18 via CDN UMD | `h` alias. No JSX. No transpilation. |
| Dexie 4 for IDB | Promise-based. Schema migrations via `version()`. |
| Offline-first SW | Cache-first. All assets in APP_SHELL. CDN scripts excluded from intercept. |
| `ErrorBoundary` | Sole permitted class component. Everything else is function components + hooks. |
| Board inline | `canvasView` state in `CampaignApp`. `board.html` is a JS redirect. `openCanvas()` sets `canvasView=true`. |
| Accordion nav | `sbAcc` state + `toggleAcc()`. Sections: Play → Binder → Generate → Settings. One open at a time. |
| ExportModal | Full modal (not dropdown). Card checklist, 8 formats, copy/download toggle, import footer. |

---

## Script load order (every campaign HTML)

```
[React CDN] → [ReactDOM CDN] → shared.js → universal.js → [world].js →
config.js → engine.js → [Dexie CDN] → db.js → ui-primitives.js → partysocket.js →
ui-renderers.js → ui-table.js → ui-modals.js → ui-landing.js → ui.js → intro.js
```

Board page: same to ui-primitives, then: ui-renderers → ui-table → ui-modals → ui.js → ui-board.js (no ui-landing, no intro).

---

## 8 worlds

| World | ID | Voice |
|-------|----|-------|
| The Long After | `thelongafter` | Elegiac, mythic. Nostalgia as danger. |
| Neon Abyss | `cyberpunk` | Transhumanist anxiety. Chrome as leash. |
| Shattered Kingdoms | `fantasy` | Wound-lore. Magic costs compound. |
| Void Runners | `space` | Blue-collar solidarity. Ship payment due. |
| The Gaslight Chronicles | `victorian` | Horror in implication, not reveal. |
| The Long Road | `postapoc` | Lyrical. Loss as texture. What you build. |
| Dust and Iron | `western` | Frontier justice. Violence has aftermath. |
| dVenti Realm | `dVentiRealm` | Political thriller. Bureaucracy as obstruction. |

---

## 16 generators

`npc_minor`, `npc_major`, `pc`, `scene`, `campaign`, `encounter`, `seed`, `compel`, `challenge`, `contest`, `consequence`, `faction`, `complication`, `backstory`, `obstacle`, `countdown`, `constraint`

(17 listed in GENERATORS including `constraint` — smoke tests 16 of the legacy set for backward compat.)

---

## Critical non-negotiables

- **Never redeclare** `h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment` — all `const` in `ui-primitives.js`.
- **Python writes** → `open(f, 'w', encoding='utf-8')`. Emoji in JS strings → unicode escapes.
- **`node --check <file> && echo OK`** after every write.
- **`_headers` not in APP_SHELL** — CF Pages consumes it server-side.
- **`partysocket.js` not replaceable with CDN** — no UMD build exists.
- **`var foo = props.foo`** not `var foo = foo` — self-referential destructuring returns `undefined`.
- **`printCards` in second IIFE** in `db.js` (`window.DB` block).
- **No `_redirects` file** — CF Pages Pretty URLs handles `.html` stripping.
- **`<base href="/">`** on all campaign HTML pages.

---

## Open work (owner-gated)

| ID | Title | Status |
|----|-------|--------|
| MP-07 | Two-tab multiplayer test | Needs owner testing |
| MP-13 | Two-device / two-network test | Needs owner testing |
| VIS-01 | Table visual redesign confirmation | Needs hard refresh + visual check |
| WS-11 | r/FATErpg launch post | Parked → 2026.06.22 |

---

## QA commands

```bash
# Syntax
node --check core/engine.js && node --check core/ui.js && node --check core/ui-table.js && node --check core/ui-board.js && node --check core/ui-renderers.js && node --check core/db.js

# Named (198)
node tests/qa_named.js

# Unit (59)
node tests/engine.test.js

# Export round-trip (89)
node tests/export-roundtrip.test.js

# Smoke (128)
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128 errors:'+errs.length);if(errs.length)process.exit(1);"

# Bump + zip
bash scripts/bump-version.sh
cd .. && zip -r ogma-$(date +%Y.%m).XXX.zip fate-suite-new/ -x "*/node_modules/*" -x "*/.git/*" -x "*/\.*" -x "*/dist/*"
```
