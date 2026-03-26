# Canvas Workshop — SvelteFlow Prep & Play Surface
# Date: March 2026 | Version: 2026.03.644

Full team workshop on the SvelteFlow canvas integration.
Six voices, two surfaces (Prep + Play).

---

## 🔴 BUGS — Must fix immediately

### BUG-01: `useSvelteFlow()` called outside SvelteFlow tree [FIXED in 576]
**Engineering:** `useSvelteFlow()` uses Svelte context set by `<SvelteFlow>`.
Calling it in `Board.svelte`'s top-level script — before the component mounts —
returns undefined functions and crashes at runtime.
**Fix:** Removed. Context menu uses clientX/Y for now (see IMPROVEMENT-04 for proper fix).

### BUG-02: Cards double-displaced [FIXED in 576]
**Engineering:** `BoardCard`, `BoardSticky`, `BoardBoost` all had `left:{x}px; top:{y}px`
inline styles. SvelteFlow already applies `transform:translate(x,y)` on the node container.
Double-positioning means every card renders at 2× its intended location and drifts further
on every drag.
**Fix:** Removed all `left/top` from card components. Removed `position:absolute` from `.board-card`.

### BUG-03: Drag conflict [FIXED in 576]
**Engineering:** `onmousedown` drag handlers on `BoardCard`/`BoardSticky` competed with
SvelteFlow's native pointer capture drag. Cards would snap, stutter, and fail position sync.
**Fix:** Removed all `onmousedown`/`onMouseDown`/`bc-drag-handle` from card components.
Added `nodrag nopan` classes to interactive zones (buttons, card content) so SF doesn't
start a drag when clicking action buttons.

### BUG-04: Context menu coords wrong at non-default zoom/pan
**Engineering:** Context menu uses `clientX/Y` for both display and card generation coords.
Display is correct (fixed positioning). Generation coords are wrong after pan/zoom.
**Status:** Partial fix. Display correct. Generation needs `screenToFlowPosition()` which
requires being called inside a child component inside `<SvelteFlow>`.
**Fix needed:** Create `CanvasOverlay.svelte` child component that uses `useSvelteFlow()`
and handles context menu generation. See IMPROVEMENT-04.

### BUG-05: `toastQueue.shift()` mutates $state array directly
**Engineering:** `toastQueue.shift()` mutates the array in place. Svelte 5's `$state`
tracks reassignment, not mutation. The toast queue may silently stop draining.
**Fix needed:**
```js
// Replace:
toast = toastQueue.shift();
// With:
toast = toastQueue[0];
toastQueue = toastQueue.slice(1);
```

### BUG-06: `unsubs = []` reassigns a `$state` array in `initStores()`
**Engineering:** `unsubs.forEach(u => u()); unsubs = [];` — this works but the `unsubs`
array is `$state([])`. Using it as a subscription cleanup list is fine but the `$state`
reactivity on it is unnecessary overhead. Should be a plain `let unsubs = []` since it's
not rendered in the template.

---

## 🟡 PREP SURFACE — Issues and improvements

### PREP-01: Card grid placement feels robotic
**UX:** Cards drop at 340px intervals in a rigid 3-column grid. Feels like a spreadsheet,
not a GM's table. The `lastPlaced` state resets to `x:60` after 3 cards and jumps `y` by 420.
No scattering, no breathing room. At zoom 0.8 the grid is tight and looks mechanical.
**Product:** Low effort, high feel improvement.
**Fix:** Add slight random offset to grid placement (±20px x/y), or use a smarter
stagger pattern. For same-type cards (bulk NPC generation) the grid is fine; for
single cards, drop near the center of current viewport.

### PREP-02: "Generate here" position not canvas-accurate
**UX + Engineering:** Right-click → context menu → generate places card at `clientX/Y`
not canvas coordinates. At default zoom 0.8 with pan offset, cards appear offset from
where you clicked. See BUG-04.

### PREP-03: No fit-to-cards on first load
**UX:** Board opens at `defaultViewport={x:20, y:20, zoom:0.8}`. If the user has 20 cards
spread over a large area from a previous session, they open to an empty-looking canvas
and don't know where their cards are.
**Fix:** On `canvas.loaded` event, if cards exist, call SvelteFlow `fitView()` after 100ms.

### PREP-04: Handles always hidden until hover
**UX:** Connection handles only appear on node hover. New GMs don't discover them.
**Fix:** Show handles on selected node permanently. Or add a one-time coach mark.

