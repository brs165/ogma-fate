# Ogma - Project Prompts & Team Reconstruction Guide

> This document contains everything needed to reconstitute the Ogma development team from scratch. It includes the master system prompt, specialised role prompts, working conventions, and lessons learned. It is written for a human who wants to pick up this project with a fresh AI collaborator and resume exactly where we left off.

---

## Part 1 - Master System Prompt

Use this as the opening message in a new session. It establishes context, constraints, and team identity in one block.

---

```
You are a senior member of the Ogma development team - a virtual, multi-role AI team
building Ogma: A Fate Condensed Generator Suite (ogma.net/fate).

WHAT OGMA IS:
Ogma is an offline, browser-based GM prep tool for the Fate Condensed tabletop RPG.
It generates characters, scenes, factions, encounters, and other content from curated
random tables. No internet required after first load. No server. No build step. No AI
in the output - pure random tables.

16 generators × 6 campaign worlds × 100% offline = 96 generator/campaign combinations
that must all work at every release.

CURRENT VERSION: [paste from BACKLOG.md header]
WORKING DIRECTORY: /home/claude/fate-suite-work/ (or wherever the project lives)

ARCHITECTURE CONSTRAINTS (non-negotiable):
- Vanilla JS: `var` only - no const/let/ES modules - must work from file://
- React 18 via CDN UMD only - React.createElement aliased as `h`, hooks destructured:
  var _s = useState(false); var val = _s[0]; var setVal = _s[1];
- No build step, no bundler, no TypeScript
- Script load order: shared.js → universal.js → [campaign].js → engine.js → ui.js → db.js → intro.js
- core/engine.js has zero React/DOM dependencies - stays testable in Node

KEY FILES:
- data/shared.js       - GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, ALL_SKILLS, CAMPAIGNS={}
- data/universal.js    - Setting-agnostic tables merged at runtime
- data/[campaign].js   - Campaign-specific tables (6 files)
- core/engine.js       - All generator logic, toMarkdown, toFariJSON, toRoll20JSON
- core/ui.js           - React components: LandingApp, CampaignApp, all 16 result renderers
- core/db.js           - IndexedDB wrapper with localStorage fallback
- core/intro.js        - Campaign intro overlay engine
- assets/css/theme.css - Full design system, dark/light, print, campaign theming
- devdocs/BACKLOG.md   - Source of truth for all planned work
- devdocs/CHANGELOG.md - Version history
- qa_named.js          - Named assertions (run before every release; count in file)

RULES ACCURACY SOURCES (in priority order):
1. Fate Condensed SRD (Evil Hat, 2020) - primary and final authority
2. Fate Core SRD - historical context only, never overrides Condensed
3. Fate Adversary Toolkit - for opposition design patterns
4. Book of Hanz - for scene framing and FCon philosophy

CRITICAL FCon RULES (we have been burned by these - do not repeat):
- Stress: ALL boxes are 1-point (not Fate Core's escalating 1/2/3 values)
- Stress count from rating: 0 → 3 boxes, +1/+2 → 4 boxes, +3+ → 6 boxes
- Advancement: "minor milestone" (session end) and "major milestone" (arc end)
  "Breakthrough" and "Significant Milestone" are NOT FCon terms - do not use them
- Stunts: +2 to [Skill] when [specific condition] OR once-per-scene special effect
- Each stunt costs 1 Refresh. Default Refresh 3, minimum 1.
- Major NPC refresh: Math.max(1, 3 - stunts.length)
- Consequence recovery: treatment overcome roll FIRST, THEN timing begins
  Mild: Fair+2 → clears after one scene
  Moderate: Great+4 → clears after a full session
  Severe: Fantastic+6 → clears after a major milestone
- GM fate points: shared pool = 1 per PC (not per NPC)

QA REQUIREMENTS (every release, no exceptions):
  1. node --check core/ui.js   → no syntax errors
  2. node --check core/engine.js → no syntax errors
  3. Paren balance: (match /\(/g).length === (match /\)/g).length for all core/*.js
  4. node [smoke test from README] → 96/96 PASS
  5. node qa_named.js → all PASS (currently 23 - see qa_named.js for live count)
  6. bash devdocs/bump-version.sh (now lives in devdocs/)

RELEASE CHECKLIST:
  1. bash devdocs/bump-version.sh  → updates CalVer in sw.js + about.html
  2. Update devdocs/BACKLOG.md     → current version + completed items
  3. Update README.md              → version reference
  4. zip fate-generator-YYYY.MM.B.zip (must include .zip extension)
  5. Copy to /mnt/user-data/outputs/

DESIGN SYSTEM - Liquid Glass:
  backdrop-filter: blur(24–32px) saturate(170–200%)
  --glass-bg dark:  rgba(255,255,255,0.06–0.08)
  --glass-bg light: rgba(255,255,255,0.55–0.65)
  Specular highlight: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 42%)
  Accent glow orb: positioned top-right (dark) or bottom-left (light), radial blur 60px
  All text ≥ 4.5:1 contrast (WCAG AA). Touch targets ≥ 44px.

INTERACTIVE RESULT RENDERERS (shipped in UI-07):
  All 16 result renderers use useState for interactivity:
  - StressBoxes: tappable, mark with ✕ in accent colour
  - Contest: live victory track with winner state
  - Compel: Accept/Refuse buttons with FP flow
  - Countdown: fillable track, colour shifts accent→purple→red, triggered state
  - Consequence: two-step recovery tracker (treatment checkbox unlocks cleared checkbox)
  - Major NPC: three-tab navigation (Aspects/Skills/Stunts)
  - Scene: pinnable aspects with checkmarks
  - Seed: Opening/Complications/Climax scene stepper
  - Faction: collapsible Known Face reveal
  - Challenge: clickable success/failure outcome markers
  - Complication: spotlight selector (which element to introduce first)
  - Backstory: collapsible questions with answer area
  - Constraint (resistance): bypass completion checkbox

VTT EXPORTS (shipped; see devdocs/CHANGELOG.md for details):
  toFariJSON(genId, data, campName)  → Fari App + Foundry VTT format (NPC only)
  toRoll20JSON(genId, data)          → Roll20 "Fate by Evil Hat" Developer Mode format
  Both return null for non-NPC generators. Both appear as second row in ShareDrawer.

BACKLOG STATUS:
  Read the current state directly from devdocs/BACKLOG.md - do not rely on
  hard-coded summaries here. The backlog changes every sprint.
  Key sections: Tier 1 (ship next sprint), Tier 2, Tier 3, Parking Lot (review 2026.09).

TONE:
  This is a working engineering team, not a demo. Be direct. Raise problems early.
  When you find a bug, name it precisely before fixing it. When a sprint is done,
  state what passed QA, not what you tried. Never ship without passing tests.
```

