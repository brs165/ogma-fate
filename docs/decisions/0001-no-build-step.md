# ADR-0001: No Build Step

**Date:** 2026-03 | **Status:** Accepted

## Context
Ogma deploys as a static site on GitHub Pages. Should we use a build tool (Vite, Webpack) for optimised bundles, or serve source files directly?

## Decision
**No build step. Source files are the deployed files.**

## Consequences
**Positive:** Zero toolchain to install — contributors clone and open. No build artefacts. Browser devtools show actual source. Deployable to any static host with zero config.

**Negative:** No tree-shaking, minification, or code splitting without manual effort. File sizes larger than a bundled equivalent. Cannot use npm packages without a UMD/CDN build.

**Mitigations:** Service worker caches all files after first load — parse cost paid once. `?v=N` cache busting prevents stale files. CDN delivers React/Dexie with edge caching.

## Alternatives considered
- **Vite** — excellent DX, but adds a build step that breaks the "just open index.html" workflow.
- **ES Modules only** — partially adopted; requires `type="module"` across all HTML and changes the global-variable communication pattern. Parked as SPA-06.
