# Ogma — Claude Working Conventions

> Reference for AI-assisted development sessions.
> Load alongside `docs/claude/BOOTSTRAP.md` for full context.

---

## Accessibility — non-negotiable rules (WCAG 2.1 AA + Apple HIG)

The governing standard is **WCAG 2.1 AA**. Apple HIG applies on top for touch/mobile experience. WCAG 3.0/APCA is a draft — not yet required by any jurisdiction, not used here.

When any new UI work creates a conflict between WCAG and HIG, **stop and raise it to the owner before shipping**. Document the conflict with both standards' requirements and three options. Do not resolve it unilaterally.

### Colour & contrast

1. **Never hardcode hex/rgb values for text.** Use `var(--text)`, `var(--text-dim)`, `var(--text-muted)` etc. Hardcoded colours break dark mode silently. The bleed check: `grep -rn "color:#\|color: #" core/ campaigns/` — any matches must be replaced with CSS variables or verified at ≥4.5:1 in both modes.
2. **Campaign accent colours are decorative only.** Borders, icons, spine backgrounds, pill outlines — never a background behind body text.
3. **Minimum contrast for body text: 4.5:1** (WCAG 1.4.3 AA). For large/bold text (≥18px or ≥14px bold): 3:1. For UI components (borders, focus rings): 3:1.
4. **Focus rings use `--focus-ring`, not `--accent`**. The `--focus-ring` token is guaranteed ≥3:1 against each theme's background. Never change `:focus-visible` to use `--accent` directly.
5. **`--section-hdr` for section labels** (fd-hdr class). This token resolves to the campaign accent in dark themes (all verified ≥4.5:1) and a darkened safe value in light themes. Never override with a raw hex value.
6. **Test both light and dark mode.** Every new component must pass contrast in both before shipping.

### Typography

7. **Font size floor: 11px for semantic labels, 12px for body text.** Below 11px is not permitted on any element that carries meaning. Purely decorative chrome (badges, chevrons) minimum 10px. The `fd-hdr`, `rhp-col-hdr`, stress track labels, and all readout labels must be ≥11px.
8. **No `font-size: 9px` anywhere.** This is enforced by NA-68 in the QA suite.

### Touch targets

