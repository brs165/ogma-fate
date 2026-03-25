# Ogma Workshop Voice System

> Six voices review every feature before it ships. Each voice has a distinct lens, veto criteria, and output format. No feature merges until all six voices sign off.
>
> This document consolidates the original 15-role team (React era) into 6 actionable voices for the SvelteKit project. The deep domain knowledge is preserved; the bureaucracy is not.

**Primary directive:** *Does this make a GM's session better, faster, or more Fate-literate?*

**Secondary objectives (priority order):**
1. Rules accuracy against the Fate Condensed SRD
2. Offline capability — works fully offline after first HTTPS load
3. Accessible, high-contrast, touch-friendly UI
4. Developer experience — testable, readable, maintainable Svelte components

---

## 1. Engineering

**Lens:** Technical correctness, build-chain integrity, and architecture rules.

**Checks:**
- Valid Svelte 5 runes / Svelte 4 `export let` syntax (per CLAUDE.md)
- ES module imports resolve — no circular deps, no bare specifiers
- Vite build passes (`npm run build` exits 0)
- Stores before components: `engine.js` and `db.js` import no Svelte
- Components import stores, never the reverse
- No runtime `document`/`window` access during SSR-compatible paths
- adapter-static constraints respected (no server endpoints)
- Drag system uses direct DOM during drag, single store update on drop
- Card flip uses CSS 3D transforms, `prefers-reduced-motion` fallback

**CSS rules (from Design Engineer domain):**
- All tokens live in `static/assets/css/theme.css` — don't duplicate into `<style>` blocks
- Campaign theming via `[data-campaign="X"]` selectors
- Dark mode is primary; light mode must be equally functional
- Glass tokens: `--glass-blur`, `--glass-bg`, `--glass-border`, `--glass-inset`, `--glass-shadow`
- NEVER hardcode hex/rgb for text — always CSS variables
- Campaign accent colours: decorative only (borders, icons), never text backgrounds
- Font minimums: 11px labels, 12px body text
- Print stylesheet must be maintained — GMs print at conventions

**Veto if:** Build fails, import cycle introduced, architecture rule from CLAUDE.md violated, or drag uses reactive state during movement.

**Output format:**
```
[Engineering] PASS | VETO
- Files touched: <list>
- Build: pass/fail
- Import graph: clean / cycle at <path>
- Notes: <detail>
```

---

## 2. Rules / Content

**Lens:** Fate Condensed SRD accuracy, cross-system conversion safety, campaign world voice, and content quality.

**Default operating mode: Fate Condensed.** All output, UI labels, GM tips, and generated content must conform to Fate Condensed rules unless the owner explicitly requests a different system's conventions.

### SRD Mastery

*Primary authority:*
- **Fate Condensed SRD** (Evil Hat, 2020) — the governing ruleset

*Full fluency (available for enrichment):*
- **Fate Core System SRD** (2013) — deeper examples, Phase Trio, extras, Long Game
- **Fate Accelerated Edition SRD** (2013) — approach-based variant, quick-start patterns

*Supplementary:*
- **Fate Adversary Toolkit** — threats, hitters, bosses, obstacles, constraints
- **Fate System Toolkit** — magic, gadgets, vehicles, conditions, weapon/armor, scale
- **Fate Horror Toolkit** — dread, corruption, isolation
- **Book of Hanz** — philosophy (fiction first, collaborative setting, the Fractal). Philosophy, not rules — never overrides the SRD on mechanical questions
- **Fate Space** — ship construction, crew roles, sector generation

### Critical Conversion Map — Fate Core → Condensed

| Mechanic | Core | Condensed | Action |
|---|---|---|---|
| Stress boxes | Escalating value [1][2][3][4] | All 1-point, mark multiple per hit | Replace value boxes with 1-pt count (FCon p.12) |
| Stress track default | 2 boxes | 3 boxes | Use FCon table: +0→3, +1/+2→4, +3/+4→6 |
| Milestones | Minor / Significant / Major | Milestone (session) / Breakthrough (arc) | **NEVER** use "significant milestone" — eliminated in Condensed |
| Initiative | Skill-based | Balsera Style (popcorn) | Replace skill-based initiative |
| Active opposition | Separate from Defend | Folded into Defend | Remove as distinct concept |
| Extreme consequences | Clears at "next major milestone" | Clears at "next breakthrough" | Use FCon terminology |
| Skill list | 18 skills | 19 skills (Lore included) | Verify against FCon p.7–9 |
| Full defense | Standard rule | Optional (FCon p.48) | Label as optional |

### Critical Conversion Map — FAE → Condensed

| Mechanic | FAE | Condensed | Action |
|---|---|---|---|
| Skills vs Approaches | 6 Approaches, cap +3 | 19 Skills in pyramid, cap +4 | Rewrite approach stunts to skill format |
| Stress | Single unified track, escalating [1][2][3] | Dual tracks, all 1-point | Split into two tracks |
| Aspects | 3 total | 5 total (HC, Trouble, Relationship, 2 others) | Expand to 5 |
| Stunts | Start with 1 | Start with 3 free slots | Adjust expectations |
| Consequence recovery | Timing only | Treatment overcome roll required FIRST, then timing | Add treatment step |

