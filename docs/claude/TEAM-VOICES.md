# Ogma Workshop Voice System

Six voices review every feature before it ships. Each voice has a distinct lens, veto criteria, and output format. No feature merges until all six voices sign off.

---

## 1. Engineering

**Lens:** Technical correctness and build-chain integrity.

**Checks:**
- Valid Svelte 5 runes / Svelte 4 `export let` syntax (per CLAUDE.md)
- ES module imports resolve — no circular deps, no bare specifiers
- Vite build passes (`npm run build` exits 0)
- Load order: stores before components, `engine.js` and `db.js` import no Svelte
- No runtime `document`/`window` access during SSR-compatible paths
- adapter-static constraints respected (no server endpoints)
- Component hierarchy: components import stores, never the reverse

**Veto if:** Build fails, import cycle introduced, or architecture rule from CLAUDE.md violated.

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

**Lens:** Fate Condensed SRD accuracy and campaign world voice consistency.

**Checks:**
- Aspect language follows Fate Condensed SRD wording (situation aspects, boosts, consequences)
- Stress tracks use correct box counts (1-2-3 physical, 1-2-3 mental unless stunts modify)
- Fate point economy rules: invoke, compel, refresh
- Challenge / contest / conflict mechanics match SRD procedures
- Generated NPC and scene content matches the active campaign's tone, vocabulary, and genre
- Card labels use canonical Fate terms (not D&D equivalents)
- World data files in `src/data/` maintain consistent voice per setting

**Veto if:** SRD rule misrepresented, wrong mechanical term used, or generated content breaks campaign voice.

**Output format:**
```
[Rules/Content] PASS | VETO
- SRD compliance: pass / violation at <location>
- World voice: consistent / drift in <file>
- Terms audited: <list>
- Notes: <detail>
```

---

## 3. QA

**Lens:** Test gates, regression prevention, and verification rigor.

**Checks:**
- `npm run dev` starts with zero errors (warnings acceptable)
- `npm run build` succeeds with "done" output
- Component count: `find src -name "*.svelte" | wc -l` matches expected (currently 51)
- Store count: `ls src/lib/stores/*.js | wc -l` matches expected (currently 6)
- Engine exports verify: `node -e "import('./src/lib/engine.js').then(m => console.log(Object.keys(m)))"`
- No stubs: `grep -rn "TODO\|FIXME\|STUB" src/` returns zero hits
- Every fixed bug gets a **named assertion** describing what was broken and how to verify the fix

**Named assertion format:**
```
ASSERT [bug-slug]: <one-line description of what must remain true>
VERIFY: <exact command or manual step to confirm>
```

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

**Lens:** Touch usability, discoverability, and user-segment fit.

**User segments:**
| Segment | Description |
|---------|-------------|
| New GM | First time running any TTRPG session |
| D&D Convert | Experienced with D&D, new to Fate mechanics |
| Beginner | Played a few Fate sessions, still learning |
| Solo | Running Fate solo, no players at the table |
| At-Table | GM with players present, needs speed and glanceability |

**Checks:**
- All interactive elements meet **44px minimum touch target** (buttons, toggles, cards, tray items)
- Discoverability score: if <50% of target segment would find the feature without help, it is **critical**
- New features evaluated against each segment — note which segments benefit, which are unaffected
- Keyboard and screen reader accessibility preserved (`role`, `aria-label`, `aria-pressed`, `aria-expanded`)
- Mobile-first layout: no horizontal scroll on 375px viewport
- Drag interactions have non-drag alternatives

**Veto if:** Touch target below 44px, discoverability < 50% with no mitigation plan, or accessibility attribute removed.

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

**Lens:** Prioritization through segment impact, effort, and strategic alignment.

**Framework: Segment x Impact x Effort**

| Factor | Scale | Definition |
|--------|-------|------------|
| Segments reached | 1-5 | How many of the 5 user segments benefit |
| Impact per segment | 1-5 | How much the feature improves their experience |
| Effort | 1-5 | Implementation cost (1 = trivial, 5 = multi-week) |
| Priority score | calculated | `(segments x impact) / effort` |

**Checks:**
- Feature has a clear segment target — "everyone" is not a segment
- Priority score computed and compared to current backlog
- Scope creep flagged: does the PR do more than the stated goal?
- Reversibility assessed: can this be rolled back without data loss?

**Veto if:** Priority score below threshold with no strategic justification, or scope creep detected without acknowledgment.

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

**Lens:** Quality scoring of generated content across five dimensions.

**Scoring dimensions (each 1-10):**

| Dimension | What it measures |
|-----------|-----------------|
| **Voice** | Does generated text sound like the campaign world? Genre-appropriate vocabulary, tone, sentence rhythm. |
| **Narrative** | Does the content create hooks, tensions, or questions that drive play forward? |
| **Mechanical** | Are Fate mechanics correctly embedded? Aspects invokable, stunts balanced, difficulties calibrated. |
| **Polish** | Grammar, consistency, no placeholder text, no repeated phrases across regenerations. |
| **Pacing** | Does the content fit the moment? Scene openers are punchy, NPCs don't monologue, complications escalate. |

**Composite score:** Average of all five dimensions. Minimum 6.0 to ship.

**Checks:**
- Sample generated output (minimum 3 rolls per generator touched by the change)
- Score each sample across all five dimensions
- Flag any dimension scoring below 5 as a blocker
- Compare against baseline scores if available

**Veto if:** Composite score below 6.0, or any single dimension below 5.

**Output format:**
```
[Mechanical Auditor] PASS | VETO
- Samples reviewed: <n>
- Voice:     <score>/10
- Narrative: <score>/10
- Mechanical:<score>/10
- Polish:    <score>/10
- Pacing:    <score>/10
- Composite: <score>/10
- Blockers: <list or "none">
- Notes: <detail>
```

---

## Review Protocol

1. Feature author presents the change with a one-line summary
2. All six voices review in parallel
3. Any single VETO blocks the merge
4. Vetoing voice must state the specific fix required
5. After fixes, only the vetoing voice(s) re-review
6. When all six voices show PASS, the feature ships

## Shorthand for Commit Messages

When all voices pass, append the review tag:

```
feat: add complication generator

[workshop: 6/6 pass]
```

When shipping with acknowledged caveats:

```
feat: add complication generator

[workshop: 6/6 pass, UX caveat: discoverability 55% for new-gm segment]
```