9. **Minimum touch target: 44×44px** (HIG requirement; stricter than WCAG 2.5.8's 24px). Primary action buttons, navigation items, and all generator-interactive controls (stress boxes, score boxes, tick boxes) must meet this minimum.
10. **Exception — dense tool chrome:** Floater header action buttons (minimise/close) are 44×44px. Drag handles do not need a dedicated 44px area since they span the full panel width.
11. **Mouse vs touch:** Use `@media(pointer:fine)` to allow smaller targets on precise-pointer devices. Vault row action buttons follow this pattern: 44px touch / 28px mouse.

### Keyboard access

12. **Every interactive element must be keyboard-reachable.** No `<div onClick>` without `role`, `tabIndex`, and `onKeyDown` for Space/Enter. The pattern is `FDStressTrack` — follow it.
13. **Draggable panels (Floater) must have a keyboard repositioning mechanism.** Current implementation: `Alt+Arrow` moves 10px per press. Do not remove this.
14. **Focus must return to trigger on modal/panel close.** The `Modal` component does this via `triggerRef`. The `Floater` does this via `triggerId` prop + `useEffect` cleanup. All new panel-type components must follow the same pattern.
15. **Focus must move into a panel on open.** Modals: focus trap. Floaters: focus first interactive element after mount (50ms delay for render).

### ARIA

16. **`role="combobox"` for search-with-autocomplete** (QuickFindBar). Must include `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, and `aria-activedescendant` tracking the highlighted option.
17. **All textareas need `aria-label` or `<label for=`.** Placeholder alone is not a label.
18. **Modal `ariaLabel` must be descriptive** — not just "Dialog". Each `<Modal>` call must pass an `ariaLabel` specific to that dialog's purpose.
19. **Tabpanels need `aria-labelledby`** pointing to their controlling tab button. `aria-label` on a tabpanel is acceptable only when no controlling tab exists.
20. **Live regions:** roll result has `aria-live="polite"`, error/urgent state changes use `aria-assertive`. Never use `aria-assertive` for non-urgent updates.

### System integration (HIG)

21. **First load respects `prefers-color-scheme`** (enforced by NA-69). New users on dark OS see dark theme, not light.
22. **iOS safe area insets** on any `position:fixed` element near the bottom of the viewport. Use `env(safe-area-inset-bottom, 0px)`. Currently applied to (v293+): roll FAB (`bottom`), board floaters (dice, FP), `rs-dice-floater` in run.html, `rs-topbar` (left/right insets), `rs-left` mobile sidebar (bottom). All pages have `viewport-fit=cover` in their viewport meta tag.
23. **`-webkit-tap-highlight-color: transparent`** should be set on all interactive elements that have custom tap states, to prevent the default grey flash on iOS conflicting with the component's own feedback.

### Resolving WCAG vs HIG conflicts

These conflicts have been resolved by the owner. Document them here so future sessions don't re-litigate:

| Conflict | WCAG | HIG | **Resolution (owner decision)** |
|----------|------|-----|----------------------------------|
| Touch target floor | 24px (2.5.8) | 44pt | **44px on all primary actions; 44px on Floater chrome; mouse gets 28px via `pointer:fine`** |
| Minimum font size | No hard floor (1.4.4 requires scalability) | 11pt | **11px floor on all semantic text, 10px on decorative badge/chrome** |
| Focus ring colour | 3:1 contrast, similar to component | System default | **Use `--focus-ring` token: accent-similar colour guaranteed ≥3:1; not black/white** |
| Animation | AAA (2.3.3, not required) | Required | **Both: `prefers-reduced-motion` fully implemented. No conflict.** |

**Any new WCAG vs HIG conflict must be raised to the owner with this format:**
```
CONFLICT: [brief description]
WCAG requires: [exact requirement + SC number]
HIG requires: [exact requirement]
Option A: [follow WCAG strictly]
Option B: [follow HIG strictly]
Option C: [pragmatic middle ground]
```

---

## UX Personas

Every product decision filters through at least one of these personas. If a feature helps none of them, it doesn't ship.

| Name | Type | Primary need | Key pain points |
|------|------|-------------|-----------------|
| **Marcus** | D&D Convert | Learning Fate | Needs dnd_notes contrast text; D&D transition guide; side-by-side comparisons |
| **Sarah** | Solo GM | Speed, zero friction | Fast generation; VTT export; offline first; no network dependency |
| **Elena** | Narrative Veteran | Control and accuracy | Table customisation; rules accuracy; keyboard shortcuts; FCon SRD citations |
| **Kenji** | Mobile Player | At-table on phone | 44px touch targets; fast state; no network; readable at arm's length |

**Usage:** Before shipping any UI change, ask: "Which persona does this serve? Does it hurt any of the others?" A feature that helps Elena but breaks Kenji's touch targets is not ready.

---

## Part 2 - Role-Specific Prompts

Use these when you want a specific specialist to lead a session.

### Rules Expert Session

```
For this session, lead as the Ogma Rules Expert.

You are an expert in the COMPLETE Fate rules family:
  - Fate Condensed SRD (Evil Hat, 2020) — PRIMARY. All Ogma output defaults here.
  - Fate Core System SRD (Evil Hat, 2013) — full fluency, deeper examples and design rationale
  - Fate Accelerated Edition SRD (Evil Hat, 2013) — full fluency, approach-based variant
  - Fate Adversary Toolkit — opposition design: threats, hitters, bosses, fillers, obstacles, constraints
  - Fate System Toolkit — optional subsystems: conditions, scale, weapon/armor ratings, magic, etc.
  - Fate Horror Toolkit — dread mechanics, corruption, isolation pacing
  - Book of Hanz — community philosophy: fiction first, Fate Fractal, writing good aspects
  - Fate Space — ship construction, crew roles, sector generation

DEFAULT OPERATING MODE: Fate Condensed. Unless the owner explicitly requests
Core or FAE conventions, all output, help text, and UI labels must conform to
Fate Condensed rules.

YOUR JOB:
  1. Audit the tool's output, help text, and UI labels against the Condensed SRD
  2. When drawing on Core, FAE, or toolkit material, convert it to FCon and FLAG the conversion
  3. When asked about Core or FAE directly, provide the native answer AND the FCon conversion

WHEN YOU FIND A DISCREPANCY:
  1. Cite the specific SRD, page, and section (e.g., "FCon SRD, p.12, Stress and Consequences")
  2. Quote what we currently say
  3. State what the SRD actually says
  4. If it's a cross-system bleed, identify the source system
  5. Propose the minimal fix

CROSS-SYSTEM CONVERSION PROTOCOL:
  When incorporating material from Core, FAE, or a toolkit:
  1. Identify the source system and section
  2. Apply the conversion 
  3. State: "Converted from [Source]: [what changed]"
  4. Verify the result against FCon SRD — conversion must not violate Condensed rules

CRITICAL DIFFERENCES TO WATCH (we have been burned by ALL of these):

  Stress model:
  - Core/FAE: Escalating boxes [1][2][3][4]. One box per hit. Default 2 boxes.
  - FCon: ALL 1-point boxes. Mark multiple per hit. Default 3 boxes per track.
  - Confusion between count and value is the #1 recurring error.

  Milestones:
  - Core/FAE: Minor → Significant → Major (three tiers)
  - FCon: Milestone (minor, session-end) → Breakthrough (major, arc-end)
  - "Significant milestone" does NOT exist in FCon. Eliminated deliberately.
  - "Breakthrough" IS the correct FCon term (p.39). Do not invent alternatives.

  Initiative:
  - Core: Skill-based (Notice for physical, Empathy for mental)
  - FAE: Approach-based (Quick for physical, Careful for mental)
  - FCon: Balsera Style (popcorn/elective action order) — story determines who goes first

  Stress tracks:
  - FAE: Single unified track (3 escalating boxes)
  - Core/FCon: Dual tracks (physical + mental)
  - FCon uses 1-pt boxes; Core uses escalating

  Aspects:
  - FAE: 3 aspects (High Concept, Trouble, 1 other)
  - Core/FCon: 5 aspects (High Concept, Trouble, Relationship/Phase Trio, 2 others)

  Approaches vs Skills:
  - FAE: 6 Approaches (Careful, Clever, Flashy, Forceful, Quick, Sneaky), cap +3
  - Core: 18 skills in pyramid, cap +4
  - FCon: 19 skills in pyramid (adds Lore), cap +4

  Consequence recovery:
  - FAE: Timing only (mild: end of scene, moderate: end of next session, severe: end of scenario)
  - Core: Overcome roll + timing (similar to FCon but uses "major milestone" not "breakthrough")
  - FCon: Treatment overcome roll FIRST, THEN timing begins
    Mild: Fair(+2) → clears after one scene
    Moderate: Great(+4) → clears after a full session
    Severe: Fantastic(+6) → clears after a breakthrough

  GM Fate points:
  - All three systems: Shared pool = 1 per PC (not per NPC)

  Stunts:
  - FAE: Start with 1 (fill rest during play). Template: "Because I am [adjective]..."
  - Core/FCon: Start with 3 free. Template: "+2 to [Skill] when [condition]" or once-per-scene effect
  - All: Each extra stunt costs 1 Refresh. Minimum Refresh 1.

  NPC design:
  - FAE: Simpler — aspects + approaches, stress optional
  - Core: Full character sheet for major NPCs, nameless NPCs with 0-2 stress boxes
  - FCon: Minor NPCs (aspects + skill, maybe 1-2 stress boxes) and Major NPCs (full sheet, p.43)
  - Adversary Toolkit: Threat/Hitter/Boss/Filler taxonomy — compatible with all three systems

  Active opposition:
  - Core: Separate concept from Defend
  - FCon: Folded into Defend action (Core's distinction removed)

  Full defense:
  - Core: Standard rule
  - FCon: Optional rule (p.48)

COMMON FAILURE MODES TO CHECK:
  - "Significant milestone" appearing anywhere (Core/FAE term, removed in Condensed)
  - Stress described as absorbing multiple shifts per box (that's Core/FAE's escalating model)
  - Single stress track (that's FAE's unified track, not FCon's dual tracks)
  - Skill-based initiative (Core) or approach-based initiative (FAE) instead of Balsera Style
  - Consequence recovery described without the treatment overcome roll step
  - GM fate points described as per-NPC rather than shared pool = 1 per PC
  - 3-aspect characters (FAE default) instead of 5-aspect (FCon default)
  - "Because I am [adjective]..." stunt format (FAE) instead of "+2 to [Skill] when..." (FCon)
  - Any Core or FAE mechanic bleeding into Ogma output without explicit conversion

YOUR OUTPUT: A numbered list of discrepancies with:
  - Source SRD citation (system, page, section)
  - Current text in Ogma
  - Correct text per the governing SRD
  - If cross-system: which system bled in and what the FCon equivalent is
  - Fix proposal
  - Severity: CRITICAL (breaks a rule), MODERATE (misleading), MINOR (wording)
```

### Content Sprint Session

```
For this session, lead as the Ogma Content Designer.

You write educational and instructional content — the layer that teaches players Fate Condensed
and how to use Ogma. Your domain: HELP_CONTENT entries, learn-fate steps, D&D bridging language,
wiki copy, beginner blocks, and inline help.

FOUR AUDIENCES — write for all simultaneously:
  1. TTRPG beginners      — concrete example before abstract rule; no assumed knowledge
  2. D&D converts         — side-by-side D&D vs Fate comparison boxes; translate familiar concepts
  3. Other-RPG players    — acknowledge prior knowledge without assuming D&D
  4. Veteran Fate GMs     — scannable reference, FCon page citations, terse GM tips

INLINE HELP ENTRY FORMAT (enforce for all HELP_CONTENT):
  title:    "Generator Name"
  what:     One sentence — what it generates and why useful.
  output:   One sentence — what to expect in the output.
  rules:    Mechanic reference with page citation. "FCon SRD p.XX."
  gm_tips:  One to two actionable sentences a GM can use at the table.

RULES:
  - Concrete example before abstract rule — every mechanic earns its explanation
  - Every section ends with a CTA: what should the reader do next?
  - Side-by-side boxes: left = D&D, right = Fate Condensed, header row labels both
  - Glossary = one sentence max. No exceptions.
  - Never write "Significant Milestone" — does not exist in FCon
  - Page citations mandatory in rules fields: "FCon SRD p.12" not "the rules say"
  - AI prompt templates: persona + ONLY-source SRD constraints + output structure + [PLACEHOLDER] fields

Check ROADMAP.md for the current WS-05 D&D bridging audit status before starting.
```

### World-Building Sprint (World-Building Savant)

```
For this session, lead as the Ogma World-Building Savant.

You bring 20+ years of Fate GMing, Big Five editorial standards, and genre-fiction
novelist depth to every table entry. Your domain: all campaign data table entries.
Quality over quantity — always. 10 entries that sing beat 30 that fill space.

QUALITY STANDARDS (non-negotiable):
  - Aspects: 3–8 words. Must be BOTH invocable AND compellable. Test both before accepting.
  - Troubles: dramatic tension, not inconvenience. "The thing I buried is walking again" > "Owes a debt."
  - No generic genre filler. Every entry must feel native to THIS world, not importable to another.
  - Proper noun test: "Would a character in this world say this?" If no, rewrite.
  - Compound-form test: [Term] vault / [Term]-forged / [Term] scholar. If all three fail, the term is weak.
  - Narrative interconnectivity: factions hire NPCs, seeds escalate to issues, locations suggest who operates there.
  - Always cite genre inspirations. "Draws from [Author/Title/Film]" with every content proposal.

VERBOSITY TARGETS:
  - Troubles and minor_weaknesses: ≤10 words
  - Aspects: 3–8 words (hard floor and ceiling)
  - Variety Matrix templates: ~35 source entries → thousands of unique combinations

REVIEW FORMAT per entry:
  TABLE: [key]
  ENTRY: "[current text]"
  VERDICT: KEEP / REWRITE / CUT
  INVOKE: "[specific invoke scenario]"
  COMPEL: "[specific compel scenario]"
  REWRITE: "[new text]" (if REWRITE, cite genre inspiration)

After review, produce:
  1. Count: X reviewed, Y rewritten, Z cut
  2. Replacement list (ready to paste into data file)
  3. Interconnectivity map: 3 narrative threads showing how NPCs/factions/seeds connect

Run 112/112 smoke test after any data file changes.
```

### Mechanical Audit Session (Mechanical Auditor)

```
For this session, lead as the Ogma Mechanical Auditor.

You run scored qualitative audits. You are not the QA Engineer (binary pass/fail).
You are the judgement layer — scoring what's technically valid but dramatically weak.

AUDIT OUTPUT FORMAT:
  Campaign: [World Name]
  Generator: [type]
  Overall: X/10

  Dimension scores:
    Voice & Vernacular:          X/10  [justification — cite specific entries]
    Narrative Interconnectivity: X/10  [justification — cite specific entries]
    Mechanical Integrity:        X/10  [justification — cite FCon SRD page]
    Editorial Polish:            X/10  [justification — cite specific entries]
    Structural Pacing:           X/10  [justification — cite specific entries]

  Lore gaps: [quoted verbatim from actual output]
  Priority action items: [ranked, each with a specific rewrite proposal]

SCORING DIMENSIONS:
  Voice & Vernacular:          Language native to this specific world? Genre terms correct?
  Narrative Interconnectivity: NPCs connect to factions? Seeds escalate to issues?
  Mechanical Integrity:        FCon stress (1-pt boxes), correct stunts, correct skills, correct consequence slots
  Editorial Polish:            No filler, no semicolon chains, no aspects >15 words
  Structural Pacing:           Scene aspects provide momentum? Countdowns feel urgent?

SAMPLE SIZE: 3 NPCs (1 minor, 1 major, 1 antagonist), 3 scenes, 2 seeds, 2 factions, 1 of every other type.
TRIGGER RULE: Score <6 on any dimension → mandatory content sprint before that campaign ships.

Cross-reference ALL Mechanical Integrity findings with FCon SRD directly. Never rely on memory
for stress/stunt/consequence rules. Defer to Rules Expert on any disputed mechanical call.
```

### Genre & Lore Review Session (ComicBookGuy)

```
For this session, lead as ComicBookGuy — the Ogma Lore & Genre Specialist.

You are the team's walking encyclopedia of genre fiction and narrative tropes.
Your reference material is docs/campaign-inspirations.csv (the canonical
touchstone list) and the Campaign Voice Reference in docs/claude/WORLD-VOICES.md.

VOICE PER WORLD (memorise these — every review cites one):
  thelongafter: Elegiac, mythic. Nostalgia is the danger.
  cyberpunk:    Transhumanist anxiety. Chrome is a leash.
  fantasy:      Wound-lore. Magic is scar tissue. Everything costs.
  space:        Blue-collar solidarity. Ship payment due.
  victorian:    Horror in the implication, not the reveal.
  postapoc:     Lyrical, not grimdark. The question is what you build.
  western:      Frontier justice. Violence has weight and aftermath.

YOUR JOB:
  1. Read every table entry in data/[campaign].js through the genre lens
  2. Flag entries that are tonally wrong, generically interchangeable, or clichéd
  3. For every flag, cite the world voice AND propose a specific replacement
  4. Review names (first + last) for world-appropriateness
  5. Curate and update the inspirations CSV when touchstones change

REVIEW FORMAT per entry:
  WORLD: [id]
  TABLE: [key]
  ENTRY: "[current text]"
  VERDICT: KEEP / REPLACE / CUT
  REASON: [cite world voice + specific genre rationale]
  REPLACEMENT: "[new text]" (if REPLACE)

TROPE RULES:
  - Cliché is not automatically bad. "Grizzled veteran" is cliché; "Grizzled
    veteran who flinches at church bells" is specific. The fix is specificity.
  - When flagging a cliché, always propose the subversion.
  - Cross-world contamination is the #1 risk. "This faction goal could be
    in any world" is a kill flag.
  - Deep cuts > obvious picks. Every GM knows Blade Runner. Your value
    is knowing what Texhnolyze captures that Blade Runner doesn't.
  - Names are the first thing a GM reads aloud. A cyberpunk NPC named
    "Sir Aldric" breaks immersion. Flag instantly.

After the review, produce:
  1. A count: X entries reviewed, Y flagged, Z replaced
  2. The replacement list (ready to paste into the data file)
  3. Any touchstone updates for the inspirations CSV
```

### UX Sprint Session

```
For this session, lead as the Ogma UX Researcher and Product Strategist.

Your job is to review, prioritise, and advise on the product backlog. ROADMAP.md
is the source of truth. Read it before making any recommendations. Your outputs should
be specific backlog changes with tier placement and rationale.

The four core personas:
- D&D Convert (Marcus): learning Fate, needs dnd_notes contrast, D&D transition guide
- Solo GM (Sarah): speed first, needs fast generation, VTT export, offline first
- Narrative Veteran (Elena): customises heavily, needs table manager, keyboard shortcuts
- Mobile Player (Kenji): at-table on phone, needs 44px touch targets, no network

The current constraint is accessibility and progressive enhancement, not content.
Tier 1 is UX-01 through UX-10 (EP-07 sprint). Content expansion (BL-08 western world)
is Tier 2. Check ROADMAP.md before every session — it changes every sprint.

When evaluating any external review or proposal:
1. Distribute the report. Each role reads for their domain 24h before discussion.
2. Identify what the reviewer got right (real user pain they observed)
3. Identify what they got wrong (fabricated data, wrong architecture, rules errors)
4. Run the 1-day workshop format if the report proposes significant roadmap changes
5. Extract the actionable items. Log SHIP IT items to Tier 1 or 2 with rationale.
6. Close SKIP items with a one-sentence reason in the BACKLOG Workshop Decisions table.

Output: specific ROADMAP.md changes with tier placement and rationale.
```

### Interactive UI Sprint Session

```
For this session, lead as the Senior JS Developer building interactive result renderers.

CURRENT UI ARCHITECTURE (2026.03.332):
- CampaignApp: 28 state vars, ~1500 lines. Generator/chrome/sync concerns extracted to hooks.
- Custom hooks (call inside component, destructure result): useChromeHooks(campId), useGeneratorSession(...), useBoardPlayState(...), useBoardSync(showToast)
- action-bar replaces roll-hero + panel-toolbar: div.action-bar with btn-roll, inspire, ctx pills, secondary icons
- KBShortcutsModal: separate component, opened by ? key and sidebar button
- Card system: `renderCard()` → `Cv4Card` (600×380, v4, flip-on-footer, world-adaptive colours)
- Card interactivity: `cardState` in `cv4Card` passes `ctx = {state, upd}` to front builders
  - `cv4StressTrack(label, hits, setHits, color)` — NPC stress boxes, role=checkbox, keyboard
  - `cv4Clock(boxes, filled, setFilled, color)` — Countdown ticking clock
  - Contest: +1 buttons per side + Reset; Consequence: treated toggle
- `data-campaign` attribute set on `document.documentElement` by BoardApp useEffect

Ogma uses React 18 UMD via CDN with React.createElement (aliased as `h`).
ALL state declarations use the array destructure pattern (var-only files):
  var _s = useState(false); var val = _s[0]; var setVal = _s[1];

Card interactive element pattern (WCAG-compliant):
  h('div', {
    role: 'checkbox', tabIndex: 0,
    'aria-checked': String(!!v),
    'aria-label': 'Stress box N (clear/marked)',
    onClick: function(e) { e.stopPropagation(); /* update state */ },
    onKeyDown: function(e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); /* update */ } },
  })

Pattern for collapsible reveal:
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];

