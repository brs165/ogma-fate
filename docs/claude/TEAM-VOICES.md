# Team Voices — Ogma

Seven workshop voices for every design, engineering, and content decision.
Invoke all seven when reviewing features. Invoke relevant subsets for targeted work.

---

## Voice 1 — Engineering (Svelte 5 + SvelteFlow)

*"Does this compile, stay reactive, and not fight the framework?"*

Responsible for: build health, runes correctness, SvelteFlow integration integrity,
store architecture, CSS-only styling, component structure.

**Hard vetoes:**
- Build fails
- `$state()` used inside a function body (invalid in Svelte 5)
- `flowNodes`/`flowEdges` changed from `$state([])` to `writable()` (crashes SvelteFlow 1.5.1 — "t is not iterable")
- Old event syntax `on:nodeclick` instead of callback `onnodeclick` (SvelteFlow 1.5.1 uses callback props)
- Card components given `left/top` style or `onmousedown` drag (fights SvelteFlow)
- `nodeTypes` defined inside a component or reactive block (causes infinite re-renders)
- `<style>` blocks added to components (violates CSS rule)
- Import cycle introduced between stores and components

**Must ensure:**
- Every mutable `let` uses `$state()`
- Props use `$props()` destructuring
- Events use `onclick=` not `on:click=`
- SvelteFlow nodes/edges are plain arrays with `bind:nodes={flowNodes}`
- Store subscriptions use `flowNodes = v` (reassignment), not `.set(v)`
- `useSvelteFlow()` called at component init level, not inside functions

---

## Voice 2 — Rules/Content (Fate Condensed)

*"Does this accurately represent Fate Condensed rules?"*

Responsible for: stress track sizing, fate point economy, consequence labels,
invoke/compel accuracy, skill ladder correctness, action type labelling.

**Hard vetoes:**
- Stress boxes exceeding FCon maximums (3 base, 4 at skill 1–2, 6 at skill 3+)
- Refresh displayed incorrectly (default 3, minimum 1)
- GM fate pool seeded incorrectly (1 FP per PC per new scene, FCon p.20)
- Contest framed as "race to 3" without noting ties count as success with style for winner

**Must ensure:**
- Consequence slots: Mild/Moderate/Severe (+ extra Mild at Physique/Will 5+)
- End scene: clears stress, preserves consequences and FP
- Session start: FP resets to max(refresh, current FP)
- Skill pyramid: 1×Great(+4), 2×Good(+3), 3×Fair(+2), 4×Average(+1)

---

## Voice 3 — QA

*"Does every path work? What breaks under edge cases?"*

Responsible for: QA script health, regression identification, edge case coverage,
data integrity across IDB persist/load cycles.

**Hard vetoes:**
- `qa-hard.mjs` exits non-zero
- `qa-export.mjs` exits non-zero
- IDB round-trip broken (save then reload loses data)
- Cards generated with undefined title/summary/tags

**Must run before every delivery:**
```bash
node scripts/qa-hard.mjs
node scripts/qa-export.mjs
npm run build
```

---

## Voice 4 — UX (GM-first, at-table)

*"Would a GM running their first Fate session understand this immediately?"*

Responsible for: discoverability, interaction clarity, mobile usability,
44px touch targets, focus management, empty states.

**Key UX principles:**
- Target user: GM running Fate for first-time players, possibly mid-session
- Primary interaction: one click generates, one click places on canvas
- Canvas should feel like a physical table, not a software canvas
- Play mode is time-pressured — every action needs to be 2 taps or fewer
- Empty canvas needs a clear call to action, not a blank void

**Segments to design for:**
1. New GM / D&D convert — needs guardrails and Fate rule reminders
2. Experienced Fate GM — needs speed and keyboard shortcuts
3. At-table (mid-session) — needs large touch targets, no reading required
4. Solo player — needs self-explanatory card content

---

## Voice 5 — Product Strategist

*"Is this the right thing to build now? Does it compound value?"*

Responsible for: backlog prioritisation, effort vs impact, feature coherence,
avoiding premature complexity.

**Prioritisation framework:**
1. Broken things that hurt current users → fix now
2. Missing things that block core workflow → build next
3. Improvements to existing features → build when stable
4. New features → validate need before building

**Current priority order:**
1. SF canvas correctness (cards appearing, positioning, drag)
2. Play mode completeness (stress, FP, round tracking working)
3. Session Zero → Prep Canvas flow
4. Content quality (aspect word counts, Victorian pass)
5. Bits UI adoption for accessibility
6. Advanced SF features (edge labels, snap, resize)

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
- Skills not in the FCon skill list (e.g. `Ride` for non-western worlds)
- Major NPC refresh value incorrect (fixed in v586 — verify stays correct after engine changes)
- Aspects over 15 words (unusable at table)

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

**Audience segments:**
1. New to TTRPGs entirely — needs the "what even is this?" scaffolding
2. D&D convert — needs the "unlearn these habits" guidance
3. Experienced Fate player learning Condensed — needs the deltas from Core
4. GM teaching Fate to their table — needs the "how to introduce" framework

**Content quality checks:**
- Every rule explanation includes a concrete at-table example
- Every mechanical concept has a "Coming from D&D" callout where applicable
- Interactive dice rollers placed at the moment the concept is introduced
- Steps build on each other — no forward references to unexplained concepts
- Tone is encouraging, patient, and celebrates the "aha" moments

**Hard vetoes:**
- Rules presented without fictional context ("roll 4dF and add your skill" without saying what the character is doing)
- Terminology used before it's defined (e.g. "invoke" before aspects are explained)
- Punitive framing of failure ("you fail the roll" instead of "the story takes an unexpected turn")
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
