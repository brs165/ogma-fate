# Ogma — Code Quality Reference

> Standards for keeping Ogma's codebase simple, readable, and maintainable without a build step.  
> For a new contributor, this + `ARCHITECTURE.md` + `CONTRIBUTING.md` should be enough to orient completely.

---

## The governing principle

Ogma has no build step, no bundler, no transpiler. Source files are the app. This means:

- **Readability is load-bearing.** A confused contributor makes a load-order mistake and the app breaks at runtime with no error message.
- **Simplicity is a feature.** The complexity budget is the same as any project — but here it can't be hidden behind tooling.
- **Elegance beats cleverness.** A 10-line function that a junior developer understands on first read is always better than a 4-line function that requires context to parse.

---

## The var/const split (read this first)

The codebase is intentionally split. This is not inconsistency — it is history and constraint.

| Files | Style | Why |
|-------|-------|-----|
| `core/engine.js` | `var` only | Legacy; Node test harness uses `eval()` which has quirks with `const` in strict mode |
| `core/ui.js` | `var` only | Large legacy file; migration in progress but not complete |
| `core/ui-board.js` | `var` only | Matches `ui.js` style. `ui-run.js` stripped v330 — tombstone only. |
| `core/db.js`, `core/config.js`, `core/intro.js` | `var` only | Legacy |
| `data/*.js` | `var` only | All data files; never use `const` here |
| `core/ui-primitives.js` | `const`/`let` | Module base; loaded first; defines the globals that cannot be redeclared |
| `core/ui-modals.js`, `core/ui-landing.js` | `const`/`let` | Clean split-off components |
| `core/ui-renderers.js`, `core/ui-table.js` | **Mixed** | Module-level `const` constants (`CV4_META`, `CV4_CAT`, `CV4_DARK`, `CV4_LIGHT`, `CV4_FRONTS`, `TP_LADDER`, `TP_COLORS` etc.) coexist with function-scoped `var`. ESLint allows `var` in these files. |

**The critical rule:** `ui-primitives.js` declares `h`, `useState`, `useCallback`, `useEffect`, `useRef`, `Fragment`, `RA_ICONS`, and `TIMING` as `const`. **Never redeclare these in any other file.** Redeclaring a `const` with `var` is a `SyntaxError` that silently kills the entire script — it does not produce a helpful error message in the browser. This has burned us twice.

ESLint enforces this split. `npm run lint` will fail if `var` appears in the const/let files, or if these globals are redeclared anywhere.

---

## Naming conventions

**Functions:** verb-noun, camelCase. `generateCard`, `deleteCard`, `updateCard`, `rerollCard`. Not `handleCardDelete`, not `cardGenerate`.

**Components:** PascalCase noun. `BoardCard`, `BoardLabel`, `TpDicePanel`. The prefix indicates the surface: `Tp` = Table/PrepCanvas, `Bd` = Board dossier, `Rs` = run.html.

**State variables:** noun, camelCase. The array-destructure pattern is mandatory in var-only files:
```js
// CORRECT — var-only files
var _cards = useState([]);
var cards = _cards[0];
var setCards = _cards[1];

// CORRECT — const/let files
const [cards, setCards] = useState([]);

// NEVER — mixing styles in same file
```

**IDB keys:** `snake_case_v1` with version suffix. `board_canvas_v1`, `prep_table_pinned_thelongafter`. The version suffix allows schema migrations without a migration script.

*Legacy exceptions (pre-convention, do not rename — would break existing user data):* `tp_canvas_[campId]`, `session_doc_[campId]`, `floater_pos_[id]`, `fate_last_camp`. Apply the `_v1` convention to all new keys only.

**CSS classes:** `kebab-case`. Prefixed by surface: `.bt-` (board topbar), `.blp-` (board left panel), `.bd-` (board dossier), `.rs-` (run session), `.tp-` (table prep), `.cc-` (canvas card), `.app-` (global app shell).

---

## File size