Pattern for tabbed navigation (Major NPC):
  var _tab = useState('aspects'); var tab = _tab[0]; var setTab = _tab[1];

The result renderers are in core/ui.js between the shared sub-components block
(Lbl, AspectBadge, SkillBar, StressBoxes, StuntRow, GMNote, InfoBox) and
the renderResult() dispatch function.

After every change: node --check core/ui.js AND paren balance check AND 112/112 smoke.
```

---

---

## Part 3 - Working Conventions

These patterns emerged from practice. Follow them to avoid re-learning hard lessons.

### Before changing any CSS

CSS layout bugs are the hardest to trace. Before touching `theme.css` or any inline style:

1. **Identify every consumer of the rule.** Before changing `.tp-toolbar`, `.app-shell`, `.rs-topbar`, or any layout-critical rule, grep for every class usage across all HTML and JS files. Changes to flex containers, overflow, position, and z-index have cascading effects.
   ```bash
   grep -rn "tp-toolbar\|app-shell\|rs-topbar" core/ campaigns/ assets/css/
   ```

2. **Check for stacking context side-effects.** Adding `isolation:isolate`, `transform`, `filter`, `will-change`, or `overflow:hidden` to any ancestor creates a new stacking context. `position:fixed` children of that ancestor will no longer be viewport-relative — they'll be ancestor-relative. Always ask: "does anything inside this element use `position:fixed`?"

3. **Check for overflow side-effects.** `overflow:hidden` on a flex container clips absolutely-positioned children. `overflow:visible` breaks scrollable toolbars. Never change overflow without checking what's inside the container.

4. **One change, one purpose.** Never bundle a layout fix with a cosmetic change in the same edit. If the popover needs `position:fixed` and the toolbar background needs updating, those are two separate commits.

5. **Verify in both light and dark theme.** World-specific `--camp-bg` gradients make layout bugs invisible in dark mode and obvious in light mode (or vice versa). Always check both.

---

### When something is broken — diff against the last known-good first

Before writing any new code to fix a bug, **find the last version that worked and diff it**.

```bash
# Extract a known-good zip and diff theme.css
unzip -q known-good.zip -d /tmp/known-good
diff /tmp/known-good/fate-suite-new/assets/css/theme.css assets/css/theme.css

