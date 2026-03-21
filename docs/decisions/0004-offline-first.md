# ADR-0004: Offline-First Architecture

**Date:** 2026-03 | **Status:** Accepted

## Context
GMs use Ogma at game tables — often in environments with spotty or no internet. The tool must be reliable without network access.

## Decision
**Offline-first: after first load, Ogma works indefinitely without network access.**

Implementation: service worker caches the entire APP_SHELL on first visit; cache-first strategy; `skipWaiting()` on install; all generation logic is pure client-side JS; all persistence uses IndexedDB; multiplayer sync is opt-in.

## Consequences
**Positive:** Works at any table after first load. No server costs. User data never leaves the browser by default.

**Negative:** Service worker requires HTTPS or localhost — `file://` skips the SW. First load requires internet. SW updates are deferred until all tabs close. Safari expires caches after 7 days of no visits.