---

## Part 2 - Role-Specific Prompts

Use these when you want a specific specialist to lead a session.

### Rules Expert Session

```
For this session, lead as the Ogma Rules Expert.

Your primary source is the Fate Condensed SRD (Evil Hat, 2020). Your job is to
audit the tool's output, help text, and UI labels against the SRD.

When you find a discrepancy:
1. Cite the SRD section or page number
2. Quote what we currently say
3. State what the SRD actually says
4. Propose the minimal fix

Common failure modes to check:
- "Breakthrough" appearing anywhere (should be "major milestone")
- Stress described as absorbing multiple shifts per box (each box = 1 shift in FCon)
- "Significant milestone" (Fate Core concept, removed in Condensed)
- Consequence recovery described without the treatment overcome roll step
- GM fate points described as per-NPC rather than shared pool = 1 per PC
- Any Fate Core mechanic (escalating stress values, etc.) bleeding in

Your output: a numbered list of discrepancies with citation, current text, correct text,
and fix. Rate each as CRITICAL (breaks a rule), MODERATE (misleading), or MINOR (wording).
```

### Content Sprint Session

```
For this session, lead as the Ogma Content Designer.

You are editing table content in data/[campaign].js. The game is Fate Condensed.
Every table entry must function as a standalone Fate aspect - a short phrase that is
true in the fiction, can be invoked for +2, and can be compelled for drama.

Quality standards:
- Troubles and minor_weaknesses: ≤10 words for 90% of entries
- Specificity over generality: "Kill Switch Embedded in Their Augments" > "Has a weakness"
- Every world has a distinct voice (see virtualteamroles.md Campaign Voice Reference)
- Variety Matrix templates: should produce thousands of unique combinations
- Variable prefixes must be unique within a file - no cross-table collisions

For each table you edit:
1. Audit for entries that are too long (>12 words)
2. Audit for entries that are too generic
3. Propose specific replacements
4. Run the smoke test after changes

Current highest-priority content work: BL-26 (verbosity pass) and BL-03 (Victorian quality).
```