### Content Quality (World-Building Savant standards)

**Domain:** All `src/data/[campaign].js` table arrays and `src/data/universal.js`.

**Non-negotiable quality standards:**
- **Genre-specific vernacular** — no generic filler. Every entry feels native to its world
- **Proper noun test** — "Would a character in this world say this?"
- **Trouble quality bar** — dramatic tension, not mere inconvenience. "Owes a debt" = weak. "The thing I buried is walking again" = strong
- **Aspect word count** — 3–8 words, both invocable AND compellable
- **Narrative interconnectivity** — factions hire NPCs, seeds escalate to issues, locations suggest who operates there
- **10 entries that sing beat 30 that fill space**
- **Cross-world contamination check** — "Could this appear in a different campaign unchanged?" If yes, not specific enough

### Genre Enforcement (ComicBookGuy standards)

- Every content review cites the specific world voice and at least one genre touchstone
- When flagging a cliché, always propose the subversion
- Genre authenticity ≠ genre gatekeeping — a fantasy world can have guns if the fiction earns it
- Deep cuts > obvious picks. Every GM knows Blade Runner. Value is knowing Texhnolyze
- Name quality is non-negotiable. "Sir Aldric" in cyberpunk breaks immersion instantly

**Veto if:** SRD rule misrepresented, forbidden term used ("significant milestone"), generated content breaks campaign voice, or aspect fails the invoke+compel test.

**Output format:**
```
[Rules/Content] PASS | VETO
- SRD compliance: pass / violation at <location>
- World voice: consistent / drift in <file>
- Conversion safety: no cross-system bleed / bleed at <location>
- Terms audited: <list>
- Notes: <detail>
```

---

## 3. QA

**Lens:** Test gates, regression prevention, and verification rigor.

**Checks:**
- `npm run dev` starts with zero errors
- `npm run build` succeeds
- Component count: `find src -name "*.svelte" | wc -l` matches expected (currently 51)
- Store count: `ls src/lib/stores/*.js | wc -l` matches expected (currently 6)
- Engine exports verify: `node -e "import('./src/lib/engine.js').then(m => console.log(Object.keys(m)))"`
- No stubs: `grep -rn "TODO\|FIXME\|STUB" src/` returns zero hits
- Every fixed bug gets a **named assertion**

**Named assertion format:**
```
ASSERT [bug-slug]: <one-line description of what must remain true>
VERIFY: <exact command or manual step to confirm>
```

**Smoke test:** All 8 worlds × 16 generators = 128 combinations must produce valid output.

**Veto if:** Any gate fails, or a bug fix ships without a named assertion.

**Output format:**
```
[QA] PASS | VETO
- dev server: pass/fail
- build: pass/fail
- component count: <n>/51
- store count: <n>/6
- stubs found: <n>
- assertions added: <list>
- Notes: <detail>
```

---

## 4. UX

**Lens:** Touch usability, discoverability, accessibility, and user-segment fit.

### User Segments

| Segment | Persona | Primary need |
|---------|---------|-------------|
| D&D Convert | Marcus | Stress/HP translation, D&D contrast notes |
| Solo GM | Sarah | Speed, export, minimal friction, offline-first |
| Narrative Veteran | Elena | Table customisation, rules accuracy, keyboard shortcuts |
| Mobile Player | Kenji | At-table use, 44px touch targets, fast state, no network |
| New GM | — | First-time session runner, needs guidance at every step |

### Accessibility Checklist (WCAG 2.1 AA + Apple HIG)

**Contrast:**
- Body/label text ≥ 4.5:1 against background
- Large text (≥18px or ≥14px bold) ≥ 3:1
- UI component boundaries ≥ 3:1
- Glass interfaces need explicit contrast audit in both dark and light modes

**Touch targets:**
- All interactive elements ≥ **44×44px** (HIG)
- `@media(pointer:fine)` may reduce to 28px on compact controls
- Drag interactions must have non-drag alternatives

**Keyboard:**
- No `<div on:click>` without `role`, `tabindex`, `aria-*`, and `on:keydown` (Space + Enter)
- Escape dismisses all overlays
- Focus returns to trigger on panel close
- Focus moves into panel on open (first interactive element)

**ARIA:**
- Modal: descriptive `aria-label` (not generic "Dialog")
- Live regions: `aria-live="polite"` for results/state changes
- Icons in buttons: `aria-hidden="true"` on icon, name on button
- Checkboxes: follow StressRow pattern for interactive div checkboxes

**System:**
- `prefers-color-scheme` respected on first load
- `env(safe-area-inset-bottom)` on fixed bottom elements
- `prefers-reduced-motion` — animations replaced with instant transitions
- Colour alone never conveys meaning — pair with text, shape, or icon

**Veto if:** Touch target below 44px, discoverability < 50% with no mitigation, accessibility attribute removed, or contrast below 4.5:1 on text.

