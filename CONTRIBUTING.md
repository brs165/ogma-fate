# Contributing to Ogma

Ogma is a Fate Condensed GM aid built with SvelteKit + Svelte 5.

---

## Before you start

Read these first:
- `CLAUDE.md` — architecture rules, component inventory, commands
- `docs/claude/PROJECT_MEMORY.md` — current state, known issues, backlog
- `docs/claude/CONVENTIONS.md` — Svelte 5 patterns, CSS rules, naming

---

## Stack

- **SvelteKit + Svelte 5** — runes mode (`$state`, `$derived`, `$props`)
- **Native canvas** — pointer/wheel pan-zoom (no SvelteFlow)
- **bits-ui** — headless accessible UI components
- **Dexie 4** — IndexedDB persistence
- **Vite 7 + adapter-static** — build and deploy
- **Cloudflare Pages** — hosting at ogma.net

---

## Development workflow

```bash
npm install
npm run dev       # dev server at localhost:5173
npm run build     # production build → build/
```

QA gate — must pass before any PR:
```bash
node scripts/qa-hard.mjs    # content + engine checks (189 checks)
node scripts/qa-export.mjs  # export round-trip checks
node scripts/qa-unit.mjs    # engine.js unit tests
npm run build               # must exit 0
```

---

## Svelte 5 rules (non-negotiable)

```svelte
<!-- Props — always $props() -->
let { campId = 'fantasy', onSelect = null } = $props();

<!-- State — always $state() for mutable vars -->
let open = $state(false);
let cards = $state([]);

<!-- Derived — always $derived() -->
let label = $derived(GENERATORS.find(g => g.id === activeGen)?.label ?? '');

<!-- Events — Svelte 5 syntax -->
<button onclick={handleClick}>Click</button>

<!-- Never export let, never on:click, never <slot /> -->
```

**Never** use `$state()` inside a function body — only at component top level.

---

## Architecture rules

1. **CSS in `static/assets/css/theme.css` only** — no `<style>` blocks in components
2. **`engine.js` and `db.js` are pure JS** — no Svelte imports, ever
3. **Native canvas** — pan/zoom via pointer/wheel events + CSS transform in OgmaCanvas.svelte
4. **Card components must not have `left/top` style** — only the `.cv-card-positioner` wrapper
5. **Preserve all a11y** — `role`, `aria-label`, `aria-pressed`, `aria-expanded`

---

## Adding a new campaign world

1. Create `src/data/[worldKey].js` following the schema in `docs/data-schema.md`
2. Register it in `src/data/index.js`
3. Run `node scripts/qa-hard.mjs` — must pass all checks
4. Add world voice to `docs/claude/WORLD-VOICES.md`
5. Add to inspirations in `docs/campaign-inspirations.csv`

See `docs/content-authoring.md` for full world-building guide.

---

## Adding a new generator type

1. Add entry to `GENERATORS` array in `src/data/shared.js`
2. Add generate function to `src/lib/engine.js`
3. Create `src/lib/components/cards/fronts/[GenName].svelte`
4. Add to `GEN_ITEMS` in `src/lib/components/board/AddMenu.svelte`
5. Run QA gate

---

## Decisions log

See `docs/decisions/` for architectural decision records:
- `0003-dexie-for-storage.md` — why Dexie 4
- `0004-offline-first.md` — why offline-first

Historical migration context: `docs/MIGRATION.md`

---

## Code of conduct

Be kind. GMs are counting on this tool at real tables.
