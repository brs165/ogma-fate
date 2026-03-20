# Ogma — Idea Dump

> **What this file is:** A team scratchpad. Ideas land here when they've been discussed but aren't ready for the backlog — too early, too big, too speculative, or just not the right moment. Nothing here is abandoned; nothing here is committed.
>
> **⚠ Historical note (v85):** References to Projector, Player View, Table Mode, Roll20 export, and BroadcastChannel in this file are historical — those features were deleted in v2026.03.85. See CHANGELOG.md for rationale.
>
> **Rules:**
> - Add an idea with a date, a one-line summary, and enough context to reconstruct the thinking.
> - When something ships, remove it. When something is permanently killed, remove it and log the kill rationale in CHANGELOG.md.
> - Don't let this file become a second backlog. If something is genuinely ready to prioritise, move it to BACKLOG.md Tier 3 with a review date.
> - Ideas from team reviews, user conversations, or passing thoughts all belong here.

---

## Active ideas

---

### IA consolidation — fold learn.html + transition.html into wiki
**Added:** 2026.03.65 · **Shipped:** 2026.03.67

Current navigation has three help destinations: `learn.html` (Quick Start), `help/`
(comprehensive docs), and `campaigns/transition.html` (D&D guide). The topbar has
5 items with two using the 📖 icon pointing at different things. Users face a
wayfinding choice before they find the answer.

**Proposed changes (Option A — full consolidation):**
- `help/new-to-ogma.html` — persona-sorted entry: 4 audience buckets link to right wiki pages
- `help/dnd-transition.html` — transition.html content migrated here
- `learn.html` → redirect stub to help/new-to-ogma.html
- `campaigns/transition.html` → redirect stub to help/dnd-transition.html
- Topbar: 3 items (📖 Help, Session Zero, About)
- about.html: wiki card grid simplified, no more embedded section
- CampaignApp sidebar Navigate: Quick Start + D&D Guide links point to new wiki URLs

**Size:** S — one sprint. Content already exists; this is restructuring, not writing.
**Reviewed by:** IA + Content team session, 2026.03.65.

---


---

### Sprint Roadmap 2026 (committed 2026.03.59)
**Added:** 2026.03.59 · **Remove when:** each sprint ships

Six-sprint plan growing from current state toward Ogma as a live table surface.
Remove each sprint block as it completes; the remaining blocks are the live plan.

---

#### Sprint 1 — BL-06: Shareable Result Links
**Status:** Active — Tier 1  
**Size:** M  
**Depends on:** Nothing — BL-12 (gate) shipped 2026.03.41

Three sub-tasks:
1. Replace `Math.random()` in engine.js `pick()` with mulberry32 seeded PRNG.
   Seed is optional param to `generate(genId, t, partySize, opts, seed)`.
   Default path (no seed) is unchanged — `Math.random()` as today.
2. On campaign page load read `?seed=X&gen=Y` from URL. If both present,
   call `generate()` with that seed and display result immediately (skip empty state).
3. Add `🔗 Copy Link` to action bar secondary group (after 📺).
   On click: `history.replaceState` encodes `?seed=X&gen=Y`, clipboard copy, toast.

QA: NA-XX — same seed + gen → identical output (deterministic PRNG test).

**Value:** Every result becomes a permanent shareable asset. Co-GM prep, session
notes, Discord sharing. Unblocks VTT deep integration (R-21).

---

#### Sprint 2 — BL-44 + BL-41: "Place on table" + Projector Live Sync
**Status:** Tier 3 — do after Sprint 1  
**Size:** XS + M

BL-44 (XS — independent, ships first in the sprint):
- Rename 📺 tooltip: "Push to projector [V]" → "Place on table [V]"
- Persistent FP dot strip in projector footer. GM pool as glowing dots.
  `adjustPool` / `adjustPC` in ui.js push `{type:'fp', gm: N, party: N}`.
  Projector renders dot row; dots animate spent/earned.

BL-41 (M — the architecture):
- New `pushProjectorUpdate(genId, state)` helper in ui.js alongside `pushToProjector`.
  Sends `{type:'update', genId, state, campId, ts}` via same BroadcastChannel/LS path.
- Projector `handleMessage` gains `update` branch — patches existing DOM, no full re-render.
- Wire 3 generators:
  - Countdown: `markBox(i)` → pushProjectorUpdate({filled: newFilled})
    Projector: .proj-track-box.filled class added to boxes, .proj-triggered shake at zero
  - Contest: setScoreA/B → pushProjectorUpdate({scoreA, scoreB})
    Projector: track halves fill with side colours, winner banner animates in
  - Scene: toggleKeep → pushProjectorUpdate({active_aspects: [...]})
    Projector: .proj-asp-row.active on kept aspects, border pulse + top-sort

New projector CSS: .proj-track-box.filled, .proj-asp-row.active, .proj-winner-banner,
.proj-fp-strip, .proj-fp-dot, .proj-fp-dot.spent, .proj-fp-dot.earned

**Value:** Projector becomes a live shared game surface. Countdown tension is visible
to all. Contest scores are public. FP economy is transparent (SRD recommendation).

