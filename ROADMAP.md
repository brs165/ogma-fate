# Roadmap

**Current version:** 2.0.0 (SvelteKit)
**QA gate:** 51 `.svelte` components | 6 stores | `npm run build` passes | 0 TODO/FIXME/STUB

---

## Completed

### Svelte Migration (March 2026)
Full rewrite from React 18 CDN UMD to SvelteKit + Vite + adapter-static.
See `CHANGELOG.md` for details and `MIGRATION.md` for the historical spec.

- 51 components across cards, board, campaign, panels, dice, player
- 6 Svelte stores replacing custom React hooks
- File-based routing with `[world]` dynamic parameter
- Production build via adapter-static
- Zero compilation errors, zero stubs

---

## Open — Feature Parking Lot

Items identified during or before the migration. Not prioritized.

| Feature | Notes |
|---------|-------|
| Session state URL | Encode board state in URL for shareable session links |
| Campaign arc tracker | Multi-session arc progression, milestone tracking |
| Relationship map | Visual graph of NPC/faction relationships on the board |
| Sound / ambience | Background audio per world theme, triggered by scene cards |
| Fari import/export | Import characters and campaigns from Fari.app JSON format |
| Session replay | Record and playback a session's card generation sequence |
| 9th world | New campaign data module (genre TBD) |

---

## Open — Infrastructure

| Item | Status | Notes |
|------|--------|-------|
| Playwright E2E tests | Not started | Cover core flows: landing → world select → generate → board → export |
| Preact evaluation | Parked | Originally considered as lighter alternative; SvelteKit chosen instead |
| CSS Phase 2–4 refactor | Parked | Carried over from React era. `theme.css` works but is 2,744 lines. Reassess whether to split into component-scoped styles or CSS modules |
| TypeScript / JSDoc props | Optional | Props use `export let` without type annotations. Add incrementally if desired |