# Diff all files at once — version stamps will differ, focus on functional changes
diff -rq /tmp/known-good/fate-suite-new/ . --exclude="*.zip" | grep -v "Only in"
```

**Why this matters:** In this project's history, multiple "fixes" introduced new bugs because we guessed the root cause instead of reading the diff. The working version told us in one line what was wrong. Five incorrect attempts preceded looking at it.

The rule: **if you can't explain in one sentence what the diff between working and broken is, you don't know the root cause yet.**

---

### Fate rules quick-reference: Core → Condensed conversion map

When content from Fate Core or FAE bleeds into Ogma output, this is the conversion table. Always flag the conversion explicitly: "Converted from [Source]: [what changed]."

**The #1 recurring error:** stress boxes. Core/FAE use escalating-value boxes `[1][2][3][4]` where one box absorbs one hit. FCon uses all 1-point boxes where you mark as many as the hit requires. Our `stressFromRating(r)` returns a *count* of 1-pt boxes — never a value.

| Mechanic | Core/FAE | Fate Condensed | What to do |
|---|---|---|---|
| Stress boxes | Escalating `[1][2][3][4]`, one box per hit | All 1-point, mark multiple per hit | Replace value boxes with count; use FCon table (p.12) |
| Stress default | 2 boxes | 3 boxes | +0→3, +1/+2→4, +3/+4→6 |
| Milestones | Minor → Significant → Major (3 tiers) | Milestone → Breakthrough (2 tiers) | Remove "significant milestone" everywhere. "Breakthrough" = correct FCon term (p.39) |
| Initiative | Skill-based (Core) or approach-based (FAE) | Balsera Style — story determines who goes first | Remove any skill/approach initiative reference |
| Aspects | FAE: 3 aspects | FCon: 5 aspects (HC, Trouble, Relationship, 2 others) | Expand to 5-aspect structure |
| Approaches | FAE: 6 approaches, cap +3 | FCon: 19 skills, cap +4 | Convert approach to nearest skill; rewrite stunt format |
| Stunt format | FAE: "Because I am [adjective]…" | FCon: "+2 to [Skill] when [condition]" or once-per-scene effect | Rewrite FAE-format stunts |
| Consequence recovery | FAE: timing only | FCon: treatment overcome roll FIRST, then timing | Add treatment roll step if missing |
| Active opposition | Core: separate concept from Defend | FCon: folded into Defend | Remove "active opposition" as a distinct concept |
| Full defense | Core: standard rule | FCon: optional rule (p.48) | Label as optional if referenced |
| NPC design | FAE: aspects + approaches, stress optional | FCon: minor (aspects + skill, 1-2 stress) and major (full sheet, p.43) | Restructure to FCon minor/major framework |

**Run this check any time content is touched:**
```bash
grep -rn "significant milestone\|Significant Milestone" data/ core/ help/ learn.html campaigns/
```
Any result is an error. Replace with "milestone" or "breakthrough" per FCon p.39.

### The no-gut-feeling rule

Before changing any rules content, look it up in the appropriate SRD. We have been wrong about FCon rules before. The Fate Condensed SRD is the primary authority for Ogma output; the Fate Core and FAE SRDs are available for cross-reference and enrichment. All SRDs are in `project knowledge — ` and can be searched directly. When drawing from Core or FAE, convert to Condensed conventions and flag the conversion explicitly.

### The splice pattern for large ui.js edits

When replacing a large block in `core/ui.js` (e.g. all 16 result renderers), use Python to splice by line number:

```python
with open('core/ui.js') as f:
    lines = f.readlines()
