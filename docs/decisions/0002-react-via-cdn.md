# ADR-0002: React via CDN UMD, Not npm

**Date:** 2026-03 | **Status:** Accepted

## Context
Given ADR-0001 (no build step), React must be available in the browser without a bundler.

## Decision
**React 18 via cdnjs with exact version pins and SRI integrity hashes. `React.createElement` aliased as `h`.**

## Consequences
**Positive:** Loads from CDN with edge caching. Exact version pin (`18.2.0`) prevents surprise upgrades. SRI hashes prevent CDN compromise. Nothing to update in the repo when React patches.

**Negative:** Requires internet for first load (mitigated: SW caches after first load). UMD bundle is not tree-shakeable. CDN as availability dependency.

**Why not Preact?** React is what the component patterns target. Migration cost exceeds the file-size benefit given SW caching.
