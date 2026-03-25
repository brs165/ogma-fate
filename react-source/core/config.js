// core/config.js — project-wide configuration constants
// Forks: update OGMA_CONFIG.REPO_BASE to match your GitHub Pages repo name
// For custom domains (e.g. ogma.net), set REPO_BASE to ''
//
// This file is loaded by index.html before core/ui-landing.js.
// All values can be overridden at runtime via URL params or Settings UI.

var OGMA_CONFIG = {
  // GitHub Pages base path. Forks: change 'ogma-fate' to your repo name.
  // Set to '' when deploying to a custom domain (Cloudflare Pages, etc.)
  REPO_BASE: (function() {
    // Auto-detect: if served from GitHub Pages, extract base from pathname
    // Matches /reponame/ prefix; returns '' for custom domains and localhost
    var m = window.location.pathname.match(/^\/([^/]+)\/(?:campaigns|help|index)/);
    return m ? '/' + m[1] : '';
  })(),

  // Default multiplayer sync server. Override in Settings (stored in fate_prefs_v1.syncHost).
  // Self-hosting: deploy ogma-sync/ to your own Cloudflare Worker and set this URL.
  DEFAULT_SYNC_HOST: 'ogma-sync.brs165.workers.dev',

  // Build version — stamped by bump-version.sh. Used in footers.
  VERSION: '2026.03.412',
};