**Output format:**
```
[UX] PASS | VETO
- Touch targets: pass / violation at <component>
- Discoverability: <score>% for <segment>
- Segments impacted: <list>
- A11y: pass / regression at <location>
- Notes: <detail>
```

---

## 5. Product Strategist

**Lens:** Prioritisation through segment impact, effort, and strategic alignment.

### Scoring Framework: Segment × Impact × Effort

| Factor | Scale | Definition |
|--------|-------|------------|
| Segments reached | 1–5 | How many user segments benefit |
| Impact per segment | 1–5 | How much their experience improves |
| Effort | 1–5 | Implementation cost (1 = trivial, 5 = multi-week) |
| Priority score | calc | `(segments × impact) / effort` |

### Four Big Risks (every proposed feature)

| Risk | Question |
|------|----------|
| **Value** | Will GMs actually use this? |
| **Usability** | Can they figure it out without help? |
| **Feasibility** | Can we build it with current constraints? |
| **Viability** | Does it fit the project's scope and sustainability? |

**Checks:**
- Feature has a clear segment target — "everyone" is not a segment
- Priority score computed and compared to backlog
- Scope creep flagged
- Reversibility assessed

**Veto if:** Priority score below threshold with no strategic justification, or scope creep without acknowledgment.

**Output format:**
```
[Product Strategist] PASS | VETO
- Target segments: <list>
- Segments reached: <n>/5
- Impact: <n>/5
- Effort: <n>/5
- Priority score: <calculated>
- Scope: clean / creep at <description>
- Notes: <detail>
```

---

## 6. Mechanical Auditor

**Lens:** Scored qualitative audit of generated content across five dimensions.

### Scoring Dimensions (each 1–10)

| Dimension | What it measures |
|-----------|-----------------|
| **Voice & Vernacular** | Does the text feel native to this world? Genre terms correct? Would a character say these words? |
| **Narrative Interconnectivity** | Do NPCs connect to factions? Seeds escalate to issues? Locations suggest who operates there? |
| **Mechanical Integrity** | Correct FCon stress (1-pt boxes), stunt format (+2 when [condition] OR once-per-scene), skills from FCon list, consequence slots, opposition per Adversary Toolkit |
| **Editorial Polish** | No filler, no semicolon chains, no aspects over 15 words, no entries that work as descriptions but fail as aspects |
| **Structural Pacing** | Scene aspects provide momentum? Countdowns feel urgent? Complications escalate rather than pile up? |

**Composite score:** Average of all five. Minimum **6.0** to ship. Any single dimension below **5** is a blocker.

**Audit sample:** 3 NPCs (1 minor, 1 major, 1 antagonist), 3 scenes, 2 seeds, 2 factions, 1 of every other generator type.

**Veto if:** Composite below 6.0, or any dimension below 5.

**Output format:**
```
[Mechanical Auditor] PASS | VETO
- Samples reviewed: <n>
- Voice:      <score>/10  [justification]
- Narrative:  <score>/10  [justification]
- Mechanical: <score>/10  [justification]
- Polish:     <score>/10  [justification]
- Pacing:     <score>/10  [justification]
- Composite:  <score>/10
- Lore gaps: <specific examples>
- Priority rewrites: <ranked list>
```

---

## Campaign Voice Reference

| World | ID | Voice |
|---|---|---|
| The Long After | `thelongafter` | Elegiac, mythic, world-weary. Things have names from before the collapse. The nostalgia is the danger. |
| Neon Abyss | `cyberpunk` | Transhumanist anxiety. The chrome is a leash. Precision over action-movie energy. |
| Shattered Kingdoms | `fantasy` | Wound-lore fantasy. Magic is scar tissue. Everything has a cost that compounds. |
| Void Runners | `space` | Blue-collar solidarity. The ship payment is always due. Competence under pressure, not heroism. |
| The Gaslight Chronicles | `victorian` | The Enlightenment was a mistake. Cosmic horror with manners. The horror is in the implication. |
| The Long Road | `postapoc` | Lyrical, not grimdark. The question is what you build. Loss as texture, not wallpaper. |
| Dust and Iron | `western` | Frontier justice. The land doesn't care. Violence has weight and aftermath. Silence before speech. |
| dVenti Realm | `dVentiRealm` | Whimsical tabletop-in-a-tabletop. Self-aware, playful, fourth-wall-adjacent. |

---

## Review Protocol

1. Feature author presents the change with a one-line summary
2. All six voices review in parallel
3. Any single VETO blocks the merge
4. Vetoing voice states the specific fix required
5. After fixes, only the vetoing voice(s) re-review
6. When all six show PASS, the feature ships

### Commit Tag

```
feat: add complication generator
[workshop: 6/6 pass]
```

With caveats:
```
feat: add complication generator
[workshop: 6/6 pass, UX caveat: discoverability 55% for new-gm]
```

---

## What the Team Does Not Do

- Ship features without a user need
- Let the parking lot drift — items have review dates
- Accept fabricated usability data as evidence
- Confuse Fate Core and Fate Condensed rules
- Ship without passing QA
- Use "significant milestone" (eliminated in Fate Condensed)
- Chase vanity metrics over real user outcomes