| Threshold | Meaning |
|-----------|---------|
| Under 500 lines | Target for any new file |
| 500–1000 lines | Acceptable; review whether split makes sense |
| Over 1000 lines | Needs a documented reason; split if a clean boundary exists |

`ui.js` at ~2900 lines is a known legacy exception. It grew before the split pattern was established. Do not add to it if the addition fits better elsewhere. New components that would go in `ui.js` should go in the most appropriate split file (`ui-board.js`, `ui-run.js`, etc.) instead.

`intro.js` at ~1350 lines is also a documented exception. It is entirely self-contained (no React, no Dexie, no globals from other files) and implements a complex frame-by-frame animation engine with world-specific sequences. The size is justified by the encapsulation — splitting it would create coupling where none currently exists.

**Splitting rule:** Only split a file when there is a clean seam — a set of functions with no shared closure state that can be extracted without passing 15+ props. Do not split for size alone if the result is worse coupling.

---

## Comment standards

**Section markers** (use in all UI files):
```js
// ── ComponentName — one-line description ─────────────────────────────────
function ComponentName(props) { ... }
```

**JSDoc** (use on all public engine functions):
```js
/**
 * One-sentence description of what this does.
 * @param {string} genId - Generator identifier (e.g. 'npc_major')
 * @param {object} tables - Filtered world tables from filteredTables()
 * @returns {object} Generator result. Shape varies by genId — see data-schema.md.
 */
function generate(genId, tables, partySize) { ... }
```

**Inline comments:** Only for *why*, never for *what*. If the code is clear, no comment. If there's a non-obvious reason for a decision, one line above the code. Never a block of comments explaining what each line does — that's a sign the code needs simplifying.

```js
// GOOD — explains why
// Using position:fixed here because the toolbar has overflow:auto which traps absolute children
style: {position: 'fixed', top: pos.top + 'px'}

// BAD — explains what (the code already says this)
// Set the position to fixed and set the top coordinate
style: {position: 'fixed', top: pos.top + 'px'}
```

**TODO comments:** Allowed with a backlog ID reference.

---

## Known footguns

**Local function `renderCard` in PrepCanvas (FIXED v321):** `ui-table.js` had a local `function renderCard(card, inZoneMode)` inside the `PrepCanvas` IIFE. When `renderCard(card.genId, card.data, ...)` was called as a global inside that scope, JS resolved the local first — `card` became a string, `card.id` threw a TypeError. Renamed to `renderTpCard`. If you add a new helper inside PrepCanvas, check for collisions with `ui-renderers.js` globals (`renderCard`, `renderResult`).

**`DB.printCards` must be in `window.DB` (second IIFE):** `db.js` has two IIFEs. The first handles localStorage. The second defines `window.DB`. A function defined in the first is not accessible via `DB.x`. Burned us in v310 — print showed "Print unavailable" for months. Always add DB methods to the `window.DB = { ... }` block in the second IIFE.

**`bump-version.sh` must be updated when adding new core JS files.** New files (like `ui-board.js`) are not stamped by default — the script has an explicit list of patterns. If a file has a stale `?v=286` while everything else is `?v=307`, users get the old cached version. Add the pattern to `scripts/bump-version.sh` immediately when the file is created. (This caused the v286→v307 stale stamp bug.)

**Self-referential var assignment.** In `var`-only files, destructuring component props manually (`var foo = props.foo`) is correct. Writing `var foo = foo` (referencing the var being declared) does not throw a SyntaxError — JavaScript hoists the `var` declaration, so the right-hand side resolves to `undefined`. The component then receives `undefined` for that prop and any usage of it will be a `ReferenceError` at render time. This produced the `showDice is not defined` ErrorBoundary crash in v298. Always write `var foo = props.foo`. `// TODO BL-02: stunt data spec needed before this can render`. No orphan TODOs without an ID.

---

## Component decomposition

Extract a component when:
- It has a single, coherent responsibility
- It can be tested or reasoned about independently
- It receives only the props it needs (not a subset of a large state object)

