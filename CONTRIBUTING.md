# Contributing to Ogma

> **Ogma — A Fate Condensed Generator Suite**  
> *Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.*

Thanks for your interest in contributing. This document covers everything you need to get oriented, make a change, and submit it confidently.

---

## Getting started locally

**No npm, no build step, no install required to run the app.**

```bash
git clone https://github.com/brs165/ogma-fate.git
cd ogma-fate
```

Then either:
- **Simplest:** Open `index.html` directly in Chrome or Firefox.
  Everything works except the service worker (which requires a server).
- **Recommended:** Run a local static server for full offline/SW support:
  ```bash
  npx serve .          # serves on http://localhost:3000
  # or:
  python3 -m http.server 8080
  ```

**That's it.** Edit a file, refresh the browser. No hot reload, no compilation.

### Dev tooling (optional — for linting only)

The app needs no Node tooling to run, but if you want ESLint and Prettier:
```bash
npm install          # installs devDependencies only
npm run lint         # ESLint across core/ and data/
npm run format:check # Prettier dry-run
npm run test         # QA assertions + smoke test
```

---


## Before you start

Read these two files first. They're short and they'll save you time:

- **`README.md`** — what Ogma is, all 16 generators, rules accuracy commitments
- **`LICENSING.md`** — CC BY 3.0 attribution requirements (required for all contributions)
- **`docs/code-quality.md`** — naming conventions, file size limits, the var/const split, h() indentation, comment standards

---

## What we need most

In priority order:

### 1. Rules accuracy reports
If a generator output violates Fate Condensed rules — wrong stress values, incorrect stunt format, missing consequence slots, use of "significant milestone" — open an issue immediately. Rules bugs have the highest priority of anything on the board.

