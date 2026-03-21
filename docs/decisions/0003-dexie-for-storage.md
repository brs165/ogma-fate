# ADR-0003: Dexie 4 for IndexedDB

**Date:** 2026-03 | **Status:** Accepted

## Context
Ogma needs persistent browser storage for session data, pinned cards, and preferences. Options: raw IndexedDB API, localStorage, Dexie, or a cloud service.

## Decision
**Dexie 4 via cdnjs for IndexedDB. `window.LS` wraps localStorage for lightweight preferences.**

## Consequences
**Positive:** Promise-based API reduces error-prone IndexedDB boilerplate. 47KB overhead acceptable. Version migration built-in. `memStore` fallback handles private browsing and storage quota failures.

**Negative:** CDN dependency (same mitigation as ADR-0002). Schema changes require migration planning.

**Why not localStorage only?** Synchronous and 5–10MB limit. Session data easily exceeds this.
**Why not a cloud service?** ADR-0004 (offline-first) rules out required network dependency.
