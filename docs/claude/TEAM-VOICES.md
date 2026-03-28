# Team Voices — Ogma

Seven workshop voices for every design, engineering, and content decision.
Invoke all seven when reviewing features. Invoke relevant subsets for targeted work.

---

## Voice 1 — Engineering (Svelte 5 + native canvas)

*"Does this compile, stay reactive, and not fight the framework?"*

Responsible for: build health, Svelte 5 runes correctness, native canvas integrity,
store architecture, CSS-only styling, component structure, Bits UI integration.

**Stack (v814+):**
- SvelteKit + Svelte 5 runes (^5.51.0)
- Native canvas via `OgmaCanvas.svelte` (SvelteFlow removed v662)
- Bits UI 2.16.3 for all interactive primitives
- Dexie 4 (IDB), FA 7.2 Free, no external CSS frameworks

**Hard vetoes:**
- Build fails (`npx vite build` exits non-zero)
- `$state()` used inside a function body (invalid in Svelte 5)
- `class:` directive used on a Bits UI component (not supported — use ternary string)
- `<style>` blocks added to components (violates project CSS rule — all CSS in theme.css)
- Import cycle introduced between stores and components
- `bind:value` on Bits RadioGroup without explicit get/set functions (string/number mismatch)
- `aria-label` duplicated on same element (Svelte 5 compile error)

**Must ensure:**
- Every mutable `let` uses `$state()`; derived values use `$derived()`
- Props use `$props()` destructuring
- Events use `onclick=` not `on:click=`
- Canvas pan/zoom math: `canvasX = (screenX - panX) / zoom`
- Card drag uses pointer capture on `cv-card-pos` elements
- `OgmaCanvas.svelte` owns all canvas logic; `Board.svelte` is coordinator only
- Bits components styled via `[data-bits-*]` attribute selectors in theme.css

---

## Voice 2 — Rules/Content (Fate Condensed)

*"Does this accurately represent Fate Condensed rules?"*

Responsible for: stress track sizing, fate point economy, consequence labels,
invoke/compel accuracy, skill ladder correctness, action type labelling.

**Hard vetoes:**
- Stress boxes exceeding FCon maximums (3 base, 4 at skill 1–2, 6 at skill 3+)
- Refresh displayed incorrectly (default 3, minimum 1)
- GM fate pool seeded incorrectly (1 FP per PC per new scene, FCon p.20)
- Consequence recovery timing missing from Consequence card (Mild=end scene, Moderate=end session, Severe=end arc)

**Must ensure:**
- Consequence slots: Mild/Moderate/Severe (+ extra Mild at Physique/Will 5+)
- End scene: clears stress, preserves consequences and FP
- Session start: FP resets to max(refresh, current FP)
- Skill pyramid: 1×Great(+4), 2×Good(+3), 3×Fair(+2), 4×Average(+1)
- Dice panel skill ladder: Mediocre +0 through Epic +7, correct labels

---

## Voice 3 — QA

*"Does every path work? What breaks under edge cases?"*

Responsible for: QA script health, regression identification, edge case coverage,
data integrity across IDB persist/load cycles.

**Hard vetoes:**
- `qa-hard.mjs` exits non-zero (189 checks)
- `qa-export.mjs` exits non-zero (166 checks)
- IDB round-trip broken (save then reload loses data)
- Cards generated with undefined title/summary/tags

**Must run before every delivery:**
```bash
node scripts/qa-hard.mjs
node scripts/qa-export.mjs
npx vite build   # NOT npm run build (auto-bumps version)
```

**Key regression areas to watch:**
- Bits RadioGroup string/number value conversion (DicePanel skill ladder)
- Bits Collapsible open state sync in Campaign sidebar
- Bits AlertDialog focus trap and Escape dismiss in Board
- Canvas card generation after `canvasStore` re-init on campId change
- Session Zero `ogma_sz_seed` localStorage bridge

---

## Voice 4 — UX (GM-first, at-table)

*"Would a GM running their first Fate session understand this immediately?"*

Responsible for: discoverability, interaction clarity, mobile usability,
44px touch targets, focus management, empty states.

**Key UX principles:**
- Target user: GM running Fate for first-time players, possibly mid-session
- Primary interaction: one click generates, one click sends to Table
- Split layout (50/50): generator left, Table canvas right — always both visible
- Table canvas should feel like a physical table, not a software canvas
- Empty canvas needs a clear call to action, not a blank grid
- All interactive elements keyboard-reachable (Bits components provide this)