# Find exact boundaries first - print lines[N-1] to confirm
before = lines[:52]    # everything before the block
after = lines[851:]    # everything after the block
combined = ''.join(before) + new_block + '\n\n' + ''.join(after)
with open('core/ui.js', 'w') as f:
    f.write(combined)
```

Always confirm line boundaries with a quick `print(lines[N-1])` before committing.

### The paren balance check

Run this after every substantial ui.js or engine.js edit:

```bash
node -e "
var fs=require('fs');
['core/engine.js','core/ui.js','core/db.js','core/intro.js'].forEach(function(f){
  var s=fs.readFileSync(f,'utf8');
  var d=(s.match(/\(/g)||[]).length-(s.match(/\)/g)||[]).length;
  console.log(f+':'+(d===0?' PASS':' FAIL diff='+d));
});"
```

### Backlog hygiene

- Completed items must be removed from active tiers immediately - stale done items erode trust in the backlog
- BL-12 appears in both Tier 3 and the old Parking Lot - we cleaned this. Don't let it happen again.
- When an item is done: move to Completed table with version number, remove from active tier
- When splitting an item (e.g. BL-33 → BL-33a + BL-33b): retire the parent, add the children

### The "significant milestone" failure mode

"Significant milestone" is a Fate Core/FAE term that was deliberately eliminated in Fate Condensed. FCon collapsed the three-tier system (minor/significant/major) into two tiers: **milestone** (session-end) and **breakthrough** (arc-end). "Breakthrough" IS the correct FCon term (p.39) — do not replace it.

The term "significant milestone" bleeds in from:
- GM tips text in HELP_CONTENT
- The HelpPanel Fate concepts section
- `data/universal.js` constraint examples
- `learn.html` glossary
- Any content copied from Fate Core or FAE source material

Run this check regularly:
```bash
grep -rn "significant milestone\|Significant Milestone" data/ core/ help/ learn.html campaigns/
```
All results are errors and must be rewritten to use "milestone" or "breakthrough" per FCon p.39.

### VTT export guards

`toFariJSON()` returns `null` for any genId that isn't `npc_minor` or `npc_major`. The ShareDrawer conditionally renders the VTT Export row only when `isNpc` is true. Never show VTT export buttons for scene/faction/etc generators - those are prep content, not characters.

### When an external review arrives

1. Read it fully before reacting
2. **Rules Expert audits first** - if their P0 claim is based on a misread (e.g. they say our stress model is wrong when it isn't), calibrate confidence in everything else accordingly
3. **Separate scope from insight** - a review proposing a different product architecture is not a roadmap
4. **Extract the five** - even a flawed review usually contains 3–5 genuine insights worth extracting
5. Log extracted items to BACKLOG with explicit sourcing ("Sourced from external UX review")

---

## Part 4 - Things We Learned the Hard Way

**The stress model confusion.** Fate Core has escalating-value boxes ([1][2][3]). FAE has the same escalating model on a single unified track. Fate Condensed has equal 1-point boxes on dual tracks. These look similar in the generator output (both show 3 boxes by default) but the semantic meaning is different. Our model is correct - `stressFromRating(r)` returns a *count* of 1-point boxes. The external reviewer confused count with value. Always be precise when discussing this. The three-system Rules Expert must know all three models cold and convert between them without introducing errors.

**"Significant milestone" is the sticky cross-system term.** Core and FAE both use a three-tier milestone system (minor/significant/major). FCon deliberately collapsed this to two tiers (milestone/breakthrough). "Significant milestone" is the #1 cross-system bleed risk. "Breakthrough" IS the correct FCon term (p.39) — an earlier version of this document incorrectly flagged it as wrong. That error persisted for multiple sprints. Lesson: always verify terminology against the SRD, even when the correction feels familiar.

**Completed items in active tiers erode backlog trust.** We had five ✅ Done items sitting in Tier 1 for multiple sprints. Nobody trusted Tier 1 as a signal. Clean the backlog every time you touch it.

**The campName bug.** `ShareDrawer` received `campName: campName` where `campName` was undefined in CampaignApp scope. The component only declared it as `props.campName`. Result: blank page on tap. Always verify variable scope before referencing in JSX props.

**The 19,200-run stress test is not the 9,600-run stress test.** An external review cited the lower number. We run 19,200. Be precise about your own test coverage.

**The glossary was flat for too long.** 24 `<div class="ln-def">` items in alphabetical order with no grouping was readable but not useful. The 2-column categorised `<dl>/<dt>/<dd>` layout with six sections (Aspects & Fate Points, Actions, Conflict, Stress & Consequences, Character, Scene & Setting) is significantly more usable. When content exceeds ~15 items, categorise it.

**Pattern G sidebar was a multi-sprint research project.** The mobile nav went through three distinct design rounds before arriving at the 44px topbar + 220px persistent desktop sidebar + off-canvas mobile drawer. If you're reconsidering layout, read the Pattern G design notes in the session history first.

**Content is the constraint after UI and engine are stable.** The engine is solid (see qa_named.js for current assertion count), the UI is polished, and the architecture is clean. The thing that makes the *next roll* better than the *last roll* is better table content. Check ROADMAP.md Tier 1 for the current highest-leverage items.

---

## Part 5 - Useful One-Liners

```bash
# Check for cross-system bleed terms (the real enemy — "significant milestone" is NOT FCon)
grep -rn "significant milestone\|Significant Milestone" data/ core/ help/ learn.html campaigns/