### PREP-05: No visual feedback on connect mode
**Engineering + UX:** When `connectSourceId` is set (user clicked connect on a card),
there's no visual indicator on the source card and no cursor change on the canvas.
The user has no idea what state they're in.
**Fix:** When `connectSourceId` is set, add a CSS class to the source node and change
the canvas cursor to crosshair.

### PREP-06: Undo only covers delete + reroll — not card moves
**Rules/QA:** `undoLast()` only handles `delete` and `reroll` entries in the undo stack.
Accidentally dragging a card to a wrong position cannot be undone.
**Fix:** Add position changes to the undo stack in `syncNodePositions()`.

### PREP-07: Search dim not hooked to SvelteFlow
**Engineering:** `isSearchMatch()` and `cardSearch` exist but the SvelteFlow nodes
aren't dimmed when a search is active. The old canvas dimmed non-matching cards.
**Fix:** In the derived `nodes` store, add a `className: cardSearch && !isMatch ? 'sf-dimmed' : ''`
field, and add `.sf-dimmed { opacity: 0.25 }` to theme.css.

### PREP-08: No way to select all / clear all from canvas
**UX:** No keyboard shortcut or button to select all cards. Ctrl+A is not wired.
**Fix:** Wire `Ctrl+A` to SvelteFlow's `selectAll` method. Add "Clear canvas" to
context menu (already in command palette).

---

## 🟡 PLAY SURFACE — Issues and improvements

### PLAY-01: Players panel takes up left panel real estate in Play mode
**UX:** In Play mode the left panel switches to showing the player roster where the
generator list was. But GMs still need to generate content mid-session.
**Fix:** Play mode left panel should be tabs: "Players" | "Generate". Players tab by
default, but Generate is one click away.

### PLAY-02: TurnBar uses `confirm()` dialogs for destructive actions
**Engineering + UX:** `endScene()`, `startSession()`, `newScene()` all use `confirm()`
— a blocking browser dialog. This is inaccessible, unstyled, and janky at a table.
**Fix:** Replace `confirm()` with Bits UI `AlertDialog` (already installed). Modal with
clear description of what will change, styled to match the app.

### PLAY-03: Player stress boxes don't distinguish physical/mental visually
**Rules/UX:** Physical and mental stress boxes are labelled but look identical.
At a real table the GM needs to scan quickly.
**Fix:** Add colour coding — physical stress: amber/orange, mental stress: blue/purple.

### PLAY-04: Consequence input loses focus on mobile
**Engineering:** `<input>` for consequences inside `PlayerRow` is inside an accordion
that can collapse. On iOS, the keyboard appears and immediately the element scrolls
out of view.
**Fix:** Prevent accordion collapse while a consequence input has focus. Add `inputmode="text"` to consequence inputs.

### PLAY-05: GM fate pool has no visual urgency
**UX:** The GM pool shows a number but doesn't communicate "you have 0 FP" urgency.
At 0, the GM can't invoke NPC aspects — this is a critical play state.
**Fix:** When `gmPool === 0`, show the count in `var(--c-red)` and add a small pulse
animation. Already in PlayerRow for player FP — apply same treatment to GM pool.

### PLAY-06: No "send to play canvas" flow from cards
**UX:** Cards generated during Prep can be sent to the Play canvas, but the UX for
this is buried in the Binder panel. During a live session a GM needs to be able to
grab an NPC card and drop it into play in one action.
**Fix:** Add a "→ Table" quick action button that appears on card hover in Play mode.
This already exists in the code (`onSendToTable`) but the button may not be visible
or prominent enough.

### PLAY-07: Round counter has no "new exchange" concept
**Rules:** In Fate Condensed, rounds are called "exchanges". The TurnBar says "Rnd" but
FCon calls them exchanges. Small but confusing for new players.
**Fix:** Rename "Rnd" to "Exchange" in TurnBar. Keep the variable name as `round` internally.

### PLAY-08: No compel offer visual on player canvas
**UX:** When a GM offers a compel (`compelOffer` state), there's internal state but
no visible modal or notification prompting the GM to resolve it.
**Fix:** When `compelOffer` is set, show a modal with the player name, aspect, and
Accept/Refuse buttons that trigger the fate point transfer.

---

## 💡 WORLD-CLASS IMPROVEMENTS (make it the best)

