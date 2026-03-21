# Ogma — Vision, Strategy, and Objectives

> **Version:** 5.0 — Sprint 17 shipped, 2026.03.130
> **Tagline:** Learn · Prep · Run · Export
> **Mission:** Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.

---

## The three pillars

Everything Ogma does falls into one of three pillars. A new user moves through them left to right; a veteran can enter at any point.

```
+---------------+    +---------------+    +---------------+    +---------------+
|   1. LEARN    | -> |   2. PREP     | -> |   3. RUN      | -> |  4. EXPORT    |
|               |    |               |    |               |    |               |
| Understand    |    | Build your    |    | Session board | Take it to    |
| Fate and Ogma |    | session       |    | lane board    |    | any table     |
+---------------+    +---------------+    +---------------+    +---------------+
```

**Ogma preps and runs sessions. Fari handles multi-player sync.**

---

## Architecture decision: HTTPS-first (v91)

**file:// support dropped.** Ogma now requires HTTPS (or localhost) for first load. After first load, the service worker provides full offline capability.

**What this unlocks:**
- **ES Modules** — import/export, component files, dynamic imports
- **SPA routing** — one index.html, History API, unified navigation shell
- **Code splitting** — landing page loads ~50KB, generator engine loads on demand
- **CDN libraries** — React, Dexie.js via import maps, service worker caches
- **Modern JS** — const/let, arrow functions, destructuring, template literals
- **Web Workers** — background generation for batch operations
- **Clean URLs** — shareable links, GitHub Pages deployment

**What we keep:**
- **Offline after first load** — service worker caches everything
- **No backend** — all generation runs client-side
- **No cloud sync** — IDB for persistence, JSON files for sharing
- **No user accounts** — zero data collection

**What we lose:**
- Opening index.html from a USB drive without a server
- Convention GM on a shared computer with no prior visit and no wifi

**Deployment:** GitHub Pages (primary), zip download (fallback for local npx serve).

---

## Locked decisions

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Pillar priority | **Learn > Prep > Export** | Learn has lowest cost + highest new-user impact. |
| 2 | Play surface | **Not Ogma's job** | Fari for digital play. Print/PDF for physical tables. |
| 3 | Session Zero | **Exportable JSON at end.** | Keeps Session Zero focused on the guided narrative. |
| 4 | Storage | **IDB + JSON file export/import.** No cloud. | Offline-first after first load. JSON is the share mechanism. |
| 5 | Export primary | **Fari App .fari.json v4** | Spec-compliant as of v86. |
| 6 | Architecture | **HTTPS-first, ES Modules, SPA** | file:// dropped in v91. Unlocks modern web architecture. |
| 7 | Deployment | **GitHub Pages** | Free, automatic SSL, global CDN. Zip remains as fallback. |

---

## Pillar 1 — LEARN (shipped + enhanced, v76–v98)

**Goal:** A person who has never played Fate can understand the system and the tool well enough to sit at a table.

**Shipped:** Help levels (4 tiers), "How to use this" expandable, learn-fate.html (7 interactive steps), how-to-use-ogma.html, 16 beginner blocks, D&D transition guide, Quick Find bar (`/` key).

**Sprint 4 enhancements shipped (v97-v98):**
- 4dF dice roller at every decision point in all 7 learn-fate steps
- Side-by-side comparison grids (invoke, attack/defence, stunt active/inactive)
- NPC demo (Cassidy "Threadbare" Voss) in step 6 — annotated stunt design
- Progress sidebar: IntersectionObserver, green dot on completed steps, localStorage
- 6 depth callouts: aspect bidirectionality, tie = success at cost (SRD cite), compel honesty, consequence recovery sequence (SRD cite), stunt format patterns (SRD cite), fail forward (SRD cite)

---

## Pillar 2 — PREP (shipped)

**Goal:** A GM can build everything they need, save it, and come back to it.

**Shipped:** 16 generators x 7 worlds, Saved Prep, Quick Prep Pack button, Session Zero wizard, per-card export, session JSON, Field Dossier cards.

---

## Pillar 3 — EXPORT (shipped)

**Goal:** Everything generated in Ogma can be taken to any table.

**Shipped:** Fari .fari.json v4, Markdown copy, print/PDF, shareable seed links, JSON session files, batch Fari export.

---

## Architecture

| Constraint | Status |
|------------|--------|
| HTTPS required for first load | New in v91 |
| ES Modules | Partial — 4 split UI files use const/let/arrows. var→JSON modules (SPA-06) parked. |
| SPA routing (History API) | Shipped (SPA-03, v95) |
| React 18 | Current |
| No backend | Non-negotiable |
| IDB + JSON files | Current |
| No cloud sync | Current |
| No user accounts | Current |
| Service worker offline | Current |
| GitHub Pages deployment | Shipped (SPA-01, v94) — auto-deploy via GH Actions |

---

*This document is the product operating frame. The ROADMAP.md sprints reflect the current priorities.*