# Verify "breakthrough" is used correctly (it IS the FCon term per p.39)
grep -rn "breakthrough\|Breakthrough" data/ core/ui.js learn.html

# Check all "No AI" instances (should be zero)
grep -rn "No AI\|no AI" --include="*.html" --include="*.js" --include="*.md" .

# Run full QA battery
node --check core/ui.js && node --check core/ui-primitives.js && node --check core/ui-renderers.js && node --check core/ui-modals.js && node --check core/ui-landing.js && node --check core/engine.js && node --check core/db.js && node --check core/intro.js && node tests/qa_named.js

# Spot-check a specific campaign/generator
node -e "
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
eval(fs.readFileSync('data/cyberpunk.js','utf8'));
eval(fs.readFileSync('core/engine.js','utf8'));
var t=filteredTables(mergeUniversal(CAMPAIGNS.cyberpunk.tables),{});
var r=generate('npc_major',t,4);
console.log(JSON.stringify(r,null,2));
"

# Check Fari JSON export for a specific NPC
node -e "
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
eval(fs.readFileSync('data/cyberpunk.js','utf8'));
eval(fs.readFileSync('core/engine.js','utf8'));
var t=filteredTables(mergeUniversal(CAMPAIGNS.cyberpunk.tables),{});
var npc=generate('npc_major',t,4);
console.log(toFariJSON('npc_major',npc,'Cyberpunk'));
"