### WC-01: Fit view on canvas load
When the canvas loads with existing cards, call `fitView()` so the GM sees all their
cards immediately. One line, huge UX win.

### WC-02: Card type groupings as SvelteFlow node groups
Use SvelteFlow `<NodeGroup>` to visually group cards by scene or region. The GM can
collapse a group to hide cards from a previous scene. This is the spatial memory
aid that makes prep actually useful at the table.

### WC-03: Connector edge labels
When two cards are connected, clicking the edge should offer a label:
"Knows", "Opposes", "Owes", "Fears", "Loves", "Commands", "Rival", or custom.
One click, stored in connector data, rendered on the edge. Massively improves
relationship readability for complex prep.

### WC-04: Card minimise / expand
Double-click card header → collapse to just the title strip (50px tall).
Massively useful for organising a dense canvas — collapse NPCs you're done with,
keep active scene cards expanded.

### WC-05: Canvas templates
"New scene" button that drops a pre-arranged template: scene card + 2 NPC slots +
countdown + encounter. The GM fills in the details. This is what the "Starter Scene"
button approximates — formalise it into a proper template system.

### WC-06: Session summary auto-generation
At the end of a session, generate a formatted markdown summary:
- Cards generated this session (from IDB timestamp)
- Rolls made (from rollHistory)
- Consequences taken
- FP economy (spent vs earned)
Export to clipboard. One click.

### WC-07: Player-facing mode
In multiplayer, players see a read-only version of the GM's canvas.
Cards marked `gmOnly: true` are hidden from the player view.
The GM should be able to toggle `gmOnly` on any card with one click.

### WC-08: Consequence tracking on canvas cards
When a consequence is taken by a player, automatically create an Aspect Sticky
on the canvas with the consequence text and the player's name. The GM can see
active consequences spatially on the play surface.

### WC-09: Keyboard-first canvas
Experienced GMs shouldn't need the mouse:
- `Tab` cycles through cards
- `Enter` on selected card opens dossier
- `Delete` removes selected card
- Arrow keys nudge position (already implemented)
- `Space` generates with active generator
- `Ctrl+A` selects all
- `Ctrl+Z` undo

### WC-10: Card "acted" state in Play mode
In Play mode, cards on the canvas that represent NPCs should visually indicate
whether they've acted this exchange (greyed out = acted, full colour = not yet).
The `acted` field is already on card data — just needs CSS treatment in the node.

---

## Implementation priority (next sprint)

### Sprint 1 — Fix the broken ✅ COMPLETE
- [x] BUG-01: useSvelteFlow outside tree
- [x] BUG-02: Double positioning
- [x] BUG-03: Drag conflict
- [x] BUG-04: CanvasContextMenu child component (proper canvas coords)
- [x] BUG-05: toastQueue.slice() $state-safe
- [x] BUG-06: unsubs plain let

### Sprint 2 — Play mode ✅ COMPLETE
- [x] PLAY-01: Play mode Players | Generate tabs
- [x] PLAY-02: AlertDialog for TurnBar confirms
- [x] PLAY-05: GM pool pulse+shake at 0
- [x] PLAY-08: Compel offer modal with auto FP transfer
- [x] WC-01: fitView on load when restoring existing cards
- [x] PLAY-03: Stress colour coding (amber=phy, purple=men)
- [x] PLAY-07: "Rnd" → "XCHG" (exchange)

### Sprint 3 — Prep power features ✅ COMPLETE
- [x] PREP-05: Connect mode visual feedback (dashed outline + crosshair)
- [x] PREP-07: Search dim on SF nodes (all 4 node types)
- [x] WC-04: Card minimise/expand (double-click or ▲ button)
- [x] WC-03: Edge labels (click edge to cycle: Knows/Opposes/Ally/Fears/Owes/Loves/Rival/Commands/Seeks)
- [x] WC-10: NPC acted state on canvas (greyed when acted)

### Sprint 4 — World class (backlog)
- [ ] WC-02: Node groups (scene spatial grouping)
- [ ] WC-05: Canvas templates (starter scene layouts)
- [ ] WC-07: Player-facing gmOnly card toggle
- [ ] WC-08: Consequence stickies auto-placed from player tracker
- [ ] PREP-06: Undo covers card moves (currently delete+reroll only)
- [ ] PREP-08: Ctrl+A select all nodes
