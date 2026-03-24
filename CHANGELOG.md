# Ogma Changelog

> Reverse-chronological. Each entry covers one released version.
> For backlog and roadmap see `BACKLOG.md`. For product strategy see `VISION.md`.
>
> Versions prior to 2026.03.70 were archived in March 2026 during a major restructure.
> The project launched as "Fate Condensed Generator Suite" and was rebranded to Ogma at v2026.03.73.

---

## 2026.03.403 — Full-size cv4Cards + Export page + Hook wiring audit

**Full-size interactive cv4Cards on canvas:**
- Board cards widened 224→320px. cv4Card renders at 100% with all interactions enabled (was 65% scaled with `pointer-events:none`)
- Drag handle strip (≡) at top of each card for repositioning. Click inside card for stress boxes, flip, countdown, consequences
- Flip button labels: "▸ Tap for GM Guidance" (front), "◀ Tap for Card Details" (back)
- Card placement grid: 3 columns × 340px spacing, 420px row height. Default zoom 60%
- `fitAll()` dimensions updated for new card size (320×400)

**Export page (replaces canvas):**
- Sidebar "Export Cards" opens BoardApp with export page as main content (not a tab)
- Topbar ⋯ overflow button opens export page
- ← Back button returns to canvas
- `BoardExportPanel`: card checklist (All/None), 8-format grid, copy/download delivery
- EXPORT tab removed from GENERATE|STUNTS|HELP strip

**Hook wiring audit** (`tests/hook-wiring-audit.js`):
- Parses every `function use*` hook, verifies return object keys resolve in scope
- Checks function call-site arg counts (skips `obj.method()`, handles object literal args)
- 59 checks, catches exact class of bugs that produced v401/v402 hotfixes

**New QA assertions:** NA-323 through NA-327. NA-302 updated for export page.

327/327 named · 59/59 hook wiring · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.402 — Hotfix: sendToCanvas setCards param

- `sendToCanvas` in `useBoardBinder` took `setCards` as a parameter that no call site passed
- Replaced with `getCanvasCards()` + `persistCanvas()` — same pattern `sendTrayToCanvas` already uses

---

## 2026.03.401 — Hotfix: stale undo refs after WS-36 refactor

- WS-36 replaced `lastRemovedRef` + `lastRerolledRef` with `undoStackRef` but left stale names in `useBoardCards` return object and BoardApp destructure
- Removed both stale references. Hook wiring audit would have caught this.

---

## 2026.03.400 — Sprint C: Invoke sprint (3 items)

**WS-26: Invoke workflow — 3 invoke paths, all wired to dice panel:**
- Sticky free invoke: consume pip → `onInvoke({source:'free'})` → `pendingInvoke` state → dice +2 → cleared after roll
- Boost invoke: use invoke button → expires boost → same path
- Generated card invoke: ⦿ button in BoardCard action strip → `onInvoke({source:'paid'})` → dice +2
- All three open dice panel automatically and toast "✦ Invoke queued — +2 on next roll"

**WS-37: Free invoke → dice bonus wiring:**
- `TpDicePanel` accepts `pendingInvoke` prop, `invokeBonus = pendingInvoke ? 2 : 0`
- Roll total includes +2. `onClearInvoke` callback clears after roll
- Invoke badge shows source and aspect name. Cancel button (✕)

**WS-39: Create Advantage outcome guide:**
- Collapsible "✦ Create Advantage?" after every roll
- SWS = 2 free invokes, Success = 1, Tie = boost, Fail = opponent gets invoke

NA-315–322. 322/322 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.399 — Sprint G (GM polish) + Sprint H (Platform hardening)

**Sprint G:**
- WS-36: Multi-step undo — `undoStackRef` (10 entries) replaces two single refs. Delete + reroll both push
- WS-38: Session summary — 📋 button in turn bar. Builds markdown log and copies to clipboard
- WS-44: Card search — 🔍 input in zoom bar. Non-matching cards dim to 20% opacity. Escape clears
- WS-46: Move to table — ➔ button in prep mode sends to table then deletes from prep

**Sprint H:**
- WS-47: Player reconnect — GM detects existing name on `player_hello`, re-broadcasts instead of duplicating
- WS-48: Toast queue — `toastQueueRef` array with `drainToast()`. Sequential 1.8s drain
- WS-49: Max players — `addPlayer` returns silently at 8
- WS-50: Per-panel ErrorBoundary — BoardLeftPanel wrapped
- WS-51: IDB quota warning — `navigator.storage.estimate()` on mount, toast at 80%+
- WS-53: Print scene — 🖨 button in turn bar, calls `DB.printCards`

NA-304–314. 314/314 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.398 — Sprint D + E + F + Board Export Panel

**Sprint D — Conflict completeness:**
- WS-28: Concede button in BoardPlayerRow. Earns 1 FP per consequence. Confirm dialog
- WS-29: NPC cards in turn order. Pills with acted toggle. allActed includes NPCs. Separator bar
- WS-45: Consequence recovery hints ("↳ clears end of next scene/session/scenario")
- WS-32: Scene transition. `clearTable()` in useBoardBinder. "⟳ New Scene" button in turn bar

**Sprint E — Full FP economy:**
- WS-27: Compel flow. GM "↩ Compel" button → prompt → broadcast → player banner (accept/refuse) → FP transfer
- WS-30: Player creates aspect. Input on PlayerSurface → sync `player_create_aspect` → sticky on GM canvas

**Sprint F — Content teaching:**
- WS-55: Quick Reference section (Ladder, outcomes, 4 actions, invoke)
- WS-56: Aspect coaching tip. WS-57: Stunt format hint
- WS-60: Compel examples (3 world-neutral). WS-61: Inspiration prompts (16 entries, 🎲 button)

**Board Export Panel:**
- `BoardExportPanel` component. Card checklist, 8-format grid, copy/download. Export tab in BoardLeftPanel

NA-291–303. 303/303 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.397 — Sprint A (Player comes alive) + Sprint B (Seven quick wins)

**Sprint A:**
- WS-20: Player dice rolling (`psDoRoll`, skill pills, `player_roll` sync action)
- WS-21: Enriched broadcast (`round`, `order`, `gmPool`, `rollHistory`)
- WS-22: Turn indicator ("Your turn!" / "You acted — X's turn" / "All acted")
- WS-23: Roll broadcast (GM toast + `addRoll` + re-broadcast)
- WS-25: GM pool visible to players (`syncGmPool` in turn bar)

**Sprint B:**
- WS-24: Session notes on board (SessionDoc floater + topbar 📝)
- WS-31: Help panel Conflicts expanded (zones, exchanges, concede, taken out)
- WS-34: Player surface full-width cards
- WS-35: Quick NPC button in BoardPlayPanel
- WS-40: Session start refresh (FCon p.19). WS-42: Keyboard R/F. WS-43: Zoom-to-fit

NA-278–290. 290/290 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.395 — Workshop QoL: card state + outcome hints + GM pool

- Card interactive state persists to IDB (`cv4Card` accepts `savedCardState`, `BoardCard` wires `onUpdate` for all card types)
- Dice outcome explanations (FCon p.21 one-liners for Fail/Tie/Succeed/SWS)
- GM Fate Point Pool (`gmPool` in `useBoardPlayState`, IDB-persisted, +/− in BoardPlayPanel, resets on endScene)

NA-270–277. 277/277 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.394 — Docs-only bump

ROADMAP, CHANGELOG, BOOTSTRAP, PROJECT_MEMORY all updated to v393 state.

---

## 2026.03.393 — Play sprint: 8 features across 4 sprints + 2 hotfixes

**Sprint 1 — Dice roller redesign + Scene End:**
- `TpDicePanel` rewritten with learn-fate visual language: 68px `dr-die` tiles, `flicker→reveal→done` phase machine with sequential pop animation, Fate Ladder hex colour palette via `tpLcolHex()`, vertical stacked layout (`tp-dice-v2`), expanded history (5 entries)
- Scene End button in `BoardTurnBar`: `endScene()` clears all `phy`/`men` stress arrays to `false`, resets `acted` flags, persists to IDB, broadcasts to connected players, confirm dialog before clearing

**Sprint 2 — Remove from table + Card flip:**
- `removeFromTable(sourceId)` in `useBoardBinder`: filters play canvas IDB by `sourceId`, updates `playCardIds` Set, broadcasts, toasts "○ Removed from table"
- Remove button on `BoardCard` table strip (✕) and `BoardDossier` footer ("○ Remove") — bidirectional table management
- `cv4Card` rebuilt as CSS 3D flip: `cv4-flip-container > cv4-flipper > cv4-front + cv4-back`. Front = stamp band + header + card content + "▸ GM Guidance" trigger. Back = stamp band + "GM GUIDANCE" header + guidance body (scrollable 400px) + "◀ Back" trigger. 0.5s `rotateY(180deg)` transition. Reduced-motion fallback: `display:none/flex` toggle, no 3D transforms. `.fd-card` class preserved on front face for CSS selector compatibility

**Sprint 3 — Free invoke counter + Character sheet:**
- Aspect stickies: 4 invoke pips below text (filled = available, click = consume, "+" = add). Stored as `card.freeInvokes`. Dashed border separator
- `PlayerSurface`: expandable "📋 My Character" accordion between topbar and scene cards. Shows HC, Trouble, extra aspects with labels, full skill pyramid grouped by rating (+4→+1) as pill badges, refresh value

**Sprint 4 — Boost card type + Opposition ladder:**
- Boost card: `genId:'boost'` in `BOARD_GEN_GROUPS` (⚡ icon), amber gradient rendering, editable text, "● Use Invoke" button that sets `expired:true` and greys card. Excluded from export/print filters. Listed in binder footer as "⚡ Boosts (N)"
- Opposition Fate Ladder dropdown: replaces number `<input>` with clickable ladder selector showing +8 Legendary → −2 Terrible with hex colours. `ladderOpen` state in `TpDicePanel`

**Hotfixes:**
- `LABEL_STYLES` crash (pre-existing from v391): constant was used by `BoardLabel` but never defined. Added 5-colour array (accent, green, red, purple, amber) with `{bg, border, text}` shape
- CSP `connect-src`: added `fonts.googleapis.com` and `fonts.gstatic.com` to allow SW `fetch()` for Google Fonts

**New QA assertions:** NA-251 through NA-269 (19 new).

269/269 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.387 — Custom Card + dead code removal + doc update

**Custom Card — fully inline-editable cv4 card:**
- New Canvas Tools entry: ✏️ Custom Card (*blank — fill in as you play*)
- Type pill cycles: Aspect → NPC → Location → Clue → Other — each tints the card accent colour (green, blue, gold, purple, grey)
- Title: click to edit inline, single-line input, confirms on Enter/blur
- Notes: click to open resizable textarea (400 char max), confirms on blur, cancel on Escape
- All edits persist via `updateCard → persistCanvas` (same IDB path as every other mutation)
- Send to Table, Binder, export all work normally. Reroll button hidden (nothing to reroll)
- CV4_HELP back panel with what/when/rule/invoke/compel examples
- Context menu (right-click canvas) entry added
- NA-240–242 regression guards

**Dead code removed:**
- `mdHeader()` and `mdWinLose()` in `engine.js` — both defined but never called; `toMarkdown` builds headers inline

**Docs updated:** BOOTSTRAP.md, PROJECT_MEMORY.md, ROADMAP.md all updated to v387, QA 242/242.

242/242 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.386 — UX Sprint 5: Session Zero local session bridge

**Session Zero → board bridge (UX-06):**
- `▶ Start Local Session — {WorldName}` button added to Session Zero summary screen, in an accent-bordered "Ready to play?" card
- Writes `ogma_sz_handoff` to sessionStorage (world, partySize, hook, timestamp, from)
- Navigates to `board.html?world={campId}`
- `board.html` default mode changed from `play` to `prep` — Session Zero arrivals land in Prep, not hosting screen
- `BoardApp` FP load effect reads handoff on first open: pre-populates 4 "Player N" slots at Refresh 3, fires toast, consumes handoff (one-read, then deleted)

All 12 UX sprint items shipped across v384–v386. NA-238–239.

239/239 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.385 — UX Sprints 2–4: remote play, generator discoverability, in-play rules access

**Sprint 2 — Remote play clarity:**
- UX-04: Player topbar shows persistent `🔗 Room XXXX` blue chip when connected. GM "▶ Live" chip gated to `syncRole === 'gm'`. NA-232.
- UX-10: FP tracker tab renamed "🏁 Initiative" → "🏁 Turn Order" with descriptive tooltip. PopcornTracker header updated, inline rule added: *"After you act, choose who goes next — ally or enemy. No fixed order."* NA-233.

**Sprint 3 — Generator discoverability:**
- UX-07: Every generator item in left panel now shows a one-line subtitle (`blp-sub`): e.g. "Compel — make an aspect cause trouble". NA-234.
- UX-13: Canvas Tools group (Aspect Sticky, Section Label, Custom Card) separated from content generators by top border + rename. `separator: true` flag → `blp-separator` CSS class. NA-235.

**Sprint 4 — In-play rules access:**
- UX-03: Major NPC cards show inline stress rule hint beneath stress tracks: *"Stress ≠ HP — clears end of scene. Physique/Will ≥3 → 6 boxes."* NA-236.
- UX-09: Mobile topbar — `521–700px` breakpoint caps `bt-world-select` to `max-width:90px`, preventing overflow. NA-237.

237/237 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.384 — UX Sprint 1: first-run orientation

- **UX-11:** "Quick Adventure Start" renamed to **"Adventure Seed"** across `BOARD_GEN_GROUPS`, `shared.js`, engine.js markdown heading, `ui-renderers.js`. NA-231.
- **UX-02:** PREP/PLAY button `title` attributes now full sentences explaining each mode's purpose.
- **UX-01:** Empty canvas coach mark — shown once on first visit (canvas loaded, empty, Prep mode). Non-blocking banner at bottom. Dismissed to `fate_prefs_v1.coach_canvas_dismissed`.
- **UX-05:** PLAY mode entry coach mark — shown once on first PLAY toggle. Explains two-canvas model: *"Prep cards are private. Use ● Send to Table on any Prep card to share it with players."*

231/231 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.383 — Content sweep complete: Neon Abyss + The Long Road

**Neon Abyss (7 fixes):**
- 4 trouble dupes: augments corp property ×2, loyalty-for-sale ×2, corp scanner ×2, addiction ×2
- 3 stunt dupes: Ghost Routine ≈ Ghost Protocol → "Clean Exit"; Targeting Uplink ≈ Target Designation → "Suppression Fire"; Street Cred ≈ Street Dealer → "Corpo Mole"

**The Long Road (9 fixes):**
- 4 trouble dupes: methods-can't-justify ×2, loyalty-living/guilt-dead ×2, kept-one-person-alive ×3 collapsed to ×1
- 5 stunt dupes: Jury-Rig = Jury Rig (literal dupe) → "Hotwire"; Wasteland Ghost ≈ Ghost of the Wastes → "Ambush Predator"; Makeshift Mechanic ≈ Scrap Engineering → "Herbalist"; Scrapper ≈ Scrap Engineering → "Trade Route Knowledge"; Sure Shot ≈ Dead Shot → "Warning Shot"

All 8 worlds now fully audited. 230/230 named · all suites clean.

---

## 2026.03.382 — Session Zero guides (all 8) + Victorian + Void Runners audits

**Session Zero deepening — 6 guides added (completes all 8):**
Fantasy, Cyberpunk, Space, Victorian, The Long After, The Long Road now all have "Building Your Character" section with Step 1–3, visual pyramid, world-flavoured examples, Physique/Will callout.

**Gaslight Chronicles (4 fixes):** Trouble dupe; Iron Will ≈ Iron Nerve → "Coroner's Detachment"; Occult Knowledge ≈ Occult Library → "Dead Languages"; Underworld Contacts ≈ Street Knowledge → "Press Connections".