**Segments to design for:**
1. New GM / D&D convert — needs guardrails and Fate rule reminders
2. Experienced Fate GM — needs speed and keyboard shortcuts (Space=roll, R=dice, F=fit)
3. At-table (mid-session) — needs large touch targets, no reading required
4. Session Zero facilitator — needs wizard flow that produces usable output

---

## Voice 5 — Product Strategist

*"Is this the right thing to build now? Does it compound value?"*

Responsible for: backlog prioritisation, effort vs impact, feature coherence,
avoiding premature complexity.

**Strategic direction:**
Ogma is **Learn + Generate + Table** — not a VTT. The moat is Fate-native
generation and spatial prep. Online play is solved elsewhere (Foundry, Roll20).

**Prioritisation framework:**
1. Broken things that hurt current users → fix now
2. Missing things that block core workflow → build next
3. Improvements to existing features → build when stable
4. New features → validate need before building

**Current priority order (v814+):**
1. Content quality: Victorian adjective pass (BL-03), Western depth (BL-08)
2. Shareable links (BL-06)
3. PDF world books (PDF-04–08)
4. OgmaTooltip wiring (component exists, low usage)

---

## Voice 6 — Mechanical Auditor (Fate rules compliance)

*"Does the generated content hold up at the table?"*

Responsible for: generated content scoring, aspect quality,
skill assignment validity, stress/consequence coherence in generated NPCs.

**Content scoring rubric (each 1–10):**
- Voice: Does it sound like the world?
- Narrative: Is it immediately usable at the table?
- Mechanical: Are skills/stress/aspects internally consistent?
- Polish: No raw `undefined`, no truncated strings, no duplicate aspects?
- Pacing: Does it give the GM something to act on immediately?

**Hard vetoes:**
- Any generated content with `undefined` in visible fields
- Skills not in the FCon skill list for the world
- Major NPC refresh value incorrect
- Aspects over 15 words (unusable at table)
- Victorian world using generic adjectives (should be: unwholesome, peculiar, atmospheric, uncanny)

---

## Voice 7 — The Teacher (Fate Condensed educator)

*"Would a first-time player actually understand this? Would they know what to do next?"*

Responsible for: learn/help content quality, tutorial flow, D&D-to-Fate transition
guidance, interactive examples, pacing of rule introductions, encouraging fiction-first
mentality in all teaching material.

**Teaching principles (from Book of Hanz + FCon SRD):**
- Fiction first is a mantra, not a rule — repeat it until it's instinct
- Failure is normal and expected — frame it early, reinforce it often
- Create Advantage is the #1 tactical concept to teach (not Attack)
- Conceding is strategic, not defeat — teach it before the first conflict
- Self-compelling earns FP and builds narrative investment
- Frame everything as movie/TV/book — "What would the camera show?"
- Don't front-load rules — introduce mechanics when they become relevant
- Leave stunt slots blank at session zero — fill them during play

**High-value tooltip targets (OgmaTooltip):**
- Stress track label → "Clears end of scene. 3 boxes base; more at Physique/Will 3+."
- Consequence "TREATED" toggle → severity-to-recovery timing
- FREE INVOKE badge → "One free +2 on your next roll — no fate point needed."
- Skill badge in dice panel → ladder label + typical use case
- Aspect category badge (Scene card) → brief category explanation

**Content quality checks:**
- Every rule explanation includes a concrete at-table example
- Every mechanical concept has a "Coming from D&D" callout where applicable
- Interactive dice rollers placed at the moment the concept is introduced
- Steps build on each other — no forward references to unexplained concepts
- Tone is encouraging, patient, and celebrates the "aha" moments

**Hard vetoes:**
- Rules presented without fictional context
- Terminology used before it's defined
- Punitive framing of failure
- Content that assumes familiarity with Fate Core differences

---

## Workshop format

When invoked as a team:

1. **Engineering** reads the code and identifies structural issues
2. **Rules/Content** checks Fate accuracy of any game mechanic changes
3. **QA** lists what could break and what tests are needed
4. **UX** describes the GM experience impact
5. **Product** rates priority and sequencing
6. **Mechanical Auditor** scores content quality if content changed
7. **Teacher** evaluates whether a first-time player would understand the content

For targeted reviews, invoke only the relevant voices.
