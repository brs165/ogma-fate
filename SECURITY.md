# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (ogma.net) | Active |
| Self-hosted forks | Maintainer's discretion |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Report via **GitHub private security advisory:**
`https://github.com/brs165/ogma-fate/security/advisories/new`

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

Expect acknowledgement within **72 hours** and a resolution timeline
within **7 days** for critical issues.

## Security Architecture

- **No backend.** Ogma has no server, no database, no authentication.
  All generation logic runs entirely in the browser via SvelteKit (adapter-static).
- **No data transmitted.** Session data lives in your browser's
  IndexedDB (Dexie 4). Nothing is sent to any server during normal use.
- **Multiplayer relay.** The optional sync server (`ogma-sync`) is a
  dumb WebSocket mirror — it stores the latest canvas snapshot for
  late-joining players and relays messages. It does not persist data
  beyond the active session and transmits nothing to third parties.
- **CDN dependencies.** Font Awesome 7.2 Free loads from jsDelivr with
  a version-pinned URL and is cached by the service worker for offline use.
  All other dependencies are bundled via Vite at build time.
- **Content Security Policy.** Set via `_headers` on the production
  Cloudflare Pages deployment.
- **No eval().** The codebase contains no `eval()` or `new Function()`.
  No `innerHTML` with user-supplied data.