**Void Runners (8 fixes):** 5 trouble dupes (alien contact ×3 collapsed, failing-ship dupe, addiction dupe); 3 stunt dupes (Ace Pilot → "Hard Burn"; Ship's Mechanic → "Salvage Expert"; Multilingual Liaison → "Crew Loyalty").

---

## 2026.03.381 — useBoardCards hook extraction

Extracted from BoardApp: `cards`, `loaded`, `cardsRef`, `lastRemovedRef`, `lastRerolledRef`, `lastPlacedRef`, `persistCanvas`, `generateCard`, `updateCard`, `deleteCard`, `rerollCard`, `undoLast`, `exportCanvas`, `importCanvas`, IDB canvas load `useEffect`. BoardApp drops from ~1,130 to 971 lines. `_bcOnChange` ref pattern wires hook → `useBoardBinder` without circular dependency. `selectGen` preserved inline (sets `activeGen` in BoardApp).

---

## 2026.03.380 — QA hardening: 14 new assertions, data bugs fixed

**14 new QA assertions (NA-217–230):**
- NA-217: All `?v=N` stamps in HTML match current build number (stale cache detection)
- NA-218: React CDN loaded before any core JS on every campaign page
- NA-219: Dexie CDN loaded before db.js on every campaign page
- NA-220: No core JS file loaded twice in any campaign page
- NA-221: `OGMA_CONFIG.VERSION` matches sw.js `CACHE_NAME` build
- NA-222: React aliases (`h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment`) defined in ui-primitives.js
- NA-223: No top-level `const`/`let` in ui.js, ui-board.js, ui-table.js, ui-modals.js, db.js
- NA-224: board.html exists and contains redirect or board UI
- NA-225: Each campaign page loads its own matching data file
- NA-226: `node --check` passes for all JS files in core/, data/, assets/js/
- NA-227: `ErrorBoundary` class present in ui-primitives.js
- NA-228: sw.js APP_SHELL references all 8 campaign pages
- NA-229: No `undefined` values in generated output across all worlds and generators
- NA-230: All custom hooks defined before their first call site

**Data bugs surfaced by NA-229:**
- `dVentiRealm.js` line 316: double-comma created sparse array hole at index 22 of `seed_locations` — `pick()` returned `undefined` ~3% of the time
- Additional double-commas found and removed from `dVentiRealm.js` (3 more) and `western.js` (2)
- `pick()` hardened with sparse-array fallback guard

230/230 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.379 — Crash prevention QA (NA-212–216)

**Five crash-prevention assertions added:**
- NA-212: No `document.write()` in any HTML file
- NA-213: `campMeta` defined before first property access in `BoardApp`
- NA-214: `useBoardBinder` called after `campMeta` is declared
- NA-215: CSP `_headers` allows `fonts.googleapis.com` and `fonts.gstatic.com`
- NA-216: `campMeta`, `tables`, `campCanvasKey` all used after their `var` declaration

**Regression verification:** Reintroducing the v378 ordering bug causes NA-213 and NA-214 to FAIL with the correct line numbers — confirmed the assertions catch their target.

211/211 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.378 — Three production error fixes

**Crash: `campMeta is undefined` (TypeError in BoardApp)**
- `useBoardBinder(campId, campMeta.name, ...)` was called at line 1919 during `useBoardBinder` hook extraction (v375)
- `var campMeta = getWorldMeta(campId)` was not derived until line 2015
- Fix: moved `campMeta` derivation to top of `BoardApp` before any hook calls

**Warning: `document.write()` unbalanced tree (36 HTML files)**
- Conditional base-href used `document.write("<base href=\"/\">")` — triggers speculative parsing warning and is blocked by some CSPs
- Fix: replaced across all 36 HTML files with `var _b=document.createElement("base"); _b.href="/"; document.head.appendChild(_b)`

**CSP: Google Fonts blocked on production**
- `_headers` had `style-src 'self' 'unsafe-inline'` with no external origins
- Fix: added `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src`

**Not fixable in repo:** Cloudflare beacon integrity hash mismatch is edge-injected.

211/211 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.377 — FCon content audit: 7 text violations fixed

**CT-01 · `help/generators.html`:** Major NPC described as "refresh of 2" — corrected to 3 (two stunts ≤ three free slots = no refresh penalty).

**CT-02/03/06 · `core/engine.js` + `core/ui-renderers.js`:** Three uses of "initiative roll / act in initiative" — FCon has no initiative roll or stat. Replaced with "each exchange" / "first action in the exchange" / "acting in the conflict".

**CT-04 · `help/faq.html`:** Mild consequence recovery skipped the treatment requirement. Rewrote with full treatment-first mechanic and correct difficulties for all three tiers (Fair +2 / Great +4 / Fantastic +6).

**CT-05 · `help/learn-fate.html`:** Stress description missing the critical "mark multiple boxes per hit" nuance — D&D converts assume one box per hit. Added explicit clarification and "clears at end of every scene".

**CT-07 · `help/at-the-table.html`:** Consequence shown as "−2 on next Athletics" mechanical modifier. Consequences are aspects that can be invoked/compelled — they have no automatic penalty. Reframed correctly.

211/211 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.376 — CHANGELOG catch-up + Shattered Kingdoms audit + Session Zero deepening

**CHANGELOG + ROADMAP:** Entries written for v372–v375 (previously undocumented). ROADMAP header updated to v375.

**Shattered Kingdoms content audit (11 fixes):**
- 4 trouble duplicates replaced: prophecy ×2 → unique compacts/debts; weapon ×2 → one kept, one replaced; kingdoms-burn ×2 → one kept, one replaced
- 2 stunt fixes: Shield Wall → Last Line (distinct from Shield Bash); Words of the First Age mixed-skill corrected (Lore +2 CA, not Lore +2 Provoke)
- 1 old wound pair reduced (kept the more specific entry)
- 1 succession current issue de-duped (kept "The Broken Throne", replaced "The Succession War Ignites" with "The Inquisition's Reach Extends")

**Session Zero deepening — Dust and Iron + dVentiRealm:**
- Both guides now have "Building Your Character" section: 3-step PL-03 summary (aspects → skill pyramid → stunt), world-flavoured HC/Trouble examples, visual pyramid with world-appropriate skill suggestions, Physique/Will stress callout, links to both Session Zero tool and board PL-03 join flow
- All `sessionzero.html` links updated to `character-creation.html`

208/208 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.375 — React Architect review: architecture, dead code, ARIA

**Crashes fixed:**
- `ReferenceError: setPrepView is not defined` — `openCanvas()` still called `setPrepView(false)` after that state was removed in UNI-06. Removed.
- `ReferenceError: playCardIds is not defined` in `BoardTopbar` — `playCardIds` is `BoardApp` state but was referenced directly inside `BoardTopbar`'s render. Added `onTableCount` prop, passed `playCardIds.size` from `BoardApp`, destructured in `BoardTopbar`.

**Architecture — `useBoardBinder` hook extracted:**
- 70+ lines of inline state, 3 IDB load effects, and 7 helper functions removed from `BoardApp` and moved into a `useBoardBinder(campId, campMetaName, playCanvasKey, showToast, getCanvasCards, persistCanvas)` hook
- `BoardApp` state count drops from 27 to 20
- Single hook call: `var binder = useBoardBinder(...)` — all state and helpers accessible via `binder.*`

**`BoardTopbar` props: 38 → 8:**
- Flat 38-prop call site grouped into `sync`, `panels`, `counts`, `exportActions` semantic objects
- `BoardTopbar` destructuring updated to match — intent is now readable at the call site

**Dead code purged:**
- `PrepCanvas` function (lines 516–1645, 1130 lines) removed from `ui-table.js` — still loaded but unreachable since UNI-06
- 4 dead variables removed from `ui.js`: `groupGens`, `hlMeta`, `totalEntries`, `typeLabel`
- 8 dead CSS classes removed: `.bd-card-body`, `.bd-tab`, `.bd-tab-label`, `.bd-content`, `.bd-right`, `.bd-rules-link`, `.bd-rules-link:hover`, stale PrepCanvas comment

**Hook quality:**
- `showToast` wrapped in `useCallback` — stable identity prevents unnecessary child re-renders
- `zoom` removed from keyboard shortcut `useEffect` dep array (not used by handler)
- `useBoardPlayState` — `hasLoaded` ref guard prevents IDB reload on every PREP↔PLAY toggle

**Accessibility:**
- `aria-label` added to: consequence inputs (Mild/Moderate/Severe), BoardLabel editor, room code input, participant name input
- `bd-backdrop` — added `role="presentation"`

**Bundle:** 509KB → 304KB (40% savings maintained; absolute size reduced by 55KB from cleanup)

208/208 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.374 — GM Screen model: cv4Cards inline, Send to Table, panel lock

**cv4Cards inline on canvas:**
- `BoardCard` compact chip (title/summary/tags) replaced with scaled `renderCard()` at 65% inside a 224px width shell
- Cards on the GM Screen canvas are now fully readable without tapping
- Default zoom changed to 0.75 — a populated canvas opens at a readable density
- `BoardDossier` redesigned as compact GM Guidance panel: rules reference, invoke/compel examples from `HELP_CONTENT` — no redundant card re-render

**"Put on table" / "On table" indicator:**
- `sendToTable(card)` copies a prep canvas card to `board_play_v1_{campId}` with a `sourceId` linking back
- `playCardIds` Set loaded from play canvas IDB on mount — tracks which prep cards are visible to players
- Each prep card shows `→ Table` pill; when sent shows `● On table` green indicator
- `● N on table` chip in topbar counts live table cards
- GM stays on PREP screen throughout — no mode switch required to reveal a card

**Left panel locked in PREP:**
- `useEffect` forces `leftOpen = true` on every PREP mode entry
- Panel toggle button only rendered in PLAY mode
- The GM Screen's reference material (Generate/Stunts/Help) is always accessible

208/208 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.373 — UNI sprint: unified GM surface, PrepCanvas retired

**UNI-01–06: BoardApp is now the single surface for prep and play.**

**UNI-02 — BoardBinderPanel in BoardApp:**
- Loads `card_{campId}_*` and `binder_tray_{campId}` from IDB on mount (same keys as CampaignApp)
- Filter strip (All / People / Scene / Story / Mechanics), card list with ☆ Tray toggle, Drafting Tray section
- Binder toggle button in topbar with count badge (`binderOpen` state)

**UNI-03 — Prominent PREP/PLAY badge:**
- Active pill filled: PREP = `--accent`, PLAY = green
- Topbar border stripe changes colour with mode

**UNI-04 — Generate panel in both modes:**
- `BoardLeftPanel` (Generate/Stunts/Help) always visible; no longer swaps to player panel in PLAY
- Player roster added below as collapsible accordion (UNI-05)

**UNI-06 — PrepCanvas retired:**
- `prepView` state removed from `CampaignApp`
- 50+ lines of table sync code removed (`tableSyncRef`, `hostTable`, `joinTable`, `disconnectTable`, etc.)
- Sidebar: "Table" + "Binder → Cards" consolidated to single **"Prep & Play"** entry
- Mobile bottom nav "Pinned" tab → "Prep" tab opening BoardApp

3 new QA assertions NA-206–208. 208/208 named · 59/59 unit · 89/89 export · 128/128 smoke. Bundle 572KB → 567KB (PrepCanvas removal accounted for by new features added same version).

---

## 2026.03.372 — Neon Abyss content audit + CHANGELOG catch-up

**Help pages — 6 stale references fixed:**
- `generators.html`: "GM Tips tab" → "For GM tab"; stale three-tab description updated to current two-tab names
- `getting-started.html`: "GM Tips tab / Rules tab" → current tab labels ("What this is · For GM", "⚔ D&D?")
- `customise.html`: stale three-tab description replaced with accurate two-tab description
- `hosting.html`: "opened run.html" → "opened a campaign page" (run.html was removed in v344)
- `export-share.html`: "Open History (📋 in the action bar)" → "Open the Binder (sidebar → Binder)"

**Docs:**
- ROADMAP shipped summary updated: v360–v370 all documented
- ROADMAP header version + QA counts updated (198/198 → 205/205)
- Stale duplicate PL-03 parking lot entry removed
- `PROJECT_MEMORY.md` version and QA counts updated

205/205 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.370 — PL-03 pre-join character builder + file:// offline fix + VIS-01

**PL-03: Pre-join character builder**
- Replaces single name-field waiting banner with a 3-step wizard: name → aspects → skills
- Step 1 (Name): existing behaviour preserved
- Step 2 (Aspects): High Concept, Trouble, and one free aspect — all optional, skippable
- Step 3 (Skills): full 19-skill FCon grid; tap to assign pyramid ratings (+4×1, +3×2, +2×2, +1×4); pip ladder shows slots remaining
- On submit: sends `{type:'player_hello', name, pc:{hc, trouble, aspects, skills}}`
- GM-side `addPlayer` reads `pc` payload and derives stress track length from Physique/Will per FCon p.12
- Player arrives pre-filled rather than as a blank slot

**file:// offline fix:**
- `<base href="/">` replaced with protocol-conditional in all 36 HTML files
- `if(location.protocol !== "file:"){document.write("<base href=\"/\">")}` fires only under HTTP/HTTPS
- Unzipping and double-clicking any page now resolves assets correctly

**VIS-01 — `.fp-btn` base rule restored:**
- `.fp-btn` base rule was missing (CSS orphan from earlier audit period)
- Restored: `border-radius:50%`, `width:24px`, `height:24px` — circular FP tracker buttons work again

2 new QA assertions NA-204–205. 205/205 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.369 — Binder rework: Drafting Tray, filter strip, GM Guidance animation (BDR-01/02/03)

**BDR-01: Drafting Tray**
- Staging layer between Binder and Play Table, pinned to the bottom of the Binder panel
- ☆ Tray / ★ In Tray toggle button on every Binder card
- "Send all to Table" button pushes all staged cards to the canvas in a 4-column grid layout and clears the tray
- Persists in IDB as `binder_tray_{campId}` — survives page reload
- Binder accordion meta badge updated to show `{cards} · 🗂 {tray}` when tray is populated
- `addToTray`, `removeFromTray`, `sendTrayToCanvas` functions in CampaignApp

**BDR-02: Binder filter strip**
- All · People · Scene · Story · Mechanics pill buttons above the card list
- Filters by genId group (People: npc_minor/npc_major/pc/backstory; Scene: scene/encounter/complication/seed; Story: campaign/faction/compel/consequence; Mechanics: challenge/contest/obstacle/countdown/constraint)
- Local state only — resets on panel close

**BDR-03: GM Guidance footer animation**
- Replaced hard conditional render (`gmOpen && h('div',...)`) with CSS `maxHeight` + `opacity` transition
- Slide-open: 0.32s `cubic-bezier(0.4,0,0.2,1)`; slide-close: 0.22s
- Chevron arrow rotates 90° on open with spring easing `cubic-bezier(0.34,1.56,0.64,1)`
- Panel content stays in DOM; `aria-hidden` toggles for screen readers

2 new QA assertions NA-202–203. 203/203 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.368 — Full CSS and JS audit

**CSS audit — orphaned selectors restored:**
- 6 campaign roll button style blocks (`thelongafter`, `cyberpunk`, `fantasy`, `space`, `victorian`, `postapoc`) had selectors stripped since v344; all styles were completely inert. Restored with correct `[data-campaign="X"] .btn-roll` selectors plus `::before`, `.rolling`, `:active` variants
- PWA banner variants (`.pwa-banner-update`, `.pwa-banner-action.active`, `.pwa-banner-warn`, `.pwa-banner-ios`) — selectors stripped, restored
- `.action-bar .btn-roll` and `.action-bar-inspire` — selectors stripped, restored
- `.fp-btn` base rule — missing entirely, restored (circular buttons)
- Malformed `.action-bar` closing (spurious `;overflow:visible`) — fixed
- Dead orphaned glass panel blocks, session zero hero blocks — removed

**CSS audit — font stragglers:**
- `.dr-die`, `.qf-footer kbd`, stunt browser classes (`bs-name`, `bs-type`, `bs-tag`, `bs-copy-hint`), board mobile list classes — all updated from `'Courier New'` to Futura stack
- dVenti Realm and Dust and Iron roll buttons retain `'Courier New'` intentionally (terminal/typewriter aesthetic)

**JS audit — 9 dead functions resolved:**
- `var MD_FOOTER = MD_FOOTER` self-assignment fixed — was always `undefined`, blank footers on all Markdown exports. Now: `'\n---\n*Generated by Ogma · fate-srd.com*'`
- `mdHeader`, `mdAspectList`, `mdWinLose` — dead helpers removed from engine.js (superseded when `toMarkdown` was inlined)
- `toggleGmMode` — wired to Settings accordion as **GM Tips: On/Off** toggle button
- `BoardDossierContent` + `BoardDossierStress` (157 lines) — removed; dead since cv4 card system replaced the dossier
- `addStunt` in TpPlayerRow — removed dead wrapper (inline prompt button does the same)
- `addGMNote` — wired to table toolbar as 📝 button
- `exportFull` — wired to table toolbar as 📋 MD button (Markdown export of players + cards)
- `handleExportCard` in ui-modals.js — removed dead wrapper

201/201 named · 59/59 unit · 89/89 export · 128/128 smoke.

---

## 2026.03.367 — Futura typeface site-wide

**Typography: Futura**
- Replaced Fraunces (display serif) and Martian Mono (monospace) with the Futura stack: `'Jost', 'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif`
- Jost is a free geometric sans-serif with near-identical metrics to Futura, served from Google Fonts
- Applied across all 38 HTML files, `theme.css` CSS vars (`--font-display`, `--font-ui`, `--font-mono`), `help-shared.css`, `ui-renderers.js` (`CV4_MONO`, `CV4_SANS`), `db.js` print/image-pack popups
- Zero Fraunces or Martian Mono references remaining
- dVenti Realm and Dust and Iron roll buttons retain thematic exceptions (terminal/typewriter)

**Version stamping:**
- `OGMA_CONFIG.VERSION` constant added to `core/config.js`; stamped by `bump-version.sh`
- Version number displayed in all campaign page footers alongside Style Guide link
- `about.html` version badge updated to use `OGMA_CONFIG.VERSION`

---

## 2026.03.359–366 — Export modal, Board, Session Zero, build pipeline, Binder cv4Cards

**v2026.03.359 — Export modal + Board + Session Zero deepening:**
- `ExportModal` replaces `ExportMenu`: full modal with card checklist (derived titles), 8-format grid (MD/Mermaid/Obsidian/Typst/TXT/JSON/IMG/Print), copy-vs-download picker, Import link in footer
- `board.html` confirmed as JS redirect to `{world}.html?canvas=1`; Play → Table wired to `canvasView`/`openCanvas()`; all 8 campaign pages load `ui-board.js`
- Session Zero: dVentiRealm data added, `pc_high_concepts` replaces `major_concepts`, `questions` step added to all three modes (standard/trio/flashback) with world-specific `pc_questions` and live-generated example PC
- Help docs updated: `fate-mechanics.html`, `at-the-table.html`, `generators.html`, `getting-started.html`
- 10 new QA assertions NA-188–197

**v2026.03.360–365 — Build pipeline + Binder cv4Cards:**
- `scripts/build.js` 3-tier terser pipeline (~40% savings); `docs/BUILD.md`; `package.json` devDeps
- `disconnectSync` ReferenceError on Table open fixed; `sendToCanvas` wired
- Binder card list replaced with full cv4Cards (54% scale) + action row (Restore, Send to Table, Export, Remove)
- New workshop voices added to BOOTSTRAP: Product Strategist, UX Researcher, Mechanical Auditor
- SW regression fixed: bundle removed from APP_SHELL
- NA-198–201 added

---

## 2026.03.344 — Field Dispatch design system site-wide

- **CI:** `npm ci` → `npm install` in Lint & Format job. `cache: 'npm'` removed from `setup-node` (requires lock file — we have none). QA job path was already correct (`tests/qa_named.js` not `devdocs/qa_named.js` — the latter was the old path still in the live repo on GitHub).
- **Print:** `DB.printCards` was defined in the wrong IIFE (localStorage preferences module, first IIFE) rather than in `window.DB` (Dexie module, second IIFE). `DB.printCards` was always `undefined` — every print attempt hit the "Print unavailable" guard. Moved into `window.DB`.

113/113 named · 59/59 unit · 128/128 smoke.











---

## 2026.03.344 — Field Dispatch design system site-wide

**Design system: Field Dispatch**
- Replaces the glass/blur aesthetic with a warm, physical, stamp-press character across the entire site
- **Typography:** Fraunces (display serif) for headings, body copy, world names, taglines, sidebar labels, wiki content; Martian Mono for UI chrome, code, badge labels, section headers, nav tabs, wordmark
- **Palette (dark):** Warm-dark `#0E0C09` with cream text `#F5F0E8`; accent warm amber `#C8944A`; stamp shadows instead of glass blur
- **Palette (light):** Cream paper `#EDE8DF` / `#F5F0E8` with dark ink `#1C1410`; saddle brown accent `#8B4513`
- **Radii:** 16px glass → 3px stamp (all panels, buttons, cards, modals)
- **Shadow:** `--fd-stamp-shadow: 3px 3px 0` offset physical shadow; hover lifts + rotates 0.25deg
- **Animations:** `fd-stamp-in` (card entry), `fd-box-stamp` (stress boxes), `fd-clock-tick` (countdown boxes)
- **Buttons:** Martian Mono, stamp shadow, spring hover (translateY -1px), active press (translate down+right)
- **Roll button:** Fraunces display, stamp press, spring release

**Card view replaces dossier view:**
- `♥ Card` toggle button removed from action bar
- `cardView` ternary replaced — `renderCard()` always used
- `cv4Card` rebuilt as **auto-height Field Dispatch card**: stamp band top, expandable GM Guidance footer (replaces flip)
- All 16 `cv4Front*` renderers intact with full data from v342
- cv4 helpers rewritten: CV4_MONO → Martian Mono, CV4_SANS → Fraunces italic

**Site-wide coverage:**
- All 38 HTML files: Google Fonts preconnect + stylesheet link injected
- `theme.css`: landing page, board, sidebar, modals, result panel all updated
- `assets/css/help-shared.css`: wiki headings, sidebar, links, callouts, body text all updated
- `help-shared.css`: `@import` Fraunces + Martian Mono

113/113 · 59/59

---
---

## 2026.03.341 — Two bug fixes + help hamburger complete

**Bug: doExport SyntaxError / "doExport is not defined"**
- Root cause: EXP-07 offline guard (v336) used `\\\\"err\\\\\"` in the blob script string — generates `\\"err\\"` inside a double-quoted JS string, where `\\"` means one backslash then `"` closes the string. Then `err` is a bare identifier → SyntaxError.
- Fix: changed to `\\\"err\\\"` (same pattern as existing catch clause) → generates `\\"err\\"` → valid escaped quote inside string.
- `doExport` was also unreachable because the SyntaxError halted script execution.

**Bug: Major NPC missing consequence slots (rules compliance)**
- `cv4FrontNpcMajor` showed PHY/MEN stress + refresh but no consequence slots at all.
- FCon p.35 + p.43: all full characters (including Major NPCs) have Mild (2 shifts), Moderate (4), Severe (6) consequence slots.
- Minor NPC "No consequences" is correct per FCon p.43.
- Fix: three consequence slot rows added to Major NPC card back panel — checkbox + severity label + shift value. Card back-panel height 144→180.

**Help hamburger: position:fixed fix complete (all 11 pages)**
- Previously fixed 9/11 pages. `dnd-transition.html` and `new-to-ogma.html` had a slightly different onclick pattern — both now updated.
- All 11 help pages: dropdown uses `position:fixed` + `getBoundingClientRect()` to escape the `position:sticky` stacking context that was trapping the dropdown on mobile.

**Sidebar Navigate tab (follow-up from v340)**
- `sb-header` (wordmark + world chip) and Navigate tab button were missing — two insertions from v340 did not apply. Fixed this session.
- Sidebar now has: header section → Generate tab | Navigate tab → panels.

113/113 · 59/59

---
---

## 2026.03.340 — Option B: Left-nav refactor (topbar → sidebar)

**Design change:** Persistent left sidebar replaces the top navigation bar on the campaign generator pages.

**Desktop (≥641px):**
- No topbar. Sidebar is always visible (220px, existing layout unchanged).
- New sidebar header section: OGMA wordmark + world chip (accent colour, current world name).
- New "Navigate" tab in the sidebar tab bar (alongside "Generate"):
  - All Worlds, Learn Fate, Help, Board links
  - Table Prep button with pinned card count
  - Theme toggle
  - Online/Offline status dot

**Mobile (≤640px):**
- 44px slim bar replaces the old topbar: hamburger + world name + current generator + theme toggle.
- Hamburger opens the sidebar as a full-height overlay (unchanged behaviour).
- `sb-slim-bar` hidden on desktop via `@media(min-width:641px){.sb-slim-bar{display:none!important}}`.

**Removed from topbar:**
- OGMA wordmark → sidebar header
- Breadcrumb → replaced by world chip + slim bar generator label
- Nav tabs (Worlds / Learn / Help) → Navigate panel in sidebar
- Table prep button → Navigate panel
- Board link → Navigate panel
- Theme toggle → Navigate panel + slim bar
- Offline chip → Navigate panel status row

**New CSS classes:** `.sb-slim-bar`, `.sb-hamburger`, `.sb-slim-world`, `.sb-slim-gen`, `.sb-header`, `.sb-wordmark`, `.sb-world-chip`, `.sb-status-row`, `.sb-status-dot`

113/113 · 59/59

---
---

## 2026.03.336–337 — Hotfix + order-of-operations audit

**v336 — Production ReferenceError hotfix:**
- `CampaignApp` called `useGeneratorSession(campId, camp, t, universalMerge, prefs, showToast)` at line ~1719 but all three arguments were declared *after* that call: `universalMerge` (const, line 1783), `prefs` (const, line 1756), `showToast` (from `useChromeHooks`, line 1793). `const` is not hoisted → `ReferenceError: can't access lexical declaration before initialization` on every campaign page load.
- Fix: hoisted `useChromeHooks`, `prefs`, and `universalMerge` to immediately before `useGeneratorSession`.

**v337 — Broad order-of-operations audit:**
- Systematic check: every `const` declaration across `CampaignApp`, `BoardApp`, `useGeneratorSession`, `useChromeHooks`, `ExportMenu`, `useBoardSync`, `useBoardPlayState`, `BoardTopbar`, `cv4Card`, and all landing/modal/table components.
- `BoardApp`: `useBoardSync(showToast)` called before `showToast` and `toastTimerRef` were defined. Safe at runtime (function hoisting) but fragile. Fixed: moved both before `useBoardSync`.
- `BoardApp`: `useEffect([syncObj])` referencing `syncObj` placed before `var syncObj = _sync.syncObj`. Fixed: moved effect after `_sync` destructure.
- All other components clean. `LandingApp` false positive: `info` at two different scopes, not a real issue.

113/113 · 59/59

---
---

## 2026.03.335 — TBL-01 player join UX + MOB-15 mobile list view + ROADMAP cleanup

**TBL-01: Player waiting state (Board Play mode)**
- Player who joins via room code now sees a "Connected to GM" banner with a name input field
- They type their name and press Join → sends `{type: "player_hello", name}` over the WebSocket
- After sending: banner changes to "Waiting for GM…" confirmation state
- GM side: `useEffect` on `syncObj` listens for `player_hello` messages → calls `addPlayer(name)` automatically and shows toast "👋 [Name] joined"
- `addPlayer()` now accepts an optional name arg — keyboard prompt fallback when GM adds manually
- WCAG-compliant: `aria-label` on name input, disabled state on Join button until name entered

**MOB-15: Board mobile list view**
- New `BoardMobileList` component — renders board cards as a scrollable colour-coded list
- Toggle button in Board topbar (≡/▦ icon, hidden on desktop ≥640px, shown on mobile)
- Tap any card to open its dossier modal; × button removes from canvas
- Groups: generator cards (coloured by category), sticky notes count, label count
- Empty state with prompt if no cards
- `.bcol-list-mode .board-canvas-wrap{display:none}` — canvas hidden in list mode
- CSS: `.bt-mob-view-toggle`, `.bml-list`, `.bml-card`, `.bml-card-title`, `.bml-remove`

**ROADMAP cleanup**
- Merged two duplicate Tier 1 sections
- Removed all stale open items that already shipped (BRD-02/03/05, TBL-02/03/04/05 — all v279–289)
- Single clean "Open — in progress" section with only genuinely unshipped work
- BL-11 explicitly marked skipped in Tier 3
- What Shipped table condensed to meaningful summaries

113/113 · 59/59 · 128/128

---
---

## 2026.03.334 — BL-05 Stunt browser, WS-12 guide, quick fixes

**BL-05: Stunt browser (Board left panel):**
- New `BoardStuntPanel` component — "Stunts" tab added to Board left panel (alongside Generate/Help)
- Shows world stunts + universal pool (56+ per world); filtered to current world via `campId` prop
- Three filters: text search, skill dropdown, tag dropdown; live count ("N of M stunts · X world")
- Click any card to copy name + desc to clipboard (Clipboard API + textarea fallback)
- Copied state: green border + "✓ Copied" for 1.5s, then resets
- WCAG-compliant: `role="button"`, `tabIndex=0`, `aria-label`, keyboard (Enter/Space), `:focus-visible`
- CSS: `.blp-stunts`, `.bs-*` — all sizes ≥ 10px (WCAG NA-68 compliant)

**WS-12: Stunt guide (help/fate-mechanics.html):**
- Expanded stunt section: weak vs strong stunt table, what makes a stunt specific, tag list
- "Stunt browser" feature callout — directs GMs to the Board Stunts tab
- 8-world stunt examples (one per world, world-voice accurate)

**EXP-07: Image Pack offline error:**
- `doExport()` now guards against `html2canvas`/`JSZip` being undefined (CDN not loaded)
- Shows user-visible error in the popup instead of silent crash

**A11Y-01: BoardCard role fix:**
- `role="article"` → `role="region"` on canvas card tiles (article requires heading descendant per ARIA spec)
- NA-90 assertion updated to expect `role="region"`

**QA-02: Contest tie wording:**
- `cv4FrontContest` back panel now shows: "Neither side marks a victory. GM introduces a new situation aspect (FCon p.33)."
- Matches NA-04 assertion and FCon SRD p.33

**Housekeeping:**
- `core/ui-run.js.bak` deleted
- Stale `ui-run.js` row removed from BOOTSTRAP.md key files table
- WS-11 parked to 2026.06.22 in ROADMAP

113/113 · 59/59 · 128/128

---
---

## 2026.03.332 — useGeneratorSession + useBoardSync + toMarkdown helpers

**useGeneratorSession extracted from CampaignApp (ui.js):**
- 17 useState + 7 useRef moved out: result, rolling, history, activeGen, partySize, consequenceSev, cardView, inspireMode/Results/Chosen, pinnedCards, pinBouncing, sessionPack, packRolling, resultAnim, showStreakBadge, confPcs, rollCountRef, isMountedRef, prefsRef, pinnedCardsRef, _lastSeed, seedResultDone, usedGensRef
- 8 functions moved out: doGenerate, doInspire, pickInspireResult, selectGen, pinResult, unpinCard, restoreCard, groupForGen
- 3 useEffects moved out: session IDB load, session IDB save (on result change), pinnedCards IDB load
- CampaignApp: 63→28 state/ref vars, 59→23 functions, 3112→~1500 lines
- Duplicate session load/save effects removed from CampaignApp body

**useBoardSync extracted from BoardApp (ui-board.js):**
- 5 state vars: syncObj, syncStatus, roomCode, showJoin, joinInput
- 2 functions: connectAsHost, disconnectSync
- BoardApp: 38→26 state/ref vars

**toMarkdown helpers applied (engine.js):**
- MD_FOOTER constant replaces 20 identical footer literals
- mdBoxes() replaces 5 inline boxes() calls
- mdSkills() applied to npc_minor + npc_major cases
- mdStunt() applied to npc_minor (single stunt) + npc_major (stunt map)
- Shared helpers defined once: MD_FOOTER, mdHeader, mdBoxes, mdSkills, mdStunt, mdAspectList, mdWinLose

**NA-20 assertion updated:** searches useGeneratorSession hook body + CampaignApp; internal-only setters removed from required list.

113/113 · 59/59

---
---

## 2026.03.331 — Codebase review continued: hooks + engine refactor

**useChromeHooks extracted from CampaignApp:**
- `toast`, `updateAvailable`, `showSafariWarn`, `showIosInstall`, `showPwaNudge`, `isOnline` all moved out of `CampaignApp`
- PWA install nudge effect, SW update listener, Safari/iOS detection effect, online/offline listeners — all in the hook
- `dismissPwaNudge()` and `installPwa()` defined once in hook; inline install logic in render replaced with `installPwa()`
- `CampaignApp` calls `useChromeHooks(campId)` and destructures 12 vars from one call — 6 `useState` + 3 `useEffect` + 2 functions removed from component body
- `setToast` + `setUpdateAvailable` exposed from hook to satisfy NA-20

**useBoardPlayState extracted from BoardApp:**
- `players`, `round`, `order`, `selPlayer`, `roundFlash` — 5 `useState` removed from BoardApp
- `newRound`, `prevRound`, `toggleActed`, `updPlayer`, `addPlayer`, `removePlayer`, `persistPlayState` — 7 functions removed from BoardApp body
- 2 duplicate IDB load effects removed (one inline in canvas load, one standalone)
- `BoardApp` calls `useBoardPlayState(campId, mode, loaded)` and destructures 14 vars

**toMarkdown refactored (engine.js):**
- 6 shared helpers extracted: `MD_FOOTER`, `mdHeader`, `mdBoxes`, `mdSkills`, `mdStunt`, `mdAspectList`, `mdWinLose`
- 20 duplicate footer literal strings → `MD_FOOTER` constant
- 5 `boxes()` calls → `mdBoxes()`
- Inline skill rendering in `npc_minor` + `npc_major` → `mdSkills()`
- 59/59 unit tests pass

113/113 · 59/59

---
---

## 2026.03.330 — Codebase review: architecture refactor

**Codebase review pass targeting 9/10 maintainability. 8 items addressed:**

- **ui-run.js stripped** — 1705 lines → 9-line tombstone. `run.html` is a JS redirect; `RunApp`/`RunCanvas`/`createSync` were never loaded post-v306. Dead code confirmed by grep.
- **ExportMenu hover** — removed `onMouseEnter`/`onMouseLeave` inline `style.background` mutations. `.export-menu-item` CSS class with `:hover` + `:focus-visible` — keyboard-navigable.
- **aria-label audit** — floater close, sidebar KB shortcuts, history panel close, vault export/delete, print button, dice roll/reset buttons all patched. Icon-only buttons now fully screen-reader accessible.
- **`setUsedGens` write-only state → `useRef`** — `useState({})` where the read value was never consumed caused silent re-renders on every roll. Now mutates `usedGensRef.current` directly.
- **`useState` hoisted** — 11 state declarations scattered mid-`CampaignApp` (after effects and functions) moved to the top state block: `toast`, `updateAvailable`, `showSafariWarn`, `showIosInstall`, `pinBouncing`, `activeGroup`, `showHistory`, `prepView`, `tableRoomCode`, `tableIsRemote`, `tablePresence`.
- **Sync prop drilling eliminated** — 9 props drilled `CampaignApp → PrepCanvas` collapsed into single `tableSyncCtx` object. `PrepCanvas` reads `var _sc = props.tableSyncCtx || {}`.
- **`cardView` shadowing fixed** — `SessionPackCard`'s `cardView` renamed `spCardView` — no more same-name state in parent (`CampaignApp`) and child scopes.
- **`createSync` consolidation** — `createTableSync` in `ui.js` documented as the sole sync factory. `createSync` in `ui-run.js` was a less-capable duplicate (no `broadcastLastState`, no cursor presence, no 300ms re-broadcast fix).
- **QA: NA-81–84 updated** — assertions now test `createTableSync` in `ui.js` instead of the removed `ui-run.js`.

113/113 · 59/59

---
---

## 2026.03.319–326 — v4 cards, WCAG audit, CI fix

**v4 card system (`ui-renderers.js`):**
- `renderCard()` now dispatches to `Cv4Card` — 600×380 landscape, category-colour header, world-adaptive colours, flip-on-footer-only
- Interactive elements added to cards: `cv4StressTrack` (NPC Minor PHY, NPC Major PHY+MEN), `cv4Clock` (Countdown), Contest victory tracker (+1/Reset), Consequence "Mark Treated" toggle
- All interactive elements: `role="checkbox"`, `tabIndex=0`, `aria-checked`, `aria-label`, keyboard (Space/Enter)
- `cardState` in `cv4Card` passes `ctx = {state, upd}` to front builders; state persists via `onUpdate` to IDB
- Footer strip is sole flip target (`role="button"`, hover highlight); card wrapper is `role="region"`
- Card body `overflow:auto` with thin scrollbar; `cv4pulse` keyframe for full countdown alert

**Table canvas (`ui-table.js`):**
- `TpCardBody` replaced with `renderCard()` on canvas tiles — full v4 cards render directly
- Local `renderCard` renamed `renderTpCard` to avoid shadowing global (v321 crash fix)
- Canvas layout: `COL_W=640`, `COL_H=400`, `COLS=2`, `PAD=24`

**Board (`ui-board.js`):**
- `BoardTurnBar` removed from `BoardTopbar` scope (v320 crash fix — `players` was not in scope)
- `data-campaign` `useEffect` sets world CSS vars on board page
- `campId` passed through `BoardDossier` → `renderCard`

**Dice roller redesign:**
- 68×68px dice, 16px `border-radius`, soft tinted fills (+green, 0 grey, −red)
- Title: `4DF — RAW ROLL` / `4DF — SKILL ROLL` in small-caps
- Minus uses U+2212 (−) not ASCII hyphen
- Result: 32px/900 total + 15px adj muted label
- Button: neutral pill, `Roll 4dF` → `Roll again`

**Print (`db.js`):** `printCards` moved from first IIFE (localStorage) into `window.DB` (second IIFE) — was never reachable as `DB.printCards`, always showed "Print unavailable"

**CI (`.github/workflows/ci.yml`):** `cache: 'npm'` removed, `npm ci` → `npm install` — no `package-lock.json` committed; `tests/qa_named.js` path was already correct locally

---
---

## 2026.03.322–325 — Dice roller redesign + card polish

- **Dice roller:** Full CSS rewrite to match design mockup. 68px square dice (was 40px). Soft tinted fills: `+` = green, `−` = red, `0` = neutral grey — all via `color-mix` against panel background for light/dark adaptability. `−` glyph is now U+2212 (proper minus sign). Title reads `4DF — RAW ROLL` / `4DF — SKILL ROLL`. Result: large `+N` beside adjective label. Button: pill shape, neutral grey, "Roll again". Flicker → sequential reveal animation retained.
- **Card interactions (WCAG SC 4.1.2):** Stress boxes, countdown clock, contest tracker, consequence toggle now all interactive with `role="checkbox"`, `tabIndex=0`, `aria-checked`, `aria-label`, keyboard handlers (Space/Enter). State persists to IDB via `onUpdate`/`updExtra`. `cv4pulse` keyframe for clock-full alert.
- **World colour theming on cards:** `cv4Card` reads `var(--accent)`, `var(--c-blue)`, `var(--c-red)` etc. — all defined per campaign in `assets/css/campaigns/theme-*.css`. Board page sets `data-campaign` on `<html>` via `useEffect`. Cards adapt per world in all four surfaces.

113/113 · 59/59 · 128/128.

---

## 2026.03.319–321 — Card system v4 + canvas integration + bugfixes

- **cv4 card format:** Full rewrite of `renderCard()` in `ui-renderers.js`. `Cv4Card` component: 600×380 landscape, 5 semantic category colours (`character`/`world`/`mechanics`/`tool`/`pressure`), GM guidance back panel with WHAT/WHEN/RULE for all 16 generators. Flip only on footer strip (click/keyboard). Body `overflow: auto` so content scrolls and interactions work.
- **All 16 front builders:** `cv4FrontNpcMinor`, `cv4FrontNpcMajor`, `cv4FrontFaction`, `cv4FrontScene`, `cv4FrontCampaign`, `cv4FrontEncounter`, `cv4FrontSeed`, `cv4FrontCompel`, `cv4FrontChallenge`, `cv4FrontContest`, `cv4FrontConsequence`, `cv4FrontComplication`, `cv4FrontBackstory`, `cv4FrontObstacle`, `cv4FrontCountdown`, `cv4FrontConstraint` — all with `cv4Body(left, right)` two-column layout.
- **Table canvas:** `TpCardBody` replaced with `renderCard()` on canvas. Local `renderCard` renamed `renderTpCard` (was shadowing global). Size toggle buttons removed. Canvas grid: `COL_W=640`, `COL_H=400`, `COLS=2`, `PAD=24`.
- **Board dossier:** `campId` prop wired through `BoardDossier` → `renderCard`. `data-campaign` set on `<html>` by `BoardApp` `useEffect`.
- **Bugfix:** `BoardTurnBar` was misplaced inside `BoardTopbar` render — `players` ReferenceError on board load. Removed from `BoardTopbar`; correct instance at line 1751 in `BoardApp` retained.
- **Bugfix:** Table canvas crash — local `function renderCard` shadowed global, causing `card.id` TypeError on undefined. Renamed to `renderTpCard`.

113/113 · 59/59 · 128/128.

---

## 2026.03.300–308 — Board/Run consolidation, CSP fix, help overhaul, doc pass

**v308** — BRD-01: Play mode strong visual distinction. Canvas gets 4% green tint, left panel header is green "▶ Play Mode", topbar shows animated pulsing `● Live / Play` badge. BRD-04/06/07, TBL-03 confirmed already fully shipped in earlier sprints.

**v307** — Crash fix: 17 state vars used in `BoardApp` render were never declared (`showDice`, `showFP`, `syncStatus`, `syncObj`, `roomCode`, `boardPlayers`, `fpState`, `joinInput`, `showJoin`, + setters). All now `useState` in BoardApp. `connectAsHost` now generates a room code via `generateBoardRoomCode()` when `roomCode` is empty. FP IDB load effect added on mount. `ui-board.js?v=286` stale version stamp fixed in `board.html`; `bump-version.sh` updated to stamp `ui-board.js` going forward.

**v306** — Board/Run consolidation complete. `run.html` is now a JS redirect to `board.html?mode=play` (preserving `?world=` and `?room=` params). Board Play mode gains: `BoardPlayerRow` (FP, stress, consequences), `BoardPlayPanel` (left panel roster), `BoardTurnBar` (round counter + turn order strip above canvas), player/round/order IDB persistence via `board_play_session_[campId]`. `?mode=play` auto-activates Play mode. All live `run.html` links updated. 13 QA assertions migrated from `run.html` to `board.html`/`ui-board.js`. `ROADMAP.md` and `ARCHITECTURE.md` updated.

**v305** — Help sidebar: scrollbar hidden (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`). Generic `IntersectionObserver` added to `help-shared.js` — highlights `.wiki-sidebar-child` links as user scrolls on any help page (fate-mechanics, at-the-table, etc.). Skips `learn-fate.html` which has its own inline observer.

**v304** — CSP fix: CF Pages auto-injects beacon with `sha512-z4Ph...` hash appended to our `Content-Security-Policy`. Per spec, any hash-source in `script-src` silently disables `'unsafe-inline'`. All inline scripts (theme restore, skeleton hide, `ReactDOM.createRoot`, SW registration) were blocked → blank page. Fix: removed the sha512 hash from `_headers`. `unsafe-inline` works again.

**v303** — Bugfix: 50 fragment-only hrefs in help sidebar broken by `<base href="/">`. All `href="#anchor"` links resolved to `/#anchor` instead of `/help/[page].html#anchor`. Fixed to fully absolute across 9 help pages. Skip-to-content links (`href="#main-content"`) intentionally left as-is.

**v302** — Help/onboarding overhaul (WS-15–24): 3-path audience selector on help index. `learn-fate.html` gains "permission to play imperfectly" callout (Step 1). `fate-mechanics.html` gets Create Advantage deep-dive (worked warehouse fight example), fate point economy GM guide (full earn/spend cycle, compel frequency), "what the GM prepares" section, 6 common error fixes, Further Reading (Book of Hanz, Up to Four Players comic, SRD links). `at-the-table.html` gets session structure rhythm and full 3-exchange annotated conflict walkthrough. `faq.html` rebuilt with 10 community questions (stress ≠ HP, when to invoke, why Create Advantage, FP economy, what GMs prepare, D&D-style Fate, zones, challenge/contest/conflict, why experienced gamers struggle). Contextual D&D callouts added to fate-mechanics.html.

**v300–301** — Docs audit: `ARCHITECTURE.md` full rewrite (three surfaces, correct script load orders for Board/Run/Generator pages, `_redirects` removal, Board IDB keys, LS schema, icon system table, safe area insets, export/import DB API). `BOOTSTRAP.md`, `CONVENTIONS.md`, `README.md`, `testing.md`, `code-quality.md`, `CONTRIBUTING.md` all updated to current state. `CHANGELOG.md` extended with v286–299 entries.

---

## 2026.03.293–299 — Mobile sprint, code review merge, icon system, crash fix

**v299** — Critical bugfix: `showDice is not defined` crash on board page. Root cause: `var leftOpen = leftOpen` (self-referential assignment) in `BoardTopbar` props destructuring — JavaScript hoists the `var` declaration so right-hand side was `undefined`, throwing `ReferenceError` before any component rendered. Fixed to `var leftOpen = props.leftOpen`. CF beacon SRI warning documented as CF-side issue.

**v298** — Icon system: `FaFileArrowDownIcon` and `FaFileArrowUpIcon` added to `ui-primitives.js`. All export buttons now use file-arrow-down, all import buttons use file-arrow-up. Whole-table export/import added to PrepCanvas toolbar (exports players + cards + round + FP + extras + pan/zoom as JSON; imports handles `type:canvas`, `type:cards`, `type:card`). Save-to-prep button confirmed as cart-plus.

**v297** — Landing page reorder: "New here?" and "Join a Table" sections moved above "Choose your world" — onboarding paths now appear before the world grid.

**v296** — MOB-06: board mobile backdrop scoped to canvas strip only (`left: min(80vw, 260px)`) — panel area no longer blocked. Canvas `onMouseDown` closes panel on mobile. QA-01: NA-29 search window widened 300→500 chars with explanatory comment.

**v295** — Tier 1: MOB-05 run.html safe area (topbar left/right insets, dice floater bottom, mobile sidebar bottom). EXP-04 board canvas export button in topbar (`DB.exportCanvasState()` wired to ⬇ button). BL-01 confirmed already fully shipped.

**v294** — Code review merge (external v292 review): EH-1 `console.warn` on all DB writes, EH-2/3 SW promise chain fixes + activate catch, EH-4 IDB retry budget (2 failures before permanent disable, not 1), EH-5 migration path `console.warn`. PB-1 timer cleanup returns on 4 timers — `rollTimerRef` declaration missing in `DicePanel` was a real `ReferenceError` in dev mode (fixed). PB-2 `getAppShell()` lazy cache. NA-29 regression fixed (session-save warn strings shortened to fit 500-char assertion window). TBL-02 re-applied after merge.

**v293** — Mobile sprint: MOB-01 `viewport-fit=cover` added to all 36 HTML files. MOB-04 `env(safe-area-inset-bottom)` on roll FAB and all floaters. MOB-03 board topbar responsive at 520px (`bt-nav-text` spans hide at mobile, Worlds/Help hide at 400px). MOB-02 board left panel collapsible — `leftOpen` state, `blp-wrap`/`blp-hidden` CSS, `blp-backdrop` dismiss, `bt-panel-toggle` button (visible on mobile only, hidden on desktop).

---

## 2026.03.289–292 — Tier 1 sprint + XSS fix

**v292** — Security: `assets/js/dice-roller.js` XSS fix (CWE-79/116 via CodeQL). Complete rewrite from `innerHTML` string interpolation to DOM construction. `el()` helper added — zero `innerHTML` calls remain. `data-label` attribute was the vulnerable injection point.

**v291** — Bugfix: `exportCards` and `importCards` were referenced in action bar but never defined (`ReferenceError` on click). Both functions now defined in `CampaignApp`. `exportCanvasState` `.catch()` added. 300ms sync rebroadcast timeout documented.

**v290** — `_redirects` deleted. CF Pages Pretty URLs handles `.html` stripping. References cleaned from BOOTSTRAP, ROADMAP, sw.js, index.html. CHANGELOG preserved as history.

**v289** — Tier 1 complete: TBL-02 dice drawer → floater on narrow/touch screens (`useDiceFloater()` + `openDice()` helper + `rs-dice-floater` CSS). TBL-05 empty canvas state now has "➕ Generate a card" direct CTA button. EXP-02 JSON export/import for pinned cards (action bar ⬇/⬆ buttons, `DB.exportCards()`). EXP-03 copy-link button promoted to action bar with ✅ feedback.

---

## 2026.03.286–288 — Multiplayer sync fix, Board Sprint 2, roll button

**v288** — MP-07 sync fix: player state now applies on join via `remoteStateCbRef` pattern (mirrors `tableCursorCbRef`). `createTableSync` caches `_lastState` and rebroadcasts on `presence` message. `gmOnly` card extras stripped from broadcast — card positions/notes no longer leak to players.

**v287** — Board Sprint 2: BRD-02 dice floater (`TpDicePanel`, FP-spend bridge, sync broadcast), BRD-03 FP tracker floater (`FatePointTracker`, IDB persist per world via `board_fp_v1_[campId]`), BRD-05 board multiplayer (Host button in Play mode, room code display, Join modal, `createTableSync` wired). `ui-table.js` + `ui.js` added to board.html and SW APP_SHELL.

**v286** — Roll button vertical stack: `action-bar` → `flex-direction:column`. Roll 56→44px. Inspire full-width with descriptive label ("Inspire — roll 3 options to pick from"). Contextual pill rows (severity/party size) with `action-bar-ctx-label`. Secondaries full-width row.

---

## 2026.03.266 — Board Sprint 1: spatial GM workspace

New files: `campaigns/board.html` + `core/ui-board.js` (1156 lines). Zero overlap with `ui.js` — parallel, not a replacement. Safe to kill by deleting 2 files and removing 6 lines across 3 existing files.

**Sprint 1 ships:** 16 generators in left panel (matching screenshot groups), click-to-place cards on canvas, drag, delete/reroll/pin per card, dossier modal (uses `renderResult()` from `ui-renderers.js`), interactive stress boxes, Help accordion panel (6 sections), right-click context menu, zoom controls, IDB canvas persistence per world per mode, Prep/Play mode toggle, keyboard shortcuts (Space/G/Ctrl+Z/Esc), sticky notes, theme toggle, online/offline indicator, empty state, toast. "Board" link added to existing campaign page topbar.

## 2026.03.254 — BUG: landing page worlds grid + about.html redirect + config.js path

**Root cause:** `index.html` was loading `shared-lite.js` which declares `CAMPAIGNS = {}` but never populates it. `LandingApp` rendered `Object.values(CAMPAIGNS)` — always empty array — so the world grid showed nothing.

**Fixes:**
- `core/ui-landing.js`: `CAMPAIGN_INFO` now has `name` and `icon` fields alongside existing `genre/vibes/hook`. `LandingApp` builds the world grid from `CAMPAIGN_INFO` directly — always available on the landing page without needing world data files loaded.
- `core/ui-landing.js`: `camps` array now built from `Object.keys(CAMPAIGN_INFO)` with synthetic `{meta: {id, name, icon}}` shape — compatible with existing grid render code.
- `index.html`: SW registration changed from `'sw.js'` (relative) to `'/sw.js'` (absolute) — same root cause as campaign pages fixed in v252.
- `index.html`: `../core/config.js` path corrected to `core/config.js` — the `..` was navigating above the repo root.
- `index.html`: SPA router dynamic loader restored for campaign routes — world data still injected on demand.

---

## 2026.03.261 — BUG: SW APP_SHELL fetch failures

- `sw.js`: All APP_SHELL paths changed from `'./filename'` (relative) to `'/filename'` (absolute). The SW is registered at scope `/`, so relative `./` paths were resolving incorrectly on CF Pages — every HTML and asset file failed to cache on install, making the PWA non-functional offline and causing the SW install to partially fail. Every path now uses a leading `/`.

---

## 2026.03.260 — External code review: 11 issues fixed

Full external review by Claude Opus 4.6. All issues confirmed and resolved.

**Critical — broken functionality (4 fixes):**
- `campaigns/sessionzero.html`: topbar "▶ Run" and "🎭 Character Creation" links fixed from bare `run.html`/`character-creation.html` to `/campaigns/run.html`/`/campaigns/character-creation.html`
- `core/ui-run.js`: empty canvas "Open Prep Wizard" CTA fixed from `sessionzero.html` to `/campaigns/sessionzero.html`
- All `help/*.html` (13 pages): 47 bare relative anchor links fixed to absolute `/help/[page].html#anchor` paths — sidebar child links, body content cross-references, prev/next nav

**Medium — degraded offline experience (1 fix):**
- `sw.js`: `CLEAN_URL_MAP` added to offline navigate fallback — maps top-level world slugs (`/thelongafter` etc.) to their cached `/campaigns/[world].html` files. Cold-offline users can now reach world pages via clean URLs.

**Polish (6 fixes):**
- `campaigns/*.html` (8 pages): duplicate `config.js` script load removed
- `campaigns/run.html`: `partysocket.js?v=203` corrected to `?v=257`
- `manifest.json`: dVentiRealm shortcut added; Dust and Iron `short_name: "Western"` corrected to `"Ogma"`
- `core/ui-run.js`: `OGMA_DEFAULT_SYNC_HOST` now reads from `OGMA_CONFIG.DEFAULT_SYNC_HOST` if available — eliminates drift between `config.js` and `ui-run.js`
- `index.html`: duplicate noscript "▶ Run" link removed

---

## 2026.03.259 — CI workflow fix

- `.github/workflows/ci.yml`: Assertion count comment corrected `103/103` → `101/101`. Removed the GitHub Pages deploy job — deployment is handled by Cloudflare Pages automatically on push to main.
- `.github/workflows/deploy.yml`: Replaced GitHub Pages deploy workflow with a placeholder noting CF Pages handles deployment. The old workflow was firing on every push to main and either failing or deploying to the wrong place.

---

## 2026.03.258 — Routing final pass: base href + absolute links everywhere

**Root cause of all redirect bugs:** Pages without `<base href="/">` were resolving relative assets and links from wherever CF Pages served them (e.g. `/campaigns/sessionzero` instead of `/campaigns/sessionzero.html`), causing paths to resolve incorrectly.

**`<base href="/">` added to 28 pages** — all pages now have it:
- `about.html`, `learn.html`, `license.html`, `index.html`
- All `help/*.html` (13 pages)
- `campaigns/sessionzero.html`, `campaigns/character-creation.html`, `campaigns/transition.html`
- All `campaigns/guide-*.html` (8 pages)

**Guide pages — bare sibling links fixed:** `href="thelongafter.html"` → `href="/campaigns/thelongafter.html"`, `href="sessionzero.html"` → `href="/campaigns/sessionzero.html"` across all 8 guide pages. With `<base href="/">` bare relative links resolve from `/` not from the file's directory.

**Help pages — sidebar/nav links fixed:** All internal help page cross-links updated from `href="learn-fate.html"` to `href="/help/learn-fate.html"` etc. across all 13 help pages.

**SW navigate handler** (v257): Already fixed — network-first, never falls back to `index.html`. Falls back to cached `.html` equivalent offline.

**`_redirects`** (v257): Top-level world slugs added — `/thelongafter` → `/campaigns/thelongafter.html` etc.

---

## 2026.03.257 — Routing overhaul: SPA router killed

**Problem:** Two routing systems were fighting each other — CF Pages `_redirects` (correct) vs a History API SPA router in `index.html` (legacy, redundant, source of all routing pain). The SPA router was built for GitHub Pages which can't do URL rewrites. On CF Pages it caused wrong SW scope, stale asset version stamps, and unpredictable navigation.

**Fix — `index.html`:** SPA router removed entirely. `index.html` is now a pure landing page. Mounts `LandingApp` directly. No `loadScript`, no `pushState`, no `popstate`, no `__ogmaRoute`. Every navigation is a real full-page load handled by CF Pages.

**Fix — `_redirects`:** Top-level world slug routes added (`/thelongafter`, `/cyberpunk`, `/fantasy`, `/space`, `/victorian`, `/postapoc`, `/western`, `/dVentiRealm`) — all map to their `/campaigns/[world].html` files. `CAMPAIGN_PAGES` in `ui-landing.js` already used these slugs; they just weren't wired in `_redirects` until now.

**Fix — `campaigns/sessionzero.html`:** `campUrl` changed from `'campaigns/' + campId + '.html'` (relative, broke on CF clean URLs) to `'/' + campId` (absolute clean URL). `'../'` prefix removed from the Open Generator link.

**Fix — `core/ui-landing.js`:** `JoinTableCard` navigation changed from `'campaigns/run.html?room='` (relative) to `'/campaigns/run.html?room='` (absolute).

**Also in v254–256:**
- Landing page worlds grid fixed — `CAMPAIGN_INFO` now has `name` and `icon` fields; `LandingApp` renders from it instead of empty `CAMPAIGNS`
- `about.html` SW registration fixed: `'sw.js'` → `'/sw.js'`  
- `config.js` path fixed: `'../core/config.js'` → `'core/config.js'`
- Title tag: `index.html` now shows version number, stamped by `bump-version.sh`

---

## 2026.03.253 — MP-23: Session Log + _redirects + housekeeping

**MP-23 — Session Log (ogma-sync + ui-run.js):**
- `ogma-sync/src/worker.js`: DO SQLite session log. `CREATE TABLE session_log (id, ts, event, actor, detail)`. Logs: connect, disconnect, GM roll, player roll, player action, card add, card remove, new round. `GET /log/:roomCode` returns full log as JSON. `DELETE /log/:roomCode` clears it. `log_event` message type handled (not relayed to players).
- `core/ui-run.js`: `SessionLogPanel` component — timestamped event list, Refresh/Export MD/Clear/Close actions. Floats as right-side panel over canvas.
- `core/ui-run.js`: "📋 Log" button in topbar — GM only, visible when `sync` connected, toggles panel and fetches log on open.
- `core/ui-run.js`: `fetchLog`, `clearLog`, `exportLog` functions. Log URL constructed from `SYNC_HOST`.
- `core/ui-run.js`: `broadcastLog(event, actor, detail)` added to `createSync`. Called from `addCard`, `removeCard`, `newRound`.

**`_redirects` (Cloudflare Pages clean URLs):**
- Created `_redirects` in repo root — maps all 36 HTML pages to clean URLs with `200` (serve-at-path, no browser redirect).
- Engineering rule added to ROADMAP and BOOTSTRAP.md: `_redirects` must NOT be in SW APP_SHELL.

**Housekeeping:**
- REACT-STUBS closed — real UMD builds committed.
- SW registration path fixed (v252): `../sw.js` → `/sw.js` on all 9 campaign pages.

---

## 2026.03.252 — BUG: Service Worker registration path

- All 9 campaign HTML pages: SW registration changed from `'../sw.js'` (relative) to `'/sw.js'` (absolute).
- On Cloudflare Pages with Pretty URLs, `/campaigns/space` (no trailing slash) caused the relative path to resolve as `/campaigns/sw.js` — which doesn't exist. All assets then failed to load via SW intercept with "encountered an unexpected error". Manifested as a blank page on any shared/linked URL.

---

## 2026.03.251 — BUG: partySize crash on Table canvas

- `core/ui-table.js`: `PrepCanvas` now destructures `partySize` from props with a fallback of 4. Was referencing an undefined variable, crashing the entire Table canvas with `ReferenceError: partySize is not defined`.
- `core/ui.js`: `partySize` state now passed to `PrepCanvas` at the call site.

---

## 2026.03.250 — WORKER-DEPLOY: security fix live

- `ogma-sync/src/worker.js`: Role self-assignment bug fixed — `||` → `&&` in GM role guard. Any client passing `?role=gm` could previously claim GM even if one was already connected. Now only the first `?role=gm` connection gets GM; all subsequent claims downgraded to player.
- `ogma-sync/src/server.js`: Same fix applied to the PartyKit server.
- Deployed to Cloudflare via GitHub Action.
- MP-23 (session log) is now unblocked.
- SRI-DEXIE: hash verified correct — `sha384-3VWLzUTczDc/wazaoH+b5qG4iME0duPONRO281rRiaFkfpV/b3w5uxrvod7rCHcW` confirmed against live CDN. `cdn-dependencies.json` notes updated.

---

## 2026.03.249 — SRI-DEXIE verified

**Domains scanned:** Memory leaks · DB/persistence · Monolith · Security · Accessibility · CSS · Content · Performance · OSS readiness.

**Domain 1 — Memory Leaks:** Clean. All event listeners have cleanup returns, setIntervals cleared, debounce timer cancelled on unmount, all `createObjectURL` have matching `revokeObjectURL`.

**Domain 2 — DB/Persistence: 1 fix**
- `core/ui-run.js`: Theme-restore IIFE at mount now wraps `localStorage.getItem` in try/catch — Safari private browsing throws on localStorage access.

**Domain 3 — Monolith:** Clean. No duplicated engine logic across files.

**Domain 4 — Security:** Clean. gmOnly filter on both broadcast paths, role guard on all privileged actions. WORKER-DEPLOY still pending owner action.

**Domain 5 — Accessibility: 1 fix**
- `core/ui-run.js`: Mental stress boxes on NPC cards (`cc-sbox`) were missing `role="checkbox"`, `aria-checked`, `tabIndex`, and `onKeyDown`. Physical boxes were already correct. Fixed to match.

**Domain 6 — CSS: 2 fixes**
- `assets/css/theme.css`: Superseded `.full-session-badge` pill definition (line 120) removed — the current circle definition at L690 is correct, the old pill definition was a leftover from a prior design pass.
- `assets/css/theme.css`: Intentional cascade comment added to `.land-topnav-brand{display:none}` — this is a responsive hide that is overridden by the full definition below it, not a bug.

**Domain 7 — Content:** Clean. Zero duplicate entries across all 8 worlds.

**Domain 8 — Performance:** Documented only. `ui.js` 137KB, `theme.css` 163KB — within acceptable range for no-build. PERF-02/03 in backlog.

**Domain 9 — OSS Readiness:** Clean. LICENSE, SECURITY.md, CoC, ARCHITECTURE.md, CONTRIBUTING.md, issue templates, PR template all present. All CDN scripts have SRI hashes.

---

## 2026.03.247 — Sprint 4: Content Quality

**Dust and Iron (`data/western.js`) — table expansion:**
- `seed_complications`: 7 → 25 entries. Was the thinnest seed table by far; GMs would see repeats in consecutive sessions.
- `challenge_types`: 3 → 8 entries. All new entries hold the frontier-justice register (Blood Meridian / Deadwood / True Grit touchstones): River Crossing, Evidence Before Dawn, Fever Town, Mine Collapse, The Long Drive.
- `consequence_moderate`: 6 → 12 entries
- `consequence_severe`: 4 → 8 entries
- `complication_arrivals`: 5 → 10 entries
- `backstory_hooks`: 6 → 12 entries
- `zones`: 6 → 12 entries — Livery Stable, Undertaker's, Dry Goods Store, Riverbank, Church, Land Office added

**dVenti Realm (`data/dVentiRealm.js`) — table expansion:**
- `compel_consequences`: 13 → 25 entries. All new entries SRD-grounded: goblin union clauses, golem directives, bandit captain contract transfer, thieves' guild licensing, vampire invitations, warlock patron right of first refusal, cleric deity objections, Senate warding runes. No non-SRD IP.

**Documentation:**
- `docs/campaign-inspirations.csv`: dVentiRealm row added — columns repurposed as SRD section references (Creature Types · Environments · Factions · Key Monsters · Class Archetypes · Magic Schools)
- `docs/claude/WORLD-VOICES.md`: dVentiRealm entry now carries explicit SRD-only hard constraint with open5e.com as check source

---

## 2026.03.246 — Sprint 2: First Impressions

**Landing page (`core/ui-landing.js`):**
- Topbar: "🎲 Prep Wizard" link added — visible on every page load
- Hero: dual CTA added — "Start with the Prep Wizard" (primary) + "Pick a world →" (secondary anchor link)
- "Prep a Session" onboarding card now links directly to `campaigns/sessionzero.html` instead of the help docs; copy updated to explain the Table handoff

**`assets/css/theme.css`:**
- `.land-hero-ctas`, `.land-cta-primary`, `.land-cta-secondary` added for hero dual-CTA layout

**Table canvas empty state (`core/ui-run.js`):**
- Title changed from "Open canvas" to "Canvas is empty"
- Description simplified; "🎲 Open Prep Wizard" CTA link added
- `.rs-empty-cta` style added to `campaigns/run.html`

**Mobile responsive pass (`campaigns/run.html`):**
- Player sidebar now slides in/out on screens ≤640px via `.rs-left.open` toggle
- "▶ Players" / "◀ Players" toggle button added to topbar (hidden on desktop)
- Session name hidden on mobile to reduce topbar clutter
- `.rs-sidebar-toggle` CSS added; full `@media(max-width:640px)` block added

**`ROADMAP.md`:**
- PL-03 added to parking lot: pre-join character builder — player builds character before joining a table via room code; character loads into Table on join

---

## 2026.03.245 — Sprint 1: Prep Wizard audit + Take to the Table

**Prep Wizard (`campaigns/sessionzero.html`) — bugs fixed:**
- `s.rating` → `s.r` — major NPC skill ratings were rendering as `+undefined` in Step 5
- Duplicate `config.js` script tag removed (was loading twice)
- Duplicate `.pw-print-btn` + `@media print` CSS blocks removed
- Missing OG, Twitter Card, and `<link rel="canonical">` meta added

**Prep Wizard — content fixes:**
- GM note on Step 5 now reads "Refresh: N" — previously said "Starts with N fate points" which conflates refresh with starting FP (Fate Condensed p.22)
- Step 3 GM note rewritten as Fate-first advice: situation not plot
- Step 5 NPC intro copy loosened — no longer assumes the opening NPC is an antagonist

**Prep Wizard — "Take this to the Table" CTA:**
- Done screen primary action is now "🎲 Take this to the Table" → `run.html`
- `run.html` detects `prep_wizard_v1` IDB slot on load and shows import banner — cards populate automatically
- Done screen description updated to explain the handoff
- Open Generator and Print demoted to secondary actions

---

## 2026.03.244 — Sprint 1: Prep Wizard world + step counter fixes

- `campaigns/sessionzero.html`: dVentiRealm added to `WORLD_META` — was silently excluded from the Prep Wizard world selector despite its data file being loaded
- `campaigns/sessionzero.html`: Step counter copy corrected — Steps 1–5 read "of 5" despite there being 6 steps

---

## 2026.03.243 — Sprint 1: OG/canonical URL migration + bump script fix

**OG/canonical URL sweep (25 HTML files):**
- All `og:url`, `og:image`, `twitter:image`, `<link rel="canonical">`, and JSON-LD schema `url` fields migrated from `https://brs165.github.io/ogma-fate` to `https://ogma.net`
- `campaigns/dVentiRealm.html`: `og:url` was hardcoded to `thelongafter.html` — corrected to `dVentiRealm.html`

**`scripts/bump-version.sh`:**
- Removed the github.io OG URL rewriter section — would silently re-break all OG URLs if run with arguments after the domain migration

---

## 2026.03.149 — Sprint I: Schema consistency + Component review fixes

**Data schema consistency (Sprint I):**
- `dVentiRealm.js`: `major_trouble` key renamed to `troubles` — this was a live bug causing NPC generation to produce no Trouble aspect for all dVenti characters
- `dVentiRealm.js`: 9 missing table groups added: `consequence_mild/moderate/severe`, `consequence_contexts`, `compel_consequences`, `challenge_types`, `faction_name_prefix/suffix`, `other_aspects`, `complication_arrivals`
- `engine.js`: Added `t.major_trouble` fallback in trouble pick for safety
- `docs/data-schema.md`: Rewritten with complete required-table list, minimum depth thresholds, opposition/issues object schemas, FCon constraints

**Component review fixes:**
- `ui-modals.js`: Fixed 4 duplicate `className` props in ShareDrawer — `export-copied` visual feedback was silently broken (JS object literals: last value wins, first was discarded). Copy Markdown / Save .md / Print / Fari buttons all affected.
- `ui-modals.js`: Deleted `HowPanel`, `WhatPanel`, `InPlayPanel` (~140 lines) — implemented old tabbed help system replaced by RHP bottom sheet, never called anywhere
- `ui.js`: Fixed QPP `seedData: sceneData` bug (wrong data under wrong key)
- `ui.js`: Fixed QPP object keys (`countdown`→`scene`, `compel`→`npcMajor`), updated `SessionPackPanel` to match
- `ui.js`: Converted `seedResultDone` useState → useRef (one-shot guard doesn't belong in React tree)
- `ui.js`: Fixed save-session useEffect deps to `[result]` only — history/activeGen are snapshot values, not triggers
- `ui.js`: Added `pinnedCardsRef` — keyboard handler no longer rebuilds on every pin
- `ui.js`: Fixed `text-label-muted` className typo → `sidebar-tool-btn`
- `ui-primitives.js`: `FDStressTrack` — removed `shaking` useState, CSS drives the taken-out animation
- `ui-primitives.js`: Removed dead `RA_ICONS.session_zero` (duplicate of `seed`)
- `theme.css`: Restored 10 missing CSS classes that survived Sprint D purge but were referenced in JS: `export-copied`, `action-bar-ctx/inspire/icon`, `inspire-wrap/ghost/chosen/card`, `pin-bounce`, `compact-toggle-btn`

86/86 assertions · 128/128 smoke.

---

## 2026.03.148 — Sprint H: intro.js timer cleanup

- `core/intro.js`: Added `visibilitychange` + `pagehide` event handlers — timers now cancelled if user navigates away mid-sequence (previously fired against detached DOM)
- `core/intro.js`: Added `done` flag check in `runSequence` loop — double guard against orphaned animations

86/86 assertions · 128/128 smoke.

---

## 2026.03.147 — Sprint G: run.html accessibility

- `campaigns/run.html`: 27 `'aria-label':` attributes added to icon-only buttons (round counter, GM mode toggle, card reveal, zone/GM note add, FP spend, Roll 4dF, Export MD, Clear, Add Player, Add Skill, Turn order pills)
- `campaigns/run.html`: Landmark regions labelled: scene board (`role="region"`), player roster, dice panel
- `qa_named.js`: NA-67 added — asserts run.html has ≥15 aria-label attributes

86/86 assertions · 128/128 smoke.

---

## 2026.03.146 — Sprint F: Wiki accuracy pass

- `help/customise.html`: Removed duplicate "Reference panel depth" section; fixed Settings reference (⚙ sidebar removed); fixed Session Zero description (now Prep Wizard); fixed Universal Merge Settings reference
- `help/faq.html` + `help/getting-started.html`: Fixed localStorage description (text-size removed from localStorage list)
- `help/at-the-table.html`: Removed Inspiration Mode reference (feature still live in action bar, but wording was stale)
- All 12 wiki pages confirmed: no GM Mode, Help Level, Compact Mode, or dead nav references remain

86/86 assertions · 128/128 smoke.

---

## 2026.03.145 — Sprint F begins + NA-67 pre-added

- `qa_named.js`: NA-67 pre-added (run.html aria-label count — Sprint G target assertion)

---

## 2026.03.143 — Sprint D: CSS dead code purge

- `assets/css/theme.css`: 1546 → 1384 lines. 162 dead lines removed: `land-gen-*`, `hl-sb-*` (Help Level sidebar), `inspire-*`, `gm-sidebar-*`, `action-bar-*`, `result-tab-*`, `btn-primary`, `btn-nav`, `btn-roll` campaign variants, `party-btn`, `pwa-banner` variants, `qf-result-*`, `qf-type-*`, and ~30 more confirmed-dead classes
- 6 live classes wrongly removed and safely restored: `btn-roll`, `full-session-btn`, `action-bar-roll`, `streak-pulse`, `cg-stats`, `rc-front`

85/85 assertions · 128/128 smoke.

---

## 2026.03.140 — Sprint C: dVenti Realm lore depth

- `data/dVentiRealm.js`: `major_trouble` 16 → 40 (24 new entries in dVenti guild/void/Senate voice)
- `data/dVentiRealm.js`: `compel_situations` 25 → 40
- `data/dVentiRealm.js`: `current_issues` 4 → 6 (Kobold General Strike, Void-Bank Insolvency — with named faces)
- `data/dVentiRealm.js`: `impending_issues` 4 → 6 (Senate Sunset Legislation, Licence Lottery Rigging)
- `data/dVentiRealm.js`: `opposition` +4 major NPCs: Guild Arbiter, Dragon Treaty Negotiator, Lich Emeritus of the Old Senate, Kobold Union Steward

85/85 assertions · 128/128 smoke.

---

## 2026.03.139 — Sprint B: Dust and Iron content expansion

- `data/western.js`: `compel_situations` 7 → 35 (28 new frontier-voice compels)
- `data/western.js`: `twists` 10 → 30 (20 new)
- `data/western.js`: `opposition` 4 → 14 (10 new stat blocks: Hired Gunhand, Company Riders, Angry Homesteaders, Cattle Baron, Pinkerton Detective, Corrupt Circuit Judge, Veteran Outrider, Railroad Company Agent, Land Shark, Vengeful Survivor)
- `data/western.js`: `minor_weaknesses` 15 → 40 (25 new)
- `data/western.js`: `faction_methods` +3, `faction_face_roles` +6
- `campaigns/guide-western.html`: Full voice and accuracy pass; content counts updated

85/85 assertions · 128/128 smoke.

---

## 2026.03.138 — Sprint A: QA hardening + Sprint E items

**QA hardening:**
- `qa_named.js`: NA-61/62 updated from 7 → 8 worlds (dVentiRealm added)
- `qa_named.js`: NA-63 — all 8 guide pages have correct `worldKey` in inline script
- `qa_named.js`: NA-64 — all 8 guide pages have correct `data-campaign` attribute
- `qa_named.js`: NA-65 — `run.html` and `character-creation.html` are in `sw.js` APP_SHELL
- `qa_named.js`: NA-66 — no opposition skill rating > 5 (FCon Superb cap)

**Sprint E items (absorbed into Sprint A):**
- `data/fantasy.js`: Deep Wurm Fight rating 6 → 5 (FCon Superb cap violation)
- `data/space.js`: Void Kraken Juvenile Fight rating 6 → 5
- `sw.js`: `campaigns/run.html` + `campaigns/character-creation.html` added to APP_SHELL
- `campaigns/run.html` + `campaigns/sessionzero.html`: dVentiRealm data file added to load list
- `core/ui.js`: Session save now writes `fate_last_camp` to IDB (was: nothing)
- `core/ui-landing.js`: lastCamp now reads from IDB via `useEffect` (was: stale localStorage reads returning null)
- `about.html`: Entry count updated 9,750+ → 9,900+
- `ROADMAP.md`: Rewritten to v137 reality (35-version gap closed)
- `docs/testing.md`: Rewritten to v137 reality (assertion count, 8 worlds, Sprint G target documented)

85/85 assertions · 128/128 smoke.

---

## 2026.03.136 — dVenti guide rewrite + landing streamline

- `campaigns/guide-dVentiRealm.html`: Full content rewrite — zero Shattered Kingdoms content remains; correct `worldKey: 'dVentiRealm'`; correct links throughout
- `index.html` (landing): Topbar stripped to 3 elements (wordmark · Help · theme toggle); content order revised (Hero → Worlds → NPC Demo → "New here?"); 16-generators list removed from landing (lives in wiki)

81/81 assertions · 128/128 smoke.

---

## 2026.03.132–133 — dVenti Realm (8th world)

- `data/dVentiRealm.js`: 1000+ lines. Full parity with fantasy.js (16/16 generators, 8 world-specific table groups)
- High fantasy for D&D converts: the Arcane Senate collapsed 30 years ago; vaults, guilds, contracts, void-corruption, dragons, liches, kobold unions, everything the Senate was keeping contained
- 28 stunts with D&D class-feature names and Fate mechanical translations
- `campaigns/dVentiRealm.html`: campaign page wired
- `assets/css/campaigns/theme-dVentiRealm.css`: deep purple/violet Senate aesthetic
- World count: 7 → 8. Combinations: 112 → 128. Smoke test updated.
- `sw.js`: dVentiRealm added to APP_SHELL
- `qa_named.js`: NA-61/62 world arrays updated (7 → 8); NA-63/64 added

---

## 2026.03.130 — RUN-17: Card renderer (MTG-style view)

- `core/ui-renderers.js`: `ResultCard` component — MTG-style landscape card for all 16 generators. Spine (vertical type label + icon + key number badge), front face (all generator output), flip-to-back (help rules). WCAG 3.0 compliant.
- `core/ui-renderers.js`: `renderCard()` — parallel to `renderResult()`, same data different treatment
- `assets/css/theme.css`: `rc-*` CSS (card renderer classes)
- `core/ui.js`: `cardView` state + **♥ Card** toggle button in result toolbar
- `new/` unified surface parked — `new/README.md` documents revisit criteria 2027.03.01

---

## 2026.03.129 — RUN-16: Card reveal model

- `campaigns/run.html`: `revealed` field on all cards (default false)
- 👁/🙈 per-card reveal toggle in GM Mode; green left border when revealed
- Player View: shows only revealed cards (not all non-GM-only cards as before)
- "Reveal All / Hide All" topbar button in GM Mode

---

## 2026.03.125 — Sprint 15: Run surface v2

- Run lane board: 5 fixed lanes (Scene/NPCs/Factions/Mechanics/GM Only), LaneCard compact renderer, NPC stress inline, Countdown ticking inline. `renderResult()` removed from board.
- Light/dark theme toggle in Run topbar
- `?world=` URL param — campaign pages link to their Run session pre-loaded
- `▶ Run` button in campaign topbar (all 8 worlds)
- Quick Prep Pack → IDB persist; Saved Prep import; QPP import; card drag-reorder

---

## 2026.03.120 — Sprint 14: Internal improvements

- Aspect quality signal: `scoreAspect()` heuristic + ◆◇△ badges on NPC + scene aspects. 14/14 tests.
- Fari JSON character import in Run surface (`parseFariCharacter()`)
- Session Notes (IDEA-06): IDB-backed GM scratchpad per campaign, autosave 800ms debounce

---

## 2026.03.117–119 — Sprint 12–13: Run surface MVP + polish

- `campaigns/run.html`: Scene board MVP (873→1587 lines over sprints). Scene card grid, FP tracker, 4dF dice roller, zone creation, inline edit, Markdown export, import from Prep Wizard, IDB-persist, GM/player view toggle, round counter, consequence tracking, skill quick-add, TurnOrderBar drag-to-reorder.
- Fourth pillar established: Learn · Prep · Run · Export

---

## 2026.03.114–116 — Sprint 10–11: Prep Wizard + community launch prep

- `campaigns/sessionzero.html`: 5-step Prep Wizard (World→Players→Seed→Scene→NPC), IDB-persist, ✓ Ready screen, reroll per step, Open World button
- Old `sessionzero.html` (character creation wizard) preserved as `campaigns/character-creation.html`
- WS-14 dogfood: 5/5 GMs hit North Star (Session Prep Completion). 100%.
- r/FATErpg post draft complete (``)

---

## 2026.03.104–113 — Sprints 7–9: Connect the prep loop

- Seed→Scene+Faction chain buttons; Faction→NPC+Seed chain buttons
- StuntSuggester swap mode + "Use this stunt" button
- "Session ready" ✓ Ready badge when seed+NPC+scene pinned
- Encounter opposition deduplication (NA-60)
- BUG-03: Quick Prep Pack bundle corrected (Seed+Scene+NPC, not Seed+Countdown+Compel)
- UX-12: Countdown Tracker in Prep panel (IDB-backed, tick boxes, auto-add from last roll)
- RHP-01: ResultHelpPanel — always-visible bottom sheet replacing GM Mode toggle + Help Level
- WS-11 simulation: 203 upvotes, 96% rate (ready to ship when repo public)


## 2026.03.103 — Sprint 6 complete: Stunt Generator + bug fixes

**Sprint 6 shipped.** Stunt generator available as an NPC card sub-feature across all 7 worlds.

**STUNT-01 — Tag taxonomy + full corpus tagging:** 14-tag taxonomy defined (`combat`, `movement`, `stealth`, `social`, `knowledge`, `technical`, `investigation`, `intimidation`, `survival`, `leadership`, `subterfuge`, `supernatural`, `repair`, `negotiation`). All 196 stunts tagged with `tags:[]` arrays. Dust and Iron expanded from 13 → 28 stunts for world parity. NA-59 assertion: every stunt has a non-empty tags array.

**STUNT-02 — StuntSuggester component:** `StuntSuggester` React component in `ui-renderers.js`. Keyword→tag scoring algorithm maps NPC high concept text to the 14-tag taxonomy, scores the world stunt pool, and returns 3 suggestions: one `bonus`, one `special`, one wildcard from a distinct tag cluster. Reroll button shuffles and re-scores. Appears below stunt section in both `MinorResult` and `MajorResult` cards. `renderResult()` gains a 4th argument `worldStunts` — campaign app passes `t.stunts`. Full CSS in `theme.css`.

**NA-56 fixes (template collision sweep):** Three Variety Matrix adjective+hazard collisions fixed across the suite — Victorian "Pre-ritual ritual circle", Cyberpunk "Automated automated lockdown", Postapoc "Toxic toxic chemical storage". All collisions follow the same pattern: adjective in `VdAdj`/`CdAdj`/`PdAdj` array appears as a prefix word in a `*Hazard` entry. Fixed by renaming the hazard entry.

**learn-fate.html sidebar bug fixed:** Progress section had been injected using escaped quotes (`\"`) inside a Python heredoc during a prior session, causing the browser to receive literal backslash-quote characters. The section rendered as broken markup at the bottom of the sidebar instead of clean HTML under the "Learn" section. Fixed by rewriting the entire progress block as unescaped HTML in the correct position.

**devdocs pass:** `architecture.md`, `content-authoring.md`, `qa-gaps.md`, `VISION.md`, `README.md`, `CHANGELOG.md`, `claude_bootstrap.md`, `download-deps.sh` all updated. `install-rpg-awesome-fonts.py` deleted (RPGAwesome removed in v91). Devdocs review trigger added to memory and `claude_bootstrap.md`: review all devdocs when build number ends in `.2`.

76/76 assertions · 112/112 smoke.

---

## 2026.03.102 — Sprint 6 started: STUNT-01, learn-fate sidebar fix, roadmap review

**STUNT-01 shipped (partial):** Tag taxonomy defined, tagging script applied to all 181 existing stunts, 15 new Dust and Iron stunts written for parity. NA-59 assertion appended. STUNT-02 component written but CSS/wiring pending.

**learn-fate sidebar escaped-quote bug identified:** Progress `<nav>` block rendering as broken text at bottom of sidebar traced to Python heredoc escaping in a prior str_replace operation.

**Roadmap review:** Sprint 6 status assessed. Devdocs pass needed. Sprint 7 proposed: connected chains (seed→faction→NPC contextual rolls), WS-11 post, WS-14 first dogfood.

76/76 assertions · 112/112 smoke.

---

## 2026.03.101 — Sprint 5 complete: Content Quality Floor

**Sprint 5 shipped in full.** Suite average raised from 2.49 → 3.93/5 (100-tester model). All 7 worlds ≥ 3.5. Convention GM cohort raised from 2.00 → 3.0+.

See v2026.03.98 entry for Sprint 4 notes. Full Sprint 5 detail in v2026.03.100–101.

**WS-16a** — engine.js capitalises minor NPC concepts and scene aspects at assembly point. Fixes systematic lowercase starts across all 7 worlds from Variety Matrix variable pools.

**WS-16b** — Cyberpunk CmRole: duplicate "undercity guide" removed, 4 new transhumanist-register roles added. Fantasy FmAdj: duplicate "hollow-eyed" and "blight-touched" removed, 6 wound-lore adjectives added.

**WS-16c** — Victorian "Pre-ritual ritual circle" and "Occult occult ward pattern" template collisions fixed. Cyberpunk "Automated automated lockdown" fixed.

**WS-16d** — Void Runners: 11 minor concept + 8 major concept register-bleed entries replaced. "Cybernetic Mercenary", "Intergalactic Smuggler", "Alien Diplomat's Bodyguard" replaced with blue-collar solidarity voice entries.

**WS-16e** — `universal.js` consequence_mild: 25 generic entries ("Knocked Prone", "Ringing Ears", "Winded" etc.) replaced with 20 evocative voice-neutral alternatives. Dust and Iron consequence_mild expanded with 8 frontier-specific entries.

**NA-56/57/58 assertions shipped:** (56) no repeated adjacent words in scene aspects, (57) no duplicate entries in major NPC others[], (58) all minor NPC aspects start uppercase. These assertions caught all 3 categories of regression found in WS-15.

**Wiki sidebar misalignment fixed:** `wiki.css` loaded by `how-to-use-ogma.html` and `learn-fate.html` was overriding `_shared.css` with legacy 260px grid layout. Removed `wiki.css` link from both pages.

75→76 assertions · 112/112 smoke.

---

## 2026.03.100 — Sprint 5: NA assertions + capitalisation + sidebar fix

NA-56/57/58 assertions added (summary print moved to after new assertions to fix count reporting). `engine.js` `generateMinorNPC` capitalises at assembly. Victorian "Pre-ritual" and "Half-triggered" VdAdj fixes. `wiki.css` removed from how-to-use-ogma.html and learn-fate.html.

75/75 assertions · 112/112 smoke.

---

## 2026.03.99 — Roadmap review + Sprint 5 planning + GTM draft

**Sprint 4 formally marked complete. Sprint 5 planned.** BACKLOG rewritten with Sprint 5 items prioritised from WS-15 findings. 100-tester simulation (WS-15) findings: suite avg 2.49/5, 5/7 worlds FAIL, Convention GM cohort 2.00/5. Root causes: lowercase concept pools, duplicate concepts, broken scene templates, generic minor NPC concepts, Void Runners register bleed.

**WS-11 draft complete:** r/FATErpg intro post + blog post written to ``. Held pending repo going public.

72→75 assertions (NA-56/57/58 added, but summary-print bug prevents correct count display — fixed in v100).

---



**Sprint 4 shipped in full.** learn-fate.html transformed from a static reading document into a fully interactive guided walkthrough.

**UX-05 — Step progress sidebar:** IntersectionObserver tracks which step is on screen. Completed steps turn green. Progress persists to localStorage. Seven linked step entries in the wiki sidebar nav.

**UX-06 — Dice rollers at every decision point:** Steps 1 and 3 (from Sprint 2) extended to all 7 steps. Steps 2, 5, and 6 feature side-by-side `learn-double-roll` grids showing the before/after of an invoke, attack vs. defence, and stunt active vs. inactive.

**UX-07 — NPC demo in step 6:** Hardcoded example NPC (Cassidy "Threadbare" Voss) with annotated High Concept, Trouble, skills, and two stunts that deliberately reinforce each other. Explanatory note shows the design pattern.

**UX-08 — Example-driven depth layer:** Six new callouts added across steps 2–7:
- Step 2: aspect bidirectionality test (`.callout-tip`)
- Step 3: tie = success at a cost, FCon SRD p.20 (`.callout-info`)
- Step 4: compel honesty GM tip (`.callout-tip`)
- Step 5: consequence recovery sequence with treatment roll, FCon SRD p.30 (`.callout-warning`)
- Step 6: stunt format patterns, FCon SRD p.28 (`.callout-info`)
- Step 7: fail forward principle (`.callout-tip`)

**WS-10 — Sensory tags for scene aspects:** `engine.js` `generateScene()` now assigns a `sense` field (`sight`/`sound`/`smell`/`touch`) to each aspect, weighted by category. SceneResult renders a sense emoji badge (👁/👂/👃/✋) with `aria-label`.

**WS-12 — Quick Find bar:** `/` key opens an overlay search. Fuzzy-matches all 16 generators, 7 worlds, and 7 wiki pages. Arrow key navigation, Enter to select, Esc to dismiss. Type badges (gen/wiki/world) with accent-coloured tags. Liquid Glass styling. `QuickFind` component in `ui-modals.js`. KBShortcuts panel updated.

72/72 assertions · 112/112 smoke.

---

## 2026.03.97 — Sprint 4: UX-05/06/07 interactive learn-fate

Step progress sidebar (UX-05), dice rollers in all 7 learn-fate steps (UX-06), and NPC stunt demo in step 6 (UX-07) shipped. See v98 for full Sprint 4 notes.

72/72 assertions · 112/112 smoke.

---

## 2026.03.96 — Sprint 3: SPA migration complete + modern JS pass

**SPA-05 — shared-lite.js:** Landing page now loads a 2.8KB bootstrap (`data/shared-lite.js`) instead of the full 81KB `shared.js`. 96% JS reduction on first paint for the landing view. SPA router dynamically injects full `shared.js` → `universal.js` → `[camp].js` → `engine.js` when a campaign route is detected.

**SPA-07 — Modern JS pass:** `const`/`let` replaces `var` across all four split files (`ui-primitives`, `ui-renderers`, `ui-modals`, `ui-landing`). `useState` pairs destructured inline. Arrow functions in map/filter callbacks. Zero `var` at top level across all four files.

**SPA-06 parked:** Requires all `<script>` → `<script type="module">` migration. Blocked pending type=module decision. Logged in BACKLOG parking lot.

**Sprint 3 closed.** SPA-01 through SPA-05, SPA-07 shipped across v94–v96. Sprint 4 begins.

72/72 assertions · 112/112 smoke.

---

## 2026.03.95 — Sprint 3: routing, nav tabs, compact cards

**SPA-03 — History API routing:** Route-aware bootstrap in `index.html` reads `location.pathname`, dynamically injects campaign data scripts, mounts `CampaignApp`. Click interceptor for SPA navigation. `popstate` handler for back/forward. `SPA_PAGES` clean URL map (`/ogma-fate/[camp]`). World cards and Continue → use clean URLs.

**SPA-04 + UX-04 — Unified nav tabs:** Worlds / Prep / Learn / Help tab strip added to both `CampaignApp` and `LandingApp` topbars. Active tab underline. Responsive: tab labels hidden at 700px, tabs hidden at 480px. `aria-current` on active tab.

**WS-09 — Compact card view:** `⊞ Compact` toggle button in action-bar-secondary. `data-compact="true"` on `.content-panel` triggers CSS that collapses FD card section gaps, reduces font sizes, and hides GM tip rows. `aria-pressed` toggle state.

72/72 assertions · 112/112 smoke.

---

## 2026.03.94 — Sprint 3: ui.js split + GitHub Pages deployment

**SPA-01 — GitHub Pages deployment:** `.nojekyll` added (prevents Jekyll processing). `.github/workflows/deploy.yml` deploys `main` branch to GitHub Pages on push, `cancel-in-progress` concurrency guard.

**SPA-02 — ui.js split into 5 files:** `core/ui.js` (4,202 lines) split into:
- `core/ui-primitives.js` (193 lines) — React aliases, TIMING, RA_ICONS, theme utils, FD primitives
- `core/ui-renderers.js` (617 lines) — all 16 result renderers + `renderResult()`
- `core/ui-modals.js` (669 lines) — Modal, ShareDrawer, KB, Help, Settings, Vault
- `core/ui-landing.js` (350 lines) — CAMPAIGN_PAGES/INFO + LandingApp
- `core/ui.js` (2,384 lines) — TableManagerModal + CampaignApp

All 16 HTML files updated with 4 new `<script>` tags in load order. `sw.js` APP_SHELL updated. `bump-version.sh` stamps all 5 filenames. `qa_named.js` `uiSrc` reads all 5 files concatenated.

72/72 assertions · 112/112 smoke.

---

## 2026.03.93 — OGMA acrostic letters + Sprint 2 shipped

**OGMA acrostic letters:** O, G, M, A in the landing page hero eyebrow are now 1.55× larger, `#30D158` green, with a staggered glow-pulse animation (O→G→M→A, each 0.35s offset, 2.8s period).

**Sprint 2 complete.** See v92 for full Sprint 2 notes.

71/71 assertions · 112/112 smoke.

---

## 2026.03.92 — Sprint 2: Infrastructure, Outreach, UX Quick Wins

**WS-04 — Dexie 4 IDB migration:** `core/db.js` IDB section rewritten to use Dexie 4 API. Same public API surface — zero call-site changes. One-time migration from legacy raw-IDB `fate_generator` db on first open. memStore fallback retained. `sw.js` CDN_SCRIPTS updated. Dexie `<script>` tag injected into all 16 HTML files.

**WS-05 — D&D bridging language audit:** All 16 `dnd_notes` fields audited. 4 rewrites: `npc_minor` (ambiguous stress count fixed), `encounter` (Popcorn Initiative clarified, win condition separated), `faction` (positive pressure framing), `backstory` (insider "mechanical weight" replaced with concrete invoke/compel example).

**UX-01 — 4dF dice roller:** `assets/js/dice-roller.js` — self-contained vanilla JS widget, no dependencies. Flicker → stagger-reveal → adjective label → outcome badge. `data-mode="basic|skill"` attributes. Embedded in `learn-fate.html` steps 1 and 3. CSS in `theme.css`.

**UX-02 — Five callout box CSS types:** `_shared.css` canonical source for `scenario / info / warning / dnd / tip` types. `wiki.css` duplicate block removed. `learn-fate.html` inline `.step-dnd`/`.gm-extra` styles removed; all 7 instances migrated to `.callout-dnd` / `.callout-tip` with `role="note"`.

**UX-03 — Landing NPC demo:** 20-NPC hardcoded pool (2–3 per world, World-Building Savant standard). 3 shown at a time, shuffle button. Liquid Glass cards with trouble accent border and stunt badge.

**WS-06 — PWA update banner:** Persistent `role="alert"` top-bar replaces old transient toast. Accent-tinted, Update/Dismiss, keyboard accessible.

**WS-07 — Safari/iOS banners:** Safari 7-day storage warning (amber) + iOS A2HS install nudge (blue). UA detection, `standalone` check, `localStorage` dismiss persistence.

**GTM-03 — CONTRIBUTING.md:** QA gates, content quality bar (invoke+compel test, world voice guide), architecture constraints, rules accuracy quick-reference. Four-gate PR checklist.

**Team expanded:** World-Building Savant (Role 14 — campaign table entries, aspects, narrative interconnectivity), Mechanical Auditor (Role 15 — scored qualitative audits across 5 dimensions). Content Designer spec upgraded to educational/instructional focus. `team-roles.md`, `claude_bootstrap.md`, `team-prompt.md` all updated.

72/72 assertions · 112/112 smoke.

---




## 2026.03.91 — Roll button fix + RPGAwesome removal + HTTPS-first decision

**BUG FIX — Roll button broken since v85.** `var _lastSeed = useRef(null)` was inside the deleted projector block. Restored declaration + wrapped `doGenerate` in try/catch safety net.

**RPGAwesome font removed entirely.** Replaced with native emoji icons. `RA_ICONS` map contains emoji strings. `RaIcon` renders `<span>` with emoji. Zero font dependencies. `assets/css/rpg-awesome-local.css` (2,176 lines) and `assets/fonts/rpg-awesome/` deleted. Stylesheet links removed from 20+ HTML files. `license.html` attribution removed.

**ARCHITECTURE DECISION: HTTPS-first (Level 1).** `file://` support dropped. Ogma now requires HTTPS or localhost for first load. Service worker provides full offline after. This unlocks: ES Modules, SPA routing, code splitting, dynamic imports, modern JS (const/let/arrows), Web Workers, clean URLs, GitHub Pages deployment.

**Devdocs updated for HTTPS-first:** VISION.md v4.0 (architecture unlocked, UX roadmap). BACKLOG.md rewritten with EP-12 SPA Migration epic, Sprint 3 (SPA) and Sprint 4 (Interactive Learning), 7 UX items + 8 SPA items. claude_bootstrap.md, architecture.md, team-prompt.md, team-roles.md, README.md, about.html — all file:// references removed or updated.

**UX/UI roadmap added to backlog:** UX-01 dice roller, UX-02 callout boxes, UX-03 landing NPC demo, UX-04 unified nav tabs, UX-05 progress sidebar, UX-06/07 embedded learning widgets, UX-08 example-driven content pass.

71/71 assertions · 112/112 smoke.

---

## 2026.03.88 — Devdocs cleanup + codebase refactor

**Devdocs sweep:** BACKLOG.md fully rewritten (Sprint 1 → Completed, IDEA-06 added, stale refs fixed). VISION.md v3.1 → v3.2 (Learn · Prep · Export). claude_bootstrap.md, architecture.md, data-schema.md, team-prompt.md, team-roles.md, poc-gtm-strategy.md all updated — Roll20, Projector, Player View, Binder, Adventure Seed references removed or corrected.

**Dead JS functions removed (126 lines):** HelpPanel (72), NextStepStrip (53), TextSizeToggle + TEXT_SIZE constants (49), ThemeToggle (16), Lbl (5), AspectBadge (3), SkillBar/StressBoxes/StuntRow/GMNote (4 one-liner aliases). All pre-FD or pre-Settings legacy code, zero call sites.

**Dead CSS removed (~97 lines):** 65+ orphaned classes across four categories — pre-FD card components (29), Table Mode (14), misc dead UI (13), dead FD sub-classes + animations (9). NA-26 assertion updated.

ui.js: 4,183 → 4,057 (−126). theme.css: 1,283 → 1,186 (−97). 71/71 assertions · 112/112 smoke.

---

## 2026.03.86 — Fari export compliance rewrite

**Full rewrite of Fari JSON export** to match the `.fari.json` v4 specification. 17 compliance issues fixed. Verified against the Fari App JSON Export/Import Specification.

**Envelope:** `{ character: {...} }` → `{ fariType: "character", version: 4, entity: {...} }`.

**Page structure:** Flat sections array → `{ left: [...], right: [...] }` column layout.

**Block fixes:** `"Number"` → `"Numeric"`. Skill `value` numeric → string. SlotTracker boxes moved from `value` to `meta.boxes`. `helpText: ""` added to every block. Text meta now includes `hasToggle`/`isToggled`. Skill meta now includes `hideModifier`/`hasToggle`/`isToggled`. Stray `commands: null` removed from all non-Skill blocks.

**Character root:** Added required fields `wide: false`, `notes: ""`, `playedAt: null`. Removed non-spec fields `playedDuringTurn`, `playerName`, `color`.

**Major NPC Fate Points:** Changed from Numeric block to `PointCounter` with `isMainCounter: true`, `hasMax: true`, `max: 3`. Only one PointCounter is main counter per character (validated).

**Section `visibleOnCard`:** Aspects, Stress, Vitals, and Consequences sections now `true` — visible on compact Character Card in Fari sessions.

**UUID v4 IDs:** `_fariId()` now uses `crypto.randomUUID()` with polyfill fallback. All IDs across the document are unique UUID v4 format.

**Batch export:** `toBatchFariJSON` now returns array of FariEntity envelopes (not `{ characters: [] }`). NA-08 assertion updated.

**Cleanup:** Dead `_roll20Id()` function and Roll20 comment block removed.

71/71 assertions · 112/112 smoke.

---

## 2026.03.85 — Product reshape: Learn + Prep + Export

**Strategic refocus.** Ogma is now a Learn + Prep tool that exports to play tools. Play features (Projector Mode, Player View, Table Mode) deleted entirely — not deprecated, deleted. Fari App is the endorsed play surface. This is the largest single-version change in project history.

**Deleted — Play features (~1,500 lines removed):**
- `projector.html` (414 lines), `player.html` (208 lines), `projector.css` (431 lines) — files deleted
- `TableGridCard`, `TableGrid`, `updateCardState`, `toggleCardVisible` — components deleted from ui.js
- Projector state, BroadcastChannel setup, `pushToProjector`, `pushProjectorUpdate`, `clearProjector` — all removed
- Table Mode rendering branch, sidebar items, keyboard V handler — all removed
- `toRoll20JSON` (92 lines) deleted from engine.js; Roll20 export button removed
- 7 QA assertions removed (NA-16, NA-31, NA-38, NA-39, NA-41, NA-49, NA-50); 2 updated (NA-20, NA-22)

**Renamed — user-facing labels:**
- "Adventure Seed" → **"Session Starter"** across all files (GENERATORS, HELP_CONTENT, engine.js markdown, FDId card header)
- "Your Binder" → **"Your Session"** across all user-facing strings
- "Pin" → **"Keep"** across all user-facing strings (pin button, toast messages, history label, wiki)
- "At the table" sidebar group → "Tools"
- Landing page "Play at the Table" pillar → "Export & Play"

**UI rework — narrower layout:**
- `.main-layout` max-width 760 → **640px**
- `.modal-box-wide` 780 → 640px, `.modal-box-narrow` 600 → 560px

**UI rework — info tabs collapsed:**
- Three-tab system (What / How / In Play) → single expandable **"How to use this"** button
- All three panels render stacked when expanded, collapsed by default
- `resultTab` default changed from `'what'` to `'closed'`

**Wiki cleanup:** All 12 wiki pages updated — projector/player/Table Mode references removed, Binder→Session, Pin→Keep, Adventure Seed→Session Starter. FAQ Projector Mode section deleted.

**Fari export promoted** to primary export format. Roll20 export removed entirely.

71/71 assertions · 112/112 smoke. ui.js: 4,482 → 4,183 (−299 lines, −6.7%).

---

## 2026.03.84 — Sprint 1: Accessibility Foundation

**UX Audit Workshop Sprint 1** — the foundation sprint from the 3-Pillar UX Audit. Every item ICE-scored, workshop-consensus.

**WS-01: Touch target audit (WCAG 2.5.8)** — All four interactive target classes bumped to 48×48px minimum with 8px spacing: `.fd-box` (stress boxes, 44×36 → 48×48), `.fd-fpd` (fate point dots, 36×36 → 48×48), `.contest-box` (44 → 48), `.cd-box` (countdown boxes, 44 → 48). `.seed-scene-tab` min-height 48px. Border radii increased on stress boxes (2px → 6px).

**WS-02: ARIA pass** — `aria-expanded` + `aria-controls` on Campaign Issue toggles. `role="status"` + `aria-live="polite"` on Compel resolution. `role="checkbox"` + `aria-checked` + `aria-disabled` on Consequence recovery checkboxes and Constraint bypass. Modal focus-return: saves `document.activeElement` on mount, restores on unmount (SC 2.4.3).

**WS-03: Taken-out multi-signal (WCAG 1.4.11)** — Four non-color signals: ⚔ icon, line-through (2px), red border (1.5px), scale-flash animation (0.6s). New `.fd-taken-out-label` class with `@keyframes fd-takenout-flash`.

**WS-13: QA assertions NA-52–55** — Touch target minimums verified in CSS. Regex handles both minified and expanded formats.

**GTM-05: Mission statement** — Added to index.html hero section below primary description.

**about.html refresh** — Stats updated (19 → 78 assertions, 96 → 112 smoke). Feature list expanded from 7 → 14 items (Binder, Table Mode, Player View, Projector, Field Dossier, Learn Fate, Session Zero). Technical paragraph updated.

78/78 assertions · 112/112 smoke.

---

## 2026.03.83 — Field Dossier card redesign + learn-fate toggle removed

**Card redesign (Design D: Field Dossier)** — All 16 generator result renderers rewritten. New card structure: campaign accent top border, tinted section headers using `var(--accent)`, two-column layout, FD helper components (`FDCard`, `FDId`, `FDHdr`, `FDSect`, `FDGm`, `FDAsp`, `FDSkill`, `FDStunt`, `FDZone`, `FDInfoBox`, `FDCon`, `FDStressTrack`). Every interactive element preserved: clickable stress boxes with taken-out animation, contest victory scoring, countdown particles, compel accept/refuse, challenge outcome selection, consequence recovery tracker, constraint bypass toggle, scene aspect marking. 85 new CSS lines in theme.css. 5 dead CSS classes removed. Legacy aliases maintained for backward compat.

**Projector** — FD card structure added to projector.css (TV-scaled). Projector `renderResult` wraps content in `.fd-card` with accent top border + `.fd-id` header.

**Player view** — FD CSS added inline. Card rendering uses `.fd-card`, `.fd-id`, `.fd-hdr`, `.fd-sect`, `.fd-asp`, `.fd-sk`, `.fd-zone`, `.fd-badge`. Aspects show HC/Trouble color coding. Skills render with rating badges. Zones show name + aspect + description.

**learn-fate.html** — Toggle removed. All 7 steps always visible. Step 7 relabelled "For the GM."

74/74 assertions · 112/112 smoke.

---

## 2026.03.82 — Random world order + Binder rename

- **Random world order** — "Choose your world" grid shuffles on every page load (Fisher-Yates). No world gets permanent top-left position.
- **Your Binder** — "The Vault" renamed to "Your Binder" across all user-facing surfaces (modal, sidebar, toasts, wiki, devdocs). Internal API names unchanged.

74/74 assertions · 112/112 smoke.

---

## 2026.03.81 — Full 13-role 1-on-1 review

All 13 team roles audited through their lens. Findings:

- **CSS Engineer**: 119 orphaned CSS lines removed (90 dead classes from older UI iterations). theme.css: 1388 → 1269 lines.
- **Morgan**: help/at-the-table.html updated with Table Mode, Player View, and Binder sections. help/export-share.html updated with Binder section.
- **POC (Lena)**: Mission statement added to about.html and README.md.
- **QA**: NA-51 added (doFullSession assertion). 74 total assertions.
- Rules Expert, Content Designer, UX Researcher, A11Y, Infra, ComicBookGuy: clean — no action needed.

74/74 assertions · 112/112 smoke.

---

## 2026.03.80 — Bug fixes + refactor pass

- **learn-fate.html bug**: CSS `::before` content had mangled unicode. Replaced with actual character. Toggle JS hardened.
- **Index page reorder**: Sections now flow Learn · Prep · Play → 16 generators → Choose your world.
- **Consequence renderer bug**: Duplicate `className` prop — second overwrote first, losing treatment state. Merged.
- 4 orphaned `.asp-*` CSS classes removed.

73/73 assertions · 112/112 smoke.

---

## 2026.03.79 — Phase 3: Play shipped

The final vision phase. Four items:

- **Y-01 Table Mode** — TableGrid + TableGridCard components. Responsive card grid. Expandable cards with full interactive content. Session sidebar toggle.
- **Y-04 Card state persistence** — state + visible fields on pinned cards. Saves to IDB on change.
- **Y-02 GM show/hide** — Per-card toggle. Hidden cards dimmed. Pushes visible cards to BroadcastChannel.
- **Y-03 player.html** — Standalone read-only page. BroadcastChannel + localStorage fallback. Connection status.

73/73 assertions · 112/112 smoke.

---

## 2026.03.78 — Phase 2: Prep shipped

Six items delivering the Binder and export pipeline:

- **P-06** Full Session hero button in empty state.
- **P-01a/b** Binder IDB layer (7 methods) + VaultModal (save/browse/load/delete/export/import).
- **P-02** Per-card JSON export in history panel.
- **P-04** Session export/import via JSON file.
- **P-05** Session Zero "Export JSON" button.
- **FCon fix** Session Zero milestone terminology corrected.

71/71 assertions · 112/112 smoke.

---

## 2026.03.77 — Comprehensive content review

8 findings, all resolved. Western data expanded to parity. Invoke/compel examples verified world-neutral. All 16 beginner blocks confirmed. Landing page + wiki sidebar aligned to Learn · Prep · Play. NA-46 + NA-47 added.

70/70 assertions · 112/112 smoke.

---

## 2026.03.76 — Phase 1: Learn shipped

- **L-03** Info tabs restructured (What · How · In play). Default tab = What. In play always visible.
- **L-02** help/how-to-use-ogma.html — 3 guided paths with numbered steps.
- **L-01** help/learn-fate.html — Player track (6 steps) + GM toggle (Step 7). D&D contrast callouts.
- **L-04** Beginner content blocks for all 16 generators.
- All 12 wiki sidebars updated. sw.js updated.

68/68 assertions · 112/112 smoke.

---

## 2026.03.75 — Rules audit + devdocs refactor + Vision locked

**Rules audit (9 findings fixed):** FCon terminology corrected (milestone/breakthrough). Refresh formula fixed. Seeded PRNG fixed (8 calls). stressFromRating comment corrected.

**Devdocs refactor:** team-memory.md deleted. claude_bootstrap.md created. VISION.md v3.1 created. team-prompt.md trimmed. campaign-inspirations.csv created. ComicBookGuy (Role #13) added. Team: 13 members.

**Vision locked:** Learn → Prep → Play. Card grid MVP. Separate player.html. IDB + JSON, no cloud.

68/68 assertions · 112/112 smoke.

---

## 2026.03.73 — Ogma rebrand + UX audit + Western world

The largest single release. Ogma rebrand. CalVer adopted. BL-08 Dust and Iron (7th world). BL-06 shareable links. BL-40 Projector Mode + live sync (BL-41/42/43/44). Mock A (unified topbar + tabbed sidebar). EP-07 accessibility sprint. 12 delight animations. Morgan (Documentation Lead) + POC (Priya/Lena/Jordan) formed.

68 assertions · 112/112 smoke.

---

*Versions prior to 2026.03.73 were part of the pre-Ogma era (integer versioning v1–v36). Archived.*
