# Bootstrap — Session Startup Checklist

Read this at the start of every Claude Code session on ogma-svelte.

---

## 1. Orient

```bash
# Confirm you're in the right repo
pwd                  # Should be …/-ogma-svelte
git branch           # Note current branch

# Quick health check
npm run dev &        # Should start with zero errors (kill after confirming)
kill %1
```

## 2. Key files

| Path | What it is |
|------|-----------|
| `CLAUDE.md` | Project instructions — architecture rules, commands, component inventory |
| `MIGRATION.md` | Historical migration spec — pattern translations, component tiers (reference only) |
| `src/lib/engine.js` | Pure-function content generator (2,045 lines). No Svelte imports. |
| `src/lib/db.js` | Dexie 4 IndexedDB wrapper (996 lines). No Svelte imports. |
| `src/lib/helpers.js` | Shared utility functions (114 lines) |
| `src/lib/stores/` | 6 Svelte stores: canvas, play, binder, sync, session, chrome |
| `src/lib/components/` | 51 `.svelte` components (see inventory below) |
| `src/data/` | 11 campaign data modules (ES exports) |
| `src/routes/+page.svelte` | Landing page (`/`) |
| `src/routes/campaigns/[world]/+page.svelte` | Game board (`/campaigns/[world]`) |
| `static/assets/css/theme.css` | Global stylesheet — all styling lives here |
| `react-source/` | Original React codebase. **Read-only. Do not modify.** |

## 3. Component inventory

```
src/lib/components/
├── cards/          6 files   CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel
│   └── fronts/    18 files   NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                              Compel, Challenge, Contest, Consequence, Faction,
│                              Complication, Backstory, Obstacle, Countdown, Constraint,
│                              Custom, Pc
├── board/         18 files   Board, BoardCard, BoardLabel, BoardSticky, BoardBoost,
│                              TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel,
│                              DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel,
│                              StuntPanel, MobileList, CommandPalette
├── campaign/       3 files   Campaign, FatePointTracker, Landing
├── panels/         1 file    LeftPanel
├── dice/           1 file    DicePanel
└── player/         1 file    PlayerSurface
```

Total: 48 component files + 3 route files = **51 `.svelte` files**

## 4. QA commands

Run these after any change:

```bash
# Must pass
npm run dev              # Zero errors (warnings OK: unused props, a11y hints)
npm run build            # Must print "✔ done"

# Verify file counts
find src -name "*.svelte" | wc -l    # Should be 51
ls src/lib/stores/*.js | wc -l       # Should be 6

# No stubs or markers
grep -rn "TODO\|FIXME\|STUB" src/ --include="*.svelte" --include="*.js"
# Should return nothing

# Engine exports
node -e "import('./src/lib/engine.js').then(m => console.log(Object.keys(m)))"
# Should print 20 exports
```

## 5. Architecture rules

1. One component per `.svelte` file
2. Keep CSS in `static/assets/css/theme.css` — no `<style>` duplication
3. `engine.js` and `db.js` are pure JS — no Svelte imports
4. Stores are plain JS files exporting Svelte stores
5. Components import stores, not the other way around
6. Preserve all a11y: `role`, `aria-label`, `aria-pressed`, `aria-expanded`
7. Drag system: direct DOM during drag, single store update on drop
8. Run `npm run dev` after every change

## 6. Workshop voices

When making decisions, consider these perspectives (from the migration process):

- **Architect:** Keep the store/component boundary clean. Stores own state, components own DOM.
- **Pragmatist:** The `export let` + `$:` reactive pattern works. Don't migrate to runes unless there's a reason.
- **QA:** Every change must pass `npm run build`. No exceptions.
- **Preservationist:** `react-source/` is read-only. The sync protocol must stay cross-compatible.