Do not extract when:
- It would require passing 10+ props from the parent closure
- It would split tightly coupled render logic across two functions
- The result is longer than the original

The test: can you describe what the extracted component does in one sentence without mentioning its parent? If not, don't extract.

---

## h() formatting

Nested `h()` calls use 2-space indent per depth. The goal is scannable structure. Apply this to all **new** code. Existing flat-chained h() calls in ui-table.js and ui-run.js are technical debt but are not worth touching without a specific refactor session.

```js
// CORRECT
h('div', {className: 'board-card'},
  h('div', {className: 'bc-stripe', style: {background: C.stripe}}),
  h('div', {className: 'bc-inner'},
    h('div', {className: 'bc-title'}, title),
    summary && h('div', {className: 'bc-body'}, summary)
  )
)

// AVOID — flat formatting loses nesting structure
h('div', {className: 'board-card'}, h('div', {className: 'bc-stripe', style: {background: C.stripe}}), h('div', {className: 'bc-inner'}, h('div', {className: 'bc-title'}, title)))
```

---

## The globals-as-modules pattern

There are no ES modules. Globals are the module system. This means:

- Every symbol used across files must be declared in a file that loads before the consumer
- Script load order in HTML is the dependency graph — it is not enforced by any tooling except NA-13/14/21 in the QA suite
- When adding a new global, add it to `eslint.config.cjs` in the appropriate section

If you find yourself writing `window.Foo = ...` to export something, that's the correct pattern. If you find yourself writing `import Foo from './foo.js'`, stop — ES modules are not used.

---

## Open source best practices checklist

For any PR or contribution:

- [ ] `node --check` passes on all modified `.js` files
- [ ] `node tests/qa_named.js` passes (113/113)
- [ ] `node --check core/ui-run.js && node --check core/ui-board.js` — these are var-only and not covered by some IDE checkers
- [ ] `node tests/engine.test.js` passes (59/59)
- [ ] Smoke test passes (128/128)
- [ ] No `font-size:8px` or `font-size:9px` in any new CSS (enforced by NA-68)
- [ ] No hardcoded hex colour values **for text** — use `var(--text)`, `var(--text-muted)`, etc. Hardcoded hex for decorative stripe/badge colours (e.g. `BOARD_TYPE_COLOR` card stripes) is acceptable when the value must be opaque regardless of theme.
- [ ] No `const`/`let` in var-only files; no `var` in const/let files
- [ ] No redeclaration of `h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment`
- [ ] Touch targets ≥44px on mobile, ≥28px on `pointer:fine` (enforced by NA-92)
- [ ] New interactive elements have `aria-label` or visible text label
- [ ] New IDB keys end in `_v1` (or appropriate version)
- [ ] `scripts/bump-version.sh` run before zip/deploy
- [ ] If CSS changed: tested in both light and dark theme

### Write-only state should be a ref

If you declare `useState` but never read the value in JSX or render logic, it's a ref, not state:

```js
// BAD — causes re-render on every write, value never read
const [, setUsedGens] = useState({});
setUsedGens(function(prev) { ... });

// GOOD — mutation only, no re-render
var usedGensRef = useRef({});
usedGensRef.current[key] = true;
```

**Rule:** If the only thing the state does is allow a functional update (reading `prev`), refactor to a `useRef` and mutate `ref.current` directly.

### Prop drilling beyond 3 levels → context object

When the same set of related props appears in a parent and must be threaded through to a grandchild (or deeper), collapse them into a single context object:

```js
// BAD — 9 props drilled CampaignApp → PrepCanvas
tableSync, tableRoomCode, tableIsRemote, tablePresence,
onRemoteCursor, onRemoteState, onHostTable, onJoinTable, onDisconnectTable

// GOOD — one prop, destructure inside
tableSyncCtx: { sync, roomCode, isRemote, presence, onCursor, onState, host, join, disconnect }
// In child: var _sc = props.tableSyncCtx || {};
```

No React Context API needed — a plain object works and is easier to trace.