---

#### Sprint 3 — BL-42 + BL-43: Scene Spotlight + NPC Stress / Taken Out
**Status:** Tier 3 — do after Sprint 2  
**Size:** S + S  
**Depends on:** BL-41 architecture

BL-42: SceneResult aspect spotlight
- When GM taps an aspect to mark it active in SceneResult, push {active_aspects:[...]}.
- Projector: active aspects highlighted with coloured border, animated to top of list.

BL-43: NPC stress + taken-out
- StressBoxes mark(i) fires pushProjectorUpdate({stress_physical:[...], stress_mental:[...]}).
- Projector: fills stress boxes live with CSS transitions.
- When all boxes filled: overlay TAKEN OUT state — NPC name large, crossed swords, defeat animation.

**Value:** Completes "GM's hand is the table's hand." The four most dramatic Fate moments
(clock hits zero, contest decided, villain taken out, scene aspect revealed) all happen
live on the projector.

---

#### Sprint 4 — 1-on-1 Refactor
**Status:** Scheduled after Sprint 3  
**Size:** M  
**Trigger:** By Sprint 3 end: CampaignApp >1400 lines, 3+ sprints since last refactor,
new components shipped (intro modal, projector live handlers, BL-06 action bar change).

Run the seven-role 1-on-1 refactor pass (see team-prompt.md Part 7 refactor trigger guidelines).
Expected: new dep array review (QA), projector FP dots a11y (A11y), dead CSS from
intro modal refactor (CSS), assertion count update for BL-41/42/43 states (QA).

**Value:** Code quality gate. Protects all shipped features from silent drift.

---

#### Sprint 5 — BL-36 Review: Adaptive Vibrancy
**Status:** Parking Lot — review 2026.08.15  
**Size:** S if approved, nothing if not

The mock was built 2026.03. Decision question: does ambient accent shift add tension
meaningfully or feel alarming during normal play? The projector now exists — the GM view
can shift without affecting the player-facing display, which strengthens the argument.
If approved: wire the mock. If rejected: close permanently.

---

#### Sprint 6 — 2026.09.01 Parking Lot Review
**Status:** Scheduled  
**Key decision:** BL-02 (Stunt Generator spec). If community signal is clear by Sep
(GMs asking for custom stunt building), promote to Tier 1 and do the spec work.
That unblocks BL-05 and BL-11 as fast follow-ons. If no signal, close permanently.

Other items reviewed: PL-01 (multi-GM), PL-02 (native app), PL-03 (build toolchain),
UX-18 (analytics).

---
---

### Stunt Generator trilogy (BL-02 → BL-05 → BL-11)
**Added:** pre-2026.03 · **Review:** 2026.09.01

Three dependent items: design the stunt data spec (BL-02), wire it as the 17th generator (BL-05), build a stunt builder wizard (BL-11). Each blocks the next.

**Why it's here:** Stunts are the most rules-complex generator we haven't built. The spec alone is a week of rules research — stunt types (bonus, permission, exception), refresh cost, invoke conditions, once-per-scene vs once-per-session. The existing stunt data in each campaign file is flat strings, not structured. BL-02 is the real work; BL-05 and BL-11 follow cheaply.

**Signal to watch:** If GMs start asking "I want to build custom stunts for my NPC" in the wild, that's the trigger. Until then it's a nice-to-have.

---

### Collaborative multi-GM mode (PL-01)
**Added:** pre-2026.03 · **Review:** 2026.09.01

Two GMs at different locations sharing a live session — one rolls, the other sees results in real-time. Requires either a server (WebSocket) or a CRDT (peer-to-peer). Both break the offline-first / no-server constraint.

**Why it's here:** The constraint is genuine, not a cop-out. Until there's a server or the project goes PWA-only with a backend, this can't ship. If PL-02 (native app) ever ships, this becomes a different conversation.

---

### Native app wrapper — Capacitor / Tauri (PL-02)
**Added:** pre-2026.03 · **Review:** 2026.09.01

Package Ogma as a desktop app (Tauri) or mobile app (Capacitor). Would remove the `file://` constraint entirely, unlock BroadcastChannel reliability, and enable proper filesystem access for the `.ogma` export.

**Signal to watch:** PWA install rate. If users are installing it as a PWA at high rates, that validates the "native-like" demand. If nobody installs, native is theatre.

---

### Build toolchain migration — Vite + JSX + TypeScript (PL-03)
**Added:** pre-2026.03 · **Review:** 2026.09.01

Replace the current no-build-step architecture with a proper toolchain. Unlocks: JSX, TypeScript, tree-shaking, PERF-02 (terser) as a proper build step rather than a bolt-on.

**Why it's here:** Breaks `file://` compatibility. The constraint is the product's core identity. This only makes sense as a consequence of a PL-02 decision (native app) that makes `file://` irrelevant.

**Note:** PERF-02 (terser minify) is a lightweight version of this that doesn't require changing the architecture — just post-processing `core/ui.js`. It's already in BACKLOG.md Tier 2 and should ship separately.

---