Cite the **Fate Condensed SRD page number** in your report. The SRD is at [fate-srd.com](https://fate-srd.com/fate-condensed).

### 2. Content quality improvements
Table entries that are too generic, wrong for their world's voice, or violate the aspect quality bar (invokable AND compellable, 3–8 words for troubles). See the **Content quality bar** section below.

### 3. Bug reports
Anything that crashes, produces undefined output, or breaks a QA gate. Include the campaign and generator type.

### 4. Accessibility issues
WCAG 2.1 AA violations, keyboard navigation gaps, touch target failures (minimum 44px per HIG), missing ARIA labels. Screen reader issues especially welcome.

---

## Architecture constraints (non-negotiable)

These are not preferences — they're load-bearing walls. Any PR that violates them will be closed without merge:

| Constraint | Why |
|------------|-----|
| **No build step** | Must work as static files served from any static host (deployed at ogma.net via Cloudflare Pages) |
| **No TypeScript** | Same |
| **React 18 via CDN UMD only** | `React.createElement` aliased as `h`. No JSX, no import maps yet. |
| **`var`-only in `core/*.js`** | `ui-primitives.js`, `ui-modals.js`, `ui-landing.js` use `const`/`let`. All others `var` only. See `docs/code-quality.md`. |
| **No analytics** | Permanently closed. Not up for debate. |
| **No backend** | Offline after first HTTPS load. No cloud sync, no server. |

The `core/engine.js` file has zero DOM/React dependencies — keep it that way. It runs in Node for QA.

---

## Getting oriented

```
fate-suite-new/
├── data/
│   ├── shared.js          # GENERATORS, HELP_CONTENT, ALL_SKILLS — edit here for content
│   ├── universal.js       # Setting-agnostic tables (obstacles, countdowns, constraints)
│   ├── [campaign].js      # Campaign-specific tables (7 files)
│   └── campaigns-meta.js  # Campaign display metadata
├── core/
│   ├── engine.js          # All generator logic — zero DOM dependency
│   ├── ui.js              # CampaignApp + hooks: useChromeHooks, useGeneratorSession
│   ├── ui-board.js        # BoardApp + hooks: useBoardPlayState, useBoardSync
│   ├── ui-renderers.js    # 16 result renderers + renderCard() (v4 cv4Card system)
│   ├── ui-table.js        # PrepCanvas + Table canvas components
│   ├── db.js              # IndexedDB (Dexie 4) + localStorage wrapper
│   └── intro.js           # Campaign intro overlay engine
├── assets/css/theme.css   # Full design system — Liquid Glass, dark/light, campaign theming
├── help/                  # Help & Wiki — static HTML pages
├── campaigns/             # One HTML file per campaign world + guide pages
├── tests/qa_named.js    # Named assertion suite — run before every PR
└──                # Architecture, backlog, team process docs
```

**Script load order matters:** `shared.js` → `universal.js` → `[campaign].js` → `engine.js` → `db.js` → `ui.js` → `intro.js`. Never reorder.

---

## Making a change

### For content changes (table entries, dnd_notes, gm_tips)

1. Edit the appropriate file in `data/`
2. Run the smoke test (see QA section below)
3. Check your entries against the content quality bar (below)
4. Submit a PR with a description of what you changed and why

### For code changes (engine logic, UI components, CSS)

1. Edit in `core/` or `assets/css/`
2. Run the full QA battery (see QA section below)
3. Check paren balance on `core/ui.js` — a single mismatched paren silently breaks all React rendering
4. Submit a PR — describe what you changed, what it fixes or adds, and which QA gates you ran

### For help/documentation changes

1. Edit files in `help/`
2. Test in a browser — wiki pages use `_shared.css` and `wiki.css` loaded via `../assets/css/theme.css`
3. Submit a PR

---

## QA — run all three gates before submitting

**Gate 1 — Syntax check:**
```bash
node --check core/ui.js && node --check core/ui-board.js && node --check core/ui-table.js && \
node --check core/ui-renderers.js && node --check core/engine.js && \
node --check core/db.js && node --check core/intro.js
```

**Gate 2 — 128/128 smoke test** (16 generators × 8 worlds):
```bash
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128  errors:'+errs.length);"
```
Expected: `Smoke: 128/128  errors:0`

**Gate 3 — Named assertions:**
```bash
node tests/qa_named.js
```
Expected: all pass, zero failures.

**Gate 4 — Cross-system bleed check** (content changes only):
```bash
grep -rn "significant milestone\|Significant Milestone" data/ core/ help/ campaigns/
```
Expected: no results.

All four gates must pass before a PR is merge-ready.

---

## Content quality bar

Every table entry — aspects, troubles, NPCs, faction goals, scene aspects — must clear this bar:

**Aspects (3–8 words):**
- Must be **invokable**: there is a clear situation where spending a fate point for +2 makes narrative sense
- Must be **compellable**: there is a clear situation where a GM can offer a fate point for a complication
- If you can only argue one direction, the aspect needs a rewrite

**World voice:**  
Each campaign has a distinct register. Entries must feel native to *that* world — not interchangeable with another. Check `docs/claude/WORLD-VOICES.md` → Campaign Voice Reference.

| World | Register |
|-------|----------|
| The Long After | Elegiac, mythic — nostalgia is the danger |
| Neon Abyss | Transhumanist anxiety — the chrome is a leash |
| Shattered Kingdoms | Wound-lore — magic is scar tissue, everything costs |
| Void Runners | Blue-collar solidarity — the ship payment is always due |
| The Gaslight Chronicles | Horror in the implication, not the reveal |
| The Long Road | Lyrical, not grimdark — the question is what you build |
| Dust and Iron | Frontier justice — violence has weight and aftermath |

**Trouble entries (≤10 words):** Short, punchy, specific. "Owes a debt to the wrong people" is inconvenience. "The thing I buried is walking again" is dramatic tension.

**Stunts:** Must follow FCon format: `+2 to [Skill] when [specific condition]` OR a once-per-scene special effect. Never charge a fate point. (FCon SRD p.28–29)

---

## Rules accuracy — the short version

Ogma targets **Fate Condensed** (Evil Hat, 2020). Key rules this project has gotten wrong before and must not get wrong again:

- **Stress:** All boxes are 1-point. A character marks *multiple* boxes per hit. There are no "2-stress boxes" or "3-stress boxes". FCon SRD p.12.
- **Advancement:** FCon uses **"milestone"** (end of session) and **"breakthrough"** (end of story arc). The term **"significant milestone"** does not exist in Fate Condensed — it is a Fate Core/FAE term. Never use it.
- **Major NPC refresh:** `Math.max(1, 3 - Math.max(0, stunts.length - 3))`. Not hardcoded.
- **Stunt cost:** 3 stunts free. Each beyond 3 costs 1 Refresh. Minimum Refresh is 1. FCon SRD p.28.
- **Contest ties:** Generate a new situation aspect — not a "twist aspect" or neutral result. FCon SRD p.23.

When in doubt, cite the SRD page. The SRD is at [fate-srd.com/fate-condensed](https://fate-srd.com/fate-condensed).

---

## PR checklist

Before opening a pull request, confirm:

- [ ] All four QA gates pass
- [ ] Content entries clear the quality bar (invokable AND compellable, world-voice appropriate)
- [ ] No "significant milestone" anywhere in changed files
- [ ] No build step introduced
- [ ] No new external dependencies (beyond React 18 CDN and Dexie 4 CDN, already in place)
- [ ] `LICENSING.md` attribution not removed or altered
- [ ] PR description explains *what* changed and *why*

---

## Attribution

Ogma is built on the Fate SRD family, all released under CC BY 3.0. The required attribution blocks are in `LICENSING.md`. Any contribution that incorporates SRD text must preserve those attributions.

**Randy Oest** ([Amazing Rando Design](https://amazingrando.com)) maintains [fate-srd.com](https://fate-srd.com) — the canonical hosted SRD. Attribution required.

---

## Questions?

Open an issue. Tag it `question`. We read them.

The project backlog and architecture decisions are in `ROADMAP.md` and `ARCHITECTURE.md` — good reading before proposing large changes.