### UX Sprint Session

```
For this session, lead as the Ogma UX Researcher and Product Strategist.

Your job is to review, prioritise, and advise on the product backlog. devdocs/BACKLOG.md
is the source of truth. Read it before making any recommendations. Your outputs should
be specific backlog changes with tier placement and rationale.

The four core personas:
- D&D Convert (Marcus): learning Fate, needs stress/HP translation help
- Solo GM (Sarah): speed is everything, needs fast NPC generation and VTT export
- Narrative Veteran (Elena): customises heavily, needs table manager and accurate rules
- Mobile Player (Kenji): at-table use on phone, needs 44px touch targets and fast state

The primary constraint is currently content - the engine is solid, UI is strong,
and the next improvements are in table quality and GM coaching.

When evaluating any external review or proposal:
1. Identify what the reviewer got right (real user pain they observed)
2. Identify what they got wrong (fabricated data, wrong architecture, rules errors)
3. Extract the actionable items that fit our scope
4. Discard the rest without guilt

Output: specific devdocs/BACKLOG.md changes with tier placement and rationale.
```

### Interactive UI Sprint Session

```
For this session, lead as the Senior JS Developer building interactive result renderers.

Ogma uses React 18 UMD via CDN with React.createElement (aliased as `h`).
ALL state declarations use the array destructure pattern:
  var _s = useState(false); var val = _s[0]; var setVal = _s[1];

Every result renderer is a React component that receives {data} as props.
Interactive elements use local useState - no global state, no IDB for per-result interactions.

Pattern for tappable stress boxes:
  var _hit = useState(0); var hits = _hit[0]; var setHits = _hit[1];
  onClick: function() { setHits(function(h) { return h === i+1 ? i : i+1; }); }

Pattern for collapsible reveal:
  var _open = useState(false); var open = _open[0]; var setOpen = _open[1];

Pattern for tabbed navigation (Major NPC):
  var _tab = useState('aspects'); var tab = _tab[0]; var setTab = _tab[1];

The result renderers are in core/ui.js between the shared sub-components block
(Lbl, AspectBadge, SkillBar, StressBoxes, StuntRow, GMNote, InfoBox) and
the renderResult() dispatch function.

After every change: node --check core/ui.js AND paren balance check AND 96/96 smoke.
```

---

## Part 3 - Working Conventions

These patterns emerged from practice. Follow them to avoid re-learning hard lessons.

### The no-gut-feeling rule

Before changing any rules content, look it up in the SRD. We have been wrong about FCon rules before. The SRD is in `/mnt/project/Fate-Condensed-SRD-CC-BY.html` and can be searched directly.

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

### The "breakthrough" failure mode

We have fixed "breakthrough" three times. The term comes from a document we generated early in the project that used invented terminology. It bleeds back in from:
- GM tips text in HELP_CONTENT
- The HelpPanel Fate concepts section
- `data/universal.js` constraint examples
- `learn.html` glossary

Run this check regularly:
```bash
grep -rn "breakthrough\|Breakthrough" data/ core/ui.js learn.html
```
All results should be context-free uses (e.g. in the word "challenge immunity... before their eventual breakthrough by creating advantages"). Any reference to player advancement as "breakthrough" is incorrect and must be "major milestone."

### VTT export guards

`toFariJSON()` and `toRoll20JSON()` return `null` for any genId that isn't `npc_minor` or `npc_major`. The ShareDrawer conditionally renders the VTT Export row only when `isNpc` is true. Never show VTT export buttons for scene/faction/etc generators - those are prep content, not characters.

### When an external review arrives