### Client-side opt-in local analytics (UX-18)
**Added:** pre-2026.03 · **Review:** 2026.09.01

A privacy-respecting, local-only event log. Logs which generators are used, session length, and help level — stored in IndexedDB, never transmitted, opt-in only. Useful for prioritising generator improvements and content work.

**Why it's here:** No current capacity. Would also benefit from the stunt generator and other new generators being shipped first so there's more worth measuring.

---

### VTT deep integration — Foundry / Roll20 (R-21)
**Added:** pre-2026.03 · **Review:** Phase 3 (undefined date)

Deep plugin integration with Foundry VTT or Roll20 — drag results directly into a live VTT session. Not the same as the export formats (Fari JSON, Roll20 JSON) that already exist.

**Why it's here:** The current export workflow (copy JSON, import manually) is good enough for most GMs. True integration requires a plugin architecture in each VTT, which is a maintenance burden we don't own. BL-06 (shareable links) is the right stepping stone — if a shareable URL exists, a VTT plugin becomes much simpler.

**Dependency:** BL-06 first. Shareable links make VTT integration worthwhile.

---

### Adaptive vibrancy contrast engine (BL-36)
**Added:** 2026.03 · **Review:** 2026.08.15

The UI's accent colour shifts in real-time based on generator type and countdown fill — calm generators (Scene, NPC) barely move, urgent ones (Countdown, Consequence) drift toward red. An interactive mock was built and reviewed before parking.

**Why it's here:** The delight animations already cover the "moment of impact" use case. BL-36 is ambient mood, which has a risk of feeling alarming during normal use. Good idea, wrong moment.

**Mock:** Built 2026.03 as an interactive widget — shows all generator transitions and the full countdown pressure ramp. Worth revisiting — the mock does the heavy lifting of the design decision.

**Review gate:** After BL-40 (Projector Mode) ships. If the Projector view exists, ambient accent shift has a stronger case — the GM's view can shift without affecting what players see.

---

---

### Sprint Plan 2026.03 — Table Surface Roadmap
**Added:** 2026.03.59 · **Remove when:** All six sprints shipped

**Sprint 1 — BL-06: Shareable Result Links (M)**
Three sub-tasks: mulberry32 seeded PRNG in engine.js (seed param to generate(), Math.random()
default unchanged); URL param reader on page load (?seed=&gen= auto-generates on arrival);
🔗 Copy Link button in action bar. Value: every result becomes shareable; unlocks VTT path.
Status: Tier 1, unblocked.

**Sprint 2 — BL-44 + BL-41: Place on table + Projector Live Sync (XS+M)**
BL-44: rename 📺 tooltip to "Place on table [V]"; FP dot strip in projector footer.
BL-41: pushProjectorUpdate() helper; {type:'update'} message type; wire countdown markBox(),
contest setScoreA/B, scene togglePin(). Projector: .proj-track-box.filled, .active aspects,
FP dots. Value: projector becomes live table surface; changes product category.

**Sprint 3 — BL-42 + BL-43: Scene spotlight + NPC stress/taken-out (S+S)**
BL-42: scene aspect tap → projector highlight, animated in, fades on clear.
BL-43: NPC stress → projector boxes fill live; all-filled → TAKEN OUT overlay.
Value: four most dramatic Fate moments (clock hits zero, contest won, villain down,
hidden aspect revealed) all happen live on the projector.

**Sprint 4 — 1-on-1 Refactor (M)**
Full seven-role pass. Expected finds: new dep arrays from BL-41 hooks, projector FP
accessibility, dead CSS from intro modal, assertion updates. Gate: CampaignApp will have
crossed 1,400 lines by this point.

**Sprint 5 — BL-36 Review + ship (S) — Review date: 2026.08.15**
Interactive mock already built (2026.03). Decision gate: does ambient accent shift add
tension or feel alarming? Projector existence strengthens the case — GM view shifts
without affecting player-facing display.

**Sprint 6 — Parking Lot Review (2026.09.01)**
Formal keep/close: stunt trilogy (BL-02/05/11), native app (PL-02), analytics (UX-18),
collaborative multi-GM (PL-01), build toolchain (PL-03). Most important decision:
BL-02 stunt generator — promote if community signal is clear, close permanently if not.

---

---

## Graveyard — ideas permanently closed

> Ideas removed from the active list with a kill rationale. For historical context only.

### VTT: Ogma Kinetic Canvas — CLOSED 2026.03
**Kill rationale:** Discovery research (r/FATErpg, Roll20 forums, Fate SRD community) showed the Fate community is overwhelmingly online. Spatial canvas assumes a physical-table-with-second-screen user that is rare in the Fate community. Fate players explicitly avoid spatial grids — Roll20 Fate guides confirm "90% of the game on the landing page, zones sketched ad-hoc." The market pain point (shared visible aspects) is already solved by Fari and RPG Note Cards. Spatial metaphor also contradicts Fate's abstract zone model. The one valid use case extracted — push-to-display for shared results — became BL-40 Projector Mode, which shipped. No further action.

---

*Last updated: 2026.03.45 — initial creation. VTT PRD verdict, parking lot migration, BL-36 mock note.*
