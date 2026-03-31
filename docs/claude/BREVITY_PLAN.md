# Smart Brevity Audit — Ogma Help Content

## Context

The Ogma help wiki has **16 pages** (~2,837 lines) plus **HELP_CONTENT/HELP_ENTRIES** in `shared.js` (~800 lines of prose). The writing is well-structured (Quick Starts, TOCs, callouts) but **verbose** — sentences averaging 30-50 words, paragraphs burying key facts, and callouts repeating surrounding text.

**Goal:** Revise all help content to Smart Brevity style while preserving structure, links, a11y, and interactive elements. Target ~27% reduction in total line count.

**Branch:** `brevity` (from `main`)

---

## Smart Brevity Principles (applied)

1. **One strong opening sentence** — front-load the key fact. No preamble.
2. **Short sentences** — average 12-15 words. Max 25. Break longer sentences.
3. **Short paragraphs** — 1-3 sentences max.
4. **Bold key terms** — scannable words that carry meaning.
5. **Bullets over paragraphs** — lists are faster to scan than prose.
6. **Cut filler** — remove "essentially," "basically," "in order to," "it's important to note that," etc.
7. **Active voice** — always. No passive.
8. **Eliminate redundant callouts** — when a callout repeats the paragraph above/below it, keep only the better version.
9. **Cap `wiki-page-desc`** at one sentence, max 20 words.

---

## Revision Patterns

**Pattern A: Shorten `wiki-page-desc` to one sentence, max 20 words.**
> Before: "Ogma generates mechanically correct Fate Condensed content. This page explains the mechanics behind the generators, with deep dives into Create Advantage, the fate point economy, GM prep structure, common errors, and further reading."
> After: "The Fate Condensed mechanics behind every generator Ogma produces."

**Pattern B: Front-load key facts. Cut preamble.**
> Before: "No — and this is the most important difference to internalise. Stress is a scene-by-scene pacing buffer..."
> After: "**No.** Stress boxes clear at the end of every scene."

**Pattern C: Convert multi-sentence prose to bullet lists.**
Where a paragraph has 3+ distinct facts joined by sentences, convert to `<ul>` or `<ol>`.

**Pattern D: Eliminate redundant callouts.**
When a callout repeats the paragraph above/below it, keep only the better version and delete the other.

**Pattern E: Cut filler phrases globally.**
- "It's important to note that" → delete
- "essentially" / "basically" → delete
- "in order to" → "to"
- "the thing that" → rephrase
- "There is no / There are no" → active voice
- "This is because" → "Because" or cut
- "What this means is" → delete, state directly

**Pattern F: Cap sentence length at 25 words.**

**Pattern G: HELP_CONTENT `beginner.what` fields — cut to 2 sentences max.**

**Pattern H: Convert deep-dive prose to `<details>` "Go deeper" blocks** where a short summary suffices but full explanation exists.

---

## Batch Strategy (5 batches, 5 commits)

### Batch 1 — "The Big Three" (highest impact)
- `src/routes/help/fate-mechanics/+page.svelte` (373 lines → ~250)
- `src/routes/help/learn-fate/+page.svelte` (361 lines → ~270)
- `src/data/shared.js` — HELP_CONTENT + HELP_ENTRIES only (~800 → ~550)

**Do NOT modify:** GENERATORS, GENERATOR_GROUPS, SKILL_LABEL, ALL_SKILLS, WORLD_META, WORLD_DATA, or related-generators wiring in shared.js.

### Batch 2 — "Learning path pages"
- `src/routes/help/learn-fate-deep/+page.svelte` (301 → ~260, tutorial/narrative sections exempt)
- `src/routes/help/new-to-ogma/+page.svelte` (164 → ~130)
- `src/routes/help/dnd-transition/+page.svelte` (155 → ~125)

### Batch 3 — "Tool/feature pages"
- `src/routes/help/generators/+page.svelte` (133 → ~110)
- `src/routes/help/at-the-table/+page.svelte` (160 → ~130, conflict walkthrough exempt)
- `src/routes/help/hosting/+page.svelte` (208 → ~160)

