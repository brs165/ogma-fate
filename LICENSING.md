# Licensing & Attribution — Ogma

The authoritative source for Fate SRD licensing: **https://fate-srd.com/official-licensing-fate**
Fate SRD hosted and maintained by **Randy Oest (Amazing Rando Design)** at https://fate-srd.com/

---

## This Work

**Ogma — A Fate Condensed Generator Suite** — all original code, generator logic, campaign data tables, NPC names, aspects, scene elements, and original prose — is released under the **Creative Commons Attribution 3.0 Unported license**.

https://creativecommons.org/licenses/by/3.0/

You are free to share, adapt, and build upon this work, including commercially, with credit. See `license.html` for the full terms and all required attribution blocks.

This project is not affiliated with, endorsed by, or sponsored by Evil Hat Productions, LLC or Wizards of the Coast, LLC.

---

## Required Fate SRD Attributions (CC BY 3.0)

These blocks must be included verbatim in any adapted or redistributed work.

### Fate Condensed
This work is based on Fate Condensed (found at http://www.faterpg.com/), a product of Evil Hat Productions, LLC, developed, authored, and edited by PK Sullivan, Ed Turner, Leonard Balsera, Fred Hicks, Richard Bellingham, Robert Hanz, Ryan Macklin, and Sophie Lagacé, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

### Fate Core System and Fate Accelerated Edition
This work is based on Fate Core System and Fate Accelerated Edition (found at http://www.faterpg.com/), products of Evil Hat Productions, LLC, developed, authored, and edited by Leonard Balsera, Brian Engard, Jeremy Keller, Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

### Fate System Toolkit
This work is based on the Fate System Toolkit (found at http://www.faterpg.com/), a product of Evil Hat Productions, LLC, developed, authored, and edited by Robert Donoghue, Brian Engard, Brennan Taylor, Mike Olson, Mark Diaz Truman, Fred Hicks, and Matthew Gandy, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

### Fate Adversary Toolkit
This work is based on the Fate Adversary Toolkit SRD (found at http://www.faterpg.com/), a product of Evil Hat Productions, LLC, developed, authored, and edited by Brian Engard, Lara Turner, Joshua Yearsley, and Anna Meade, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

### The Book of Hanz
This work is based on The Book of Hanz (found at https://bookofhanz.com/), a product of Amazing Rando Design, developed, authored, and edited by Robert Hanz, John Adamus, and Randy Oest, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

---

## D&D SRD 5.2.1 (CC BY 4.0)

The dVenti Realm campaign world draws terminology and creature concepts from the D&D 5e SRD.

Dungeons & Dragons 5th Edition System Reference Document v5.2.1 © 2025 Wizards of the Coast LLC.
Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).
Available at: https://www.dndbeyond.com/srd

Dungeons & Dragons®, D&D®, and related trademarks are property of Wizards of the Coast LLC.
This project is not affiliated with or endorsed by Wizards of the Coast LLC.

---

## Open-Source Libraries

| Library | Version | License | Source |
|---------|---------|---------|--------|
| React + ReactDOM | 18.2.0 | MIT — © Meta Platforms, Inc. | github.com/facebook/react |
| Dexie.js | 4.0.10 | Apache 2.0 — © David Fahlander | github.com/dexie/Dexie.js |
| PartyKit / partysocket | 1.x API | MIT — © Sunil Pai / Cloudflare Inc. | github.com/partykit/partykit |

Icons: Unicode system emoji only. No third-party icon font loaded.

**Note on `assets/js/partysocket.js`:** This is an 86-line clean-room implementation of the `partysocket` WebSocket client API, written for Ogma because the original npm package ships ESM+CJS only (no browser-script UMD build). It is not a copy or derivative of the original source — it reimplements the same interface (`new PartySocket({host,room,query})`, `send()`, `close()`, `addEventListener()`) using only standard browser WebSocket APIs. The original `partysocket` package is MIT-licensed and maintained by the PartyKit team. No partysocket source code is included in this repository.

---

## Trademark Notices

Fate™ is a trademark of Evil Hat Productions, LLC.
The Fate Core font is © Evil Hat Productions, LLC and is used with permission.
The Four Actions icons were designed by Jeremy Keller.

Dungeons & Dragons® and D&D® are trademarks of Wizards of the Coast LLC.

---

## With Thanks

- **fate-srd.com** — Randy Oest (Amazing Rando Design) — canonical Fate SRD reference, Silver ENnie winner
- **Fari App** (fari.app) — René-Pier Deshaies-Gélinas — free open-source VTT, Ogma export target
- **Evil Hat Productions** — for open-licensing Fate under CC BY 3.0
- **Robert Hanz** — The Book of Hanz, the clearest Fate resource available

---

## If You Adapt This Work

CC BY 3.0 requires:
1. Credit Ogma as the upstream source
2. Include all Fate SRD attribution blocks above, verbatim, at the same text size as other copyright text
3. Link to CC BY 3.0: https://creativecommons.org/licenses/by/3.0/
4. Indicate what you changed

You do NOT need to: open-source your work, license it under CC BY 3.0, or seek permission.
