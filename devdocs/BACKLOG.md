# Ogma — Backlog

> **Source of truth.** Update this file whenever items change.
> **Current version:** 2026.03.214 · QA: 103/103 named · 128/128 smoke
> **Last revised:** 2026.03.214 — Full backlog rot-out. All shipped items archived to CHANGELOG.md. Only open items remain.

---

## Sizing

| Label | Effort |
|-------|--------|
| XS | < 1 hour |
| S | 1–3 hours |
| M | half-day |
| L | full day+ |

---

## Engineering rules

| Rule | Why |
|------|-----|
| All Python `open()` writes must use `encoding='utf-8'` | Default codec silently zeros files on surrogate pairs |
| All emoji in JS strings written from Python must use unicode escapes (`'\\uD83C\\uDFB2'`) | Raw chars become surrogate pairs |
| Large block replacements → Node.js `fs.writeFileSync`, not Python replace | Node owns the encoding |
| After every write: `node --check <file> && echo OK` | Catches syntax before QA/zip |
| **Never replace `assets/js/partysocket.js` with a CDN tag** | partysocket ships ESM+CJS only — no UMD build exists on any CDN, ever |
| `_headers` must NOT be in SW APP_SHELL | CF Pages consumes it server-side, never serves it as a URL |
| CDN scripts must NOT be in SW CDN_SCRIPTS | SW intercept strips CORS headers; `if(isCDN) return` lets browser handle natively |
| `<base href="/">` required on all campaign HTML pages | CF Pages Pretty URLs strip `.html`; without base href, `../core/` resolves incorrectly |

---

## Active — needs owner verification

| ID | Title | Notes |
|----|-------|-------|
| **MP-07** | Two-tab multiplayer test | Host in tab 1, join in tab 2. Player should see GM canvas on connect. |
| **MP-13** | Two-device / two-network test | Real devices, different networks. Full session test: add cards, roll dice, stress. |
| **VIS-01** | Table visual redesign confirmation | v214 fixed duplicate CSS bug. Hard refresh required (Ctrl+Shift+R). Test: card hover glow, hero modal tap, gen callout, circular FP buttons, stress box ×. |

---

## Ready to build — Tier 1

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **JOIN-01** | "Join a Table" card on index.html | XS | Input + Join button → `campaigns/[world]?room=XXXX`. Explicitly parked; 30min when ready. |
| **PDF-04** | Shattered Kingdoms PDF book | M | Pattern: `devdocs/build_gaslight.py`. 6×9 digest, world palette, Evil Hat layout. `pip install reportlab --break-system-packages`. |
| **PDF-05** | Neon Abyss PDF book | M | Same pattern. |
| **PDF-06** | Void Runners PDF book | M | Same pattern. |
| **PDF-07** | dVenti Realm PDF book | M | Same pattern. |
| **PDF-08** | Dust and Iron PDF book | M | Same pattern. |

---

## Multiplayer Phase 4 — Stretch

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **MP-20** | Dice roll animation sync | M | Players see dice spin then result when GM rolls. |
| **MP-21** | Remote player dice rolling | S | Player rolls locally, broadcasts result as toast on all screens. |
| **MP-22** | Cursor/pointer presence | M | Live cursor dots per connected player on canvas. |
| **MP-23** | Session log / transcript | M | DO SQLite — all rolls, card adds, player actions. |

---

## Content

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WLD-02** | 9th world — Western genre expansion or new world | L | "Dust and Iron" is already Western. Candidate: Dieselpunk, Space Western, Horror. Owner decision needed. |

---

## Community / Non-code

| ID | Title | Notes |
|----|-------|-------|
| **WS-11** | r/FATErpg intro post + blog post | Draft in `gtm-launch-copy.md`. Blocked on repo going public. Owner decision. |
| **WS-08** | Recruit Fate GMs for observation sessions | Priya. Non-code. |
| **WS-14** | Dogfood: 3 GMs prep real sessions, record, debrief | Priya. Non-code. |

---

## Parking lot — formal review 2027.03.01

| ID | Title | Notes |
|----|-------|-------|
| **PERF-02** | Vite/terser minify | Revisit after SPA decision. |
| **SPA-06** | var→JSON modules | Requires `<script type="module">` everywhere. Blocked. |
| **UX-18** | Local analytics (North Star tracking) | Supports dogfood. Low priority. |
| **PL-01** | Multi-GM mode | Needs CRDT. Server exists now — revisit. |
| **PL-02** | Native app wrapper | After PWA demand confirmed. |
| **EXP-01** | Fari App / Foundry VTT export | Code preserved under `FARI_PARKED_START/END`. Revisit when VTT integration confirmed as user need. |
| **WS-11** | r/FATErpg post | Draft ready. Repo must be public. Owner decision on timing. |

---

## What shipped — summary (full detail in CHANGELOG.md)

> This replaces the 600-line historical archive that was in this file.
> All sprint details, TC items, MP phases, UX sprints are in CHANGELOG.md.

| Version range | What |
|---------------|------|
| v2026.03.183–214 | Table canvas (all 22 TC items), multiplayer (all MP Phase 1–3), help-language visual redesign, hero modal full-screen FlipCard, category dropdown gen bar, Cloudflare Worker deploy, navigation restructure, hosting help page, 103 QA assertions |
| v2026.03.149–183 | devdocs sync, bug fixes (major NPC refresh, contest tie), run.html canvas polish, two FCon rules violations fixed |
| v2026.03.132–149 | dVenti Realm (8th world), license/attribution overhaul, content quality sprints, PDF book builders (Long Road, Long After, Gaslight) |
| v2026.03.96–132 | SPA migration, ES modules split, unified nav, run.html session surface, card reveal model, MTG flip card renderer, stunt generator |
| v2026.03.73–96 | Ogma rebrand, CalVer, 7 worlds, Learn/Prep/Export pillars, Sprint 1–6 |

*Last updated: 2026.03.214*