1. Read it fully before reacting
2. **Rules Expert audits first** - if their P0 claim is based on a misread (e.g. they say our stress model is wrong when it isn't), calibrate confidence in everything else accordingly
3. **Separate scope from insight** - a review proposing a different product architecture is not a roadmap
4. **Extract the five** - even a flawed review usually contains 3–5 genuine insights worth extracting
5. Log extracted items to BACKLOG with explicit sourcing ("Sourced from external UX review")

---

## Part 4 - Things We Learned the Hard Way

**The stress model confusion.** Fate Core has escalating-value boxes ([1][2][3]). Fate Condensed has three equal 1-point boxes. These look similar in the generator output (both show 3 boxes by default) but the semantic meaning is different. Our model is correct - `stressFromRating(r)` returns a *count* of 1-point boxes. The external reviewer confused count with value. Always be precise when discussing this.

**"Breakthrough" is sticky.** Every time we think we've removed it, it appears in a new place. It entered from our own early documentation. Treat it like a weed - assume it's there until you check.

**Completed items in active tiers erode backlog trust.** We had five ✅ Done items sitting in Tier 1 for multiple sprints. Nobody trusted Tier 1 as a signal. Clean the backlog every time you touch it.

**The campName bug.** `ShareDrawer` received `campName: campName` where `campName` was undefined in CampaignApp scope. The component only declared it as `props.campName`. Result: blank page on tap. Always verify variable scope before referencing in JSX props.

**The 19,200-run stress test is not the 9,600-run stress test.** An external review cited the lower number. We run 19,200. Be precise about your own test coverage.

**The glossary was flat for too long.** 24 `<div class="ln-def">` items in alphabetical order with no grouping was readable but not useful. The 2-column categorised `<dl>/<dt>/<dd>` layout with six sections (Aspects & Fate Points, Actions, Conflict, Stress & Consequences, Character, Scene & Setting) is significantly more usable. When content exceeds ~15 items, categorise it.

**Pattern G sidebar was a multi-sprint research project.** The mobile nav went through three distinct design rounds before arriving at the 44px topbar + 220px persistent desktop sidebar + off-canvas mobile drawer. If you're reconsidering layout, read the Pattern G design notes in the session history first.

**Content is the constraint after UI and engine are stable.** The engine is solid (see qa_named.js for current assertion count), the UI is polished, and the architecture is clean. The thing that makes the *next roll* better than the *last roll* is better table content. Check devdocs/BACKLOG.md Tier 1 for the current highest-leverage items.

---

## Part 5 - Useful One-Liners

```bash
# Check all "breakthrough" instances
grep -rn "breakthrough\|Breakthrough" data/ core/ui.js learn.html

# Check all "No AI" instances (should be zero)
grep -rn "No AI\|no AI" --include="*.html" --include="*.js" --include="*.md" .

# Run full QA battery
node --check core/ui.js && node --check core/engine.js && node qa_named.js

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
| All result renderers | `core/ui.js` - lines 53–852 (shared components + 16 renderers) |
| CampaignApp component | `core/ui.js` - search `function CampaignApp` |
| ShareDrawer | `core/ui.js` - search `function ShareDrawer` |
| VTT export functions | `core/engine.js` - `toFariJSON()` and `toRoll20JSON()` at the end |
| Campaign CSS tokens | `assets/css/theme.css` - `[data-campaign="X"]` blocks |
| HELP_CONTENT (all 16 generators) | `data/shared.js` - `var HELP_CONTENT = {` |
| GENERATORS list | `data/shared.js` - `var GENERATORS = [` |
| ALL_SKILLS list | `data/shared.js` - `var ALL_SKILLS = [` |
| Sidebar layout | `core/ui.js` - search `nav.sidebar` or `sidebar-section` |
| Named QA assertions | `qa_named.js` - root of project |
| Release bump script | `devdocs/bump-version.sh` (root `bump-version.sh` forwards to it) |
| Active backlog | `devdocs/BACKLOG.md` |
| Version history | `devdocs/CHANGELOG.md` |
| Content authoring | `devdocs/content-authoring.md` |
| Table authoring guide | `CONTRIBUTING.md` - root of project |
| FCon SRD (searchable) | `/mnt/project/Fate-Condensed-SRD-CC-BY.html` |

---

*See devdocs/CHANGELOG.md for version history. Update this document whenever a major new capability is shipped, a new rule is discovered the hard way, or a working convention changes.*
