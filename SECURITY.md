# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (ogma.net) | ✅ Active |
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
  All generation logic runs entirely in the browser.
- **No data transmitted.** Session data lives in your browser's
  IndexedDB. Nothing is sent to any server during normal use.
- **Multiplayer relay.** The optional sync server (`ogma-sync`) is a
  dumb WebSocket mirror — it stores the latest canvas snapshot for
  late-joining players and relays messages. It does not persist data
  beyond the active session and transmits nothing to third parties.
- **CDN dependencies.** React 18.2.0 and Dexie 4.0.10 load from
  cdnjs with version-pinned URLs and SRI integrity hashes.
- **Content Security Policy.** Set via `_headers` on the production
  Cloudflare Pages deployment.
- **No eval().** The codebase contains no `eval()` or `new Function()`
  usage. `innerHTML` is used only in `core/intro.js` for typewriter
  animation with hardcoded content strings, never user-supplied data.