### Batch 4 — "Reference/support pages"
- `src/routes/help/faq/+page.svelte` (166 → ~120)
- `src/routes/help/mistakes/+page.svelte` (230 → ~190)
- `src/routes/help/export-share/+page.svelte` (101 → ~80)

### Batch 5 — "Light touch pages"
- `src/routes/help/+page.svelte` (home, 121 → ~110)
- `src/routes/help/customise/+page.svelte` (95 → ~80)
- `src/routes/help/getting-started/+page.svelte` (86 → ~75)
- `src/routes/help/how-to-use-ogma/+page.svelte` (64 → ~55)

### Skip entirely:
- `src/routes/help/reference/+page.svelte` — print reference card, already maximally terse
- `src/routes/help/+layout.svelte` — navigation infrastructure, no prose content

---

## What NOT to Change

**Structural elements (preserve exactly):**
- All `<svelte:head>` blocks
- All `<nav>` elements (wiki-toc, wiki-card-grid, wiki-breadcrumb)
- All `id` attributes on headings/sections (scroll spy + TOC depend on these)
- All `class` attributes
- All `role`, `aria-*` attributes
- All `<kbd>` elements, `<a>` links (especially `srd-link`), Font Awesome `<i>` icons
- All `wiki-footer` blocks
- All `learn-quickstart` / Quick Start summaries (already brief)
- All `wiki-table-wrap` / `wiki-table` structures

**Content to preserve as-is:**
- `reference/+page.svelte` — print card
- Interactive elements: HelpDiceRoller, step-block progressive disclosure
- Play-by-post walkthrough in `learn-fate-deep`
- Interactive tutorial scene steps in `learn-fate-deep`
- Conflict walkthrough scenario in `at-the-table`
- All code blocks in hosting page
- All comparison tables (D&D vs Fate)
- All `<script>` sections

---

## Verification (before each batch commit)

1. **Build:** `npm run build` — no Svelte compilation errors
2. **QA:** `node scripts/qa-hard.mjs` — all checks pass
3. **Link integrity:** `grep -oP 'href="[^"]*"' src/routes/help/*/+page.svelte | sort` — identical before/after
4. **Anchor integrity:** `grep -oP 'id="[^"]*"' src/routes/help/*/+page.svelte | sort` — identical before/after
5. **SRD links:** `grep -c 'srd-link' src/routes/help/*/+page.svelte` — counts match
6. **A11y:** `grep -c 'aria-' src/routes/help/*/+page.svelte` — counts match
7. **shared.js syntax:** `node -e "require('./src/data/shared.js')"` or build check
8. **Word count:** Compare total prose words before/after, verify ~25-40% reduction per page

---

## Reduction Targets

| File | Current | Target | Reduction |
|------|---------|--------|-----------|
| fate-mechanics | 373 | ~250 | ~33% |
| learn-fate | 361 | ~270 | ~25% |
| shared.js (help) | ~800 | ~550 | ~30% |
| learn-fate-deep | 301 | ~260 | ~14% |
| mistakes | 230 | ~190 | ~17% |
| hosting | 208 | ~160 | ~23% |
| faq | 166 | ~120 | ~28% |
| new-to-ogma | 164 | ~130 | ~21% |
| at-the-table | 160 | ~130 | ~19% |
| dnd-transition | 155 | ~125 | ~19% |
| generators | 133 | ~110 | ~17% |
| +page (home) | 121 | ~110 | ~9% |
| export-share | 101 | ~80 | ~21% |
| customise | 95 | ~80 | ~16% |
| getting-started | 86 | ~75 | ~13% |
| how-to-use-ogma | 64 | ~55 | ~14% |
| **Total** | **~3,700** | **~2,700** | **~27%** |

---

## Execution Steps

1. Create `brevity` branch from `main`
2. Commit this plan to the repo as `docs/claude/BREVITY_PLAN.md`
3. Execute Batches 1-5 sequentially, committing after each
4. Verify build + QA after each batch