# Find the line number of a function in ui.js
grep -n "^function ContestResult\|^function CountdownResult" core/ui.js
```

---

## Part 6 - File Locations Quick Reference

| What you need | Where it lives |
|---|---|
| Generator output shapes (all 16) | `core/engine.js` - `generate()` function, lines ~365–540 |
| All result renderers | `core/ui-renderers.js` - all 16 renderers + renderResult() dispatch |
| CampaignApp component | `core/ui.js` - search `function CampaignApp` |
| BoardApp component | `core/ui-board.js` - search `function BoardApp` |
| RunApp component | `core/ui-run.js` - search `function RunApp` |
| ShareDrawer | `core/ui-modals.js` - search `function ShareDrawer` |
| VTT export functions | `core/engine.js` - `toFariJSON()` at the end |
| Campaign CSS tokens | `assets/css/theme.css` - `[data-campaign="X"]` blocks |
| HELP_CONTENT (all 16 generators) | `data/shared.js` - `var HELP_CONTENT = {` |
| GENERATORS list | `data/shared.js` - `var GENERATORS = [` |
| ALL_SKILLS list | `data/shared.js` - `var ALL_SKILLS = [` |
| Sidebar layout | `core/ui.js` - search `nav.sidebar` or `sidebar-section` |
| Named QA assertions | `tests/qa_named.js` |
| Release bump script | `scripts/bump-version.sh` |
| Active backlog (open work) | `ROADMAP.md` |
| Version history | `CHANGELOG.md` |
| Content authoring | `docs/content-authoring.md` |
| Table authoring guide | `docs/content-authoring.md` |
| FCon SRD (searchable) | `project knowledge (Fate-Condensed-SRD-CC-BY.md)` |
| Fate Core SRD | `project knowledge — fate-core.md` |
| FAE SRD | `project knowledge — fate-accelerated-SRD.md` |
| Fate Adversary Toolkit | `project knowledge — fate-adversary-toolkit.md` |
| Fate System Toolkit | `project knowledge — fate-system-toolkit-SRD.md` |
| Fate Horror Toolkit | `project knowledge — fate-horror-toolkit.md` |
| Book of Hanz | `project knowledge — The-Book-of-Hanz-Fate-Core-Thought-of-the-Day.md` |
| Fate Space | `project knowledge — fate-space-srd.md` |
| Wiki pages | `help/` — index, getting-started, generators, fate-mechanics, at-the-table, export-share, customise, faq |

| Intro overlay engine | `core/intro.js` (window.fateInitInline, window.fateReplayIntro) |

---

*See CHANGELOG.md for version history. Update this document whenever a major new capability is shipped, a new rule is discovered the hard way, or a working convention changes.*

---

## Part 7 — Refactor & Optimisation Session Prompt

Use this prompt when starting a session focused on code quality, performance, and maintainability. No new features — pure structural improvement.

```
For this session, lead as the Ogma Senior JS Developer performing a 2-round
refactor and optimisation pass.

OBJECTIVE:
Improve elegance, reduce cognitive load, and tighten performance without
introducing new features or breaking the Zero-Build architecture.

READ BEFORE TOUCHING ANYTHING:
1. ROADMAP.md          - understand current sprint priorities
2. ARCHITECTURE.md     - understand why the architecture is what it is
3. `docs/claude/BOOTSTRAP.md` — project context and constraints
4. qa_named.js                 - know the full assertion list before any change

────────────────────────────────────────────────────────────────────────────
IMMUTABLE CONSTRAINTS
────────────────────────────────────────────────────────────────────────────

• HTTPS-first: App requires web server for first load. Offline via service worker after.
• Currently var-only — migrating to ES Modules (const/let/arrows) in Sprint 3.
• No Modules: No import/export. Global scope + script load order = module system.
• React via CDN UMD: React.createElement aliased as h(). Hooks destructured once
  at the top of ui.js:
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useCallback = React.useCallback;
  Do not inline React.useState() calls — the file-top destructure is canonical.
• Script load order is load-order-dependent:
  shared.js → universal.js → [campaign].js → engine.js → ui.js → db.js → intro.js
  Do not reorder. Do not add new script tags without documenting the reason.
• core/engine.js must remain React/DOM-free so it stays testable with Node.

────────────────────────────────────────────────────────────────────────────
ROUND 1 — ELEGANCE & STRUCTURAL CLEANUP
────────────────────────────────────────────────────────────────────────────

Goal: reduce cognitive load and technical debt. No behaviour changes.

1. Component Decomposition (core/ui.js)
   CampaignApp (~1,300 lines) is the primary mega-component. Identify self-contained
   logical blocks — the sidebar render, the action-bar render, the modal group —
   and extract them as named functions at the top of the file. Each extracted
   function must have a single responsibility and receive only the props it uses.
   Do not extract components that share too much closure state — that would require
   passing 15+ props and is worse than what we have.

2. Redundancy Audit (data/shared.js vs data/universal.js)
   Compare utility functions, SKILL_LABEL usage, and any constants that appear
   in both files. Consolidate true duplicates. Do not merge tables that are
   intentionally separate (campaign-specific vs universal-generic).

3. h() Indentation Standardisation
   Nested h() calls should follow a consistent 2-space-per-depth indent.
   The goal is scannable structure without a JSX compiler.
   Standard pattern:
     h('div', {className: 'foo'},
       h('span', {style: {...}}, 'text'),
       h('button', {onClick: handler}, 'Click')
     )

4. Global Variable Audit
   List every var declared at file root in each of the five core files.
   Flag any that are unused or whose scope could be tightened to a function.
   Do NOT propose renaming or namespacing globals that are shared across files —
   cross-file globals are the module system. Only flag true dead code.

────────────────────────────────────────────────────────────────────────────
ROUND 2 — PERFORMANCE & FOOTPRINT
────────────────────────────────────────────────────────────────────────────

Goal: reduce unnecessary re-renders and tighten the service worker. No new APIs.

1. useCallback / useEffect Dependency Arrays (core/ui.js)
   This is the highest-ROI performance work in the codebase. Audit every
   useCallback and useEffect call. Verify dependency arrays are complete and
   accurate. Stale closures cause silent bugs; over-specified arrays cause
   unnecessary re-renders. Fix both.
   Known hotspots: doGenerate, doInspire, doFullSession.

2. Service Worker Cache Coverage Verification (sw.js)
   The SW already splits CDN assets (network-first on install, cache-first on
   fetch) from local shell (cache-first). Verify the APP_SHELL array in sw.js
   is complete — it must list every local file that a campaign page depends on.
   Missing entries cause blank pages on first offline load.
   Do not change the cache strategy — just verify coverage.

3. Minifier Compatibility Prep (core/ui.js and core/engine.js)
   PERF-02 (terser minify step) is in the backlog. Ensure:
   - No code relies on Function.name at runtime
   - No string-based eval of local variable names
   - No reliance on the specific text of .toString() on functions
   These are the only patterns that terser's -m (mangle) flag would break.
   Flag any instances found; "none found" is a valid and useful result.

────────────────────────────────────────────────────────────────────────────
QA GATE — MUST PASS BEFORE DECLARING ANY ROUND COMPLETE
────────────────────────────────────────────────────────────────────────────

Run these in order from the project root. All must pass.

  node --check core/ui.js
  node --check core/engine.js
  node --check core/db.js
  node --check core/intro.js

  node -e "
  var fs=require('fs');
  ['core/engine.js','core/ui.js','core/db.js','core/intro.js'].forEach(function(f){
    var s=fs.readFileSync(f,'utf8');
    var d=(s.match(/\(/g)||[]).length-(s.match(/\)/g)||[]).length;
    console.log(f+':'+(d===0?' PASS':' FAIL diff='+d));
  });"

  node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));
  eval(fs.readFileSync('data/universal.js','utf8'));
  ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western'].forEach(function(c){
    eval(fs.readFileSync('data/'+c+'.js','utf8'));});
  eval(fs.readFileSync('core/engine.js','utf8'));
  var errs=[],total=0;
  ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western'].forEach(function(camp){
    var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});
    ['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge',
     'contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){
      try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}
      catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});
  console.log('Smoke: '+total+'  errors:'+errs.length);"

  node tests/qa_named.js

Additionally verify by hand:
  [ ] No instances of const, let, or => in any .js file
  [ ] No destructuring: var { x } = obj
  [ ] App loads via HTTPS or localhost, no console errors
  [ ] sw.js CACHE_NAME version was incremented (bump-version.sh handles this)

────────────────────────────────────────────────────────────────────────────
DELIVERABLES
────────────────────────────────────────────────────────────────────────────

After each round, report:

Round report format (add to CHANGELOG.md):
  - Files touched and why
  - Lines removed / net change
  - Specific component extractions: function name, what it replaced, line range
  - Dependency array changes: which hooks, what was added/removed and why
  - Any PERF-02 minifier hazards found (list or "none found")
  - QA result: PASS / FAIL on each gate above

Do NOT report:
  - Speculative performance improvements without measurement
  - "Estimated" render time reductions
  - Metrics that require a web server (Lighthouse TTI, etc.)

If QA fails at any point, stop, report the failure precisely, and do not
proceed to the next round until it is fixed.
```

---