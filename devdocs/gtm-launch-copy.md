# WS-11 — Community Launch Copy

> Two deliverables: (1) r/FATErpg post, (2) blog post.
> Lena leads. Jordan reviews. Do not ship until the GitHub repo is public.

---

## Deliverable 1: r/FATErpg Post

**Title:** I built a free offline GM prep tool for Fate Condensed — 16 generators, 7 worlds, Prep Wizard, works without internet

**Body:**

Hey r/FATErpg,

I've been working on **Ogma** — a free, offline, browser-based generator suite for Fate Condensed GMs. After a few months of quiet development, it's finally ready to share.

**What it does:**

Pick a campaign world, pick a generator, click Roll. Everything that comes out is rules-accurate and ready to run.

- **16 generators** — Minor/Major NPCs, Scene Setup, Campaign Frame, Encounter, Adventure Seed, Compel, Challenge, Contest, Consequence, Faction, Complication, PC Backstory, Obstacle, Countdown, Constraint
- **7 campaign worlds** — The Long After (dying earth), Neon Abyss (cyberpunk), Shattered Kingdoms (dark fantasy), Void Runners (space western), The Gaslight Chronicles (Gothic horror), The Long Road (post-apocalypse), Dust and Iron (frontier western)
- **Connected chains** — generate an Adventure Seed, then click "Roll Scene for this location" or "Roll Faction for this seed." The tool links related generators so your prep builds on itself instead of producing disconnected cards.
- **Stunt suggester** — 196 world-appropriate stunts across 7 worlds, tagged with 14 semantic categories. When you generate an NPC, suggested stunts score against the NPC's high concept. Click "↩ Use this stunt" to swap it in.
- **Prep Wizard** — a 5-step guided flow (World → Players → Seed → Scene → NPC → Bundle) that ends with a ✓ Ready badge and a summary of your session pack. For GMs who freeze on a blank page.
- **Learn Fate in 7 interactive steps** — built-in tutorial with live 4dF dice rollers, D&D bridge callouts, and an annotated NPC example. If you're coming from D&D, this is for you.
- **Reference panel on every result** — What it is, For GM (running tips + invoke/compel examples), New here?, and D&D? tabs below every generated card. No pre-configuration. All depth levels always accessible.
- **Fully offline** — works without internet after first load. Service worker cached. Take it to conventions.
- **Fari export** — major NPCs export as `.fari.json` for Fari App.

**The rules accuracy bit** (since this is r/FATErpg):

I'm obsessive about FCon compliance. Stress boxes are all 1-point. The major NPC refresh formula is `max(1, 3 − max(0, stunts − 3))`. No "significant milestone" anywhere in the codebase. Consequence recovery requires a treatment roll before the timer starts. Named assertions run against these before every release.

**What I'd love from this community:**

This is the audience I built it for. If you run Fate Condensed and try it, I genuinely want to know:

- Does the generated content feel like it belongs in its world?
- Does the Learn section actually help a D&D player grok Fate?
- What's missing from the 16 generators?

**Links:**
- Live: https://brs165.github.io/ogma-fate
- Repo + CONTRIBUTING.md: https://github.com/brs165/ogma-fate

Thanks to the whole Fate community — Book of Hanz, the SRD team, r/FATErpg — for keeping this game alive and documented so thoroughly.

---

## Deliverable 2: Blog Post

**Title:** Building Ogma — An offline GM prep tool for Fate Condensed

**Slug:** ogma-offline-fate-condensed-gm-prep

**Tags:** fate-condensed, ttrpg, game-mastering, open-source, pwa

---

### The problem I kept running into

Every time I prepped a Fate Condensed session, I'd spend the first 20 minutes doing the same thing: generating NPCs by hand. Pick a concept, make it a high concept, think of a trouble, decide on 2–3 skills, write a stunt. Repeat for the villain, the informant, the rival, the incidental. By the time I'd sketched out the scene, I'd burned through most of my prep window.

There are NPC generators for D&D everywhere. For Fate Condensed — a system with distinct mechanical requirements (all 1-point stress boxes, the refresh formula, the specific 19-skill list) — there was nothing I trusted.

So I built one. Then 15 more.

---

### What Ogma is

Ogma is a free, offline-first GM prep tool for Fate Condensed. You pick a campaign world, pick a generator, click Roll. Every output is rules-accurate and ready to drop into a session.

The name is both a Celtic reference (Ogma, god of eloquence, the one who shaped language) and a backronym: **Offline Game Master's Aid**.

It runs in any browser. After the first load, it works without internet — fully cached via service worker. I use it at conventions. I use it on planes. I use it in the 10 minutes before a session when someone texts "we're starting early."

---

### The rules accuracy problem

Building a Fate generator that's mechanically correct is harder than it sounds. The system family has three major editions (Condensed, Core, FAE) plus toolkits, and they differ on critical mechanics:

- **Stress boxes**: Fate Core uses escalating values (1/2/3/4). Fate Condensed uses all 1-point boxes. Getting this wrong doesn't just feel bad — it fundamentally changes how combat works.
- **Milestones**: "Significant milestone" doesn't exist in Condensed. It's a Core/FAE term. Every piece of generated content has a named assertion checking for this string.
- **Refresh formula**: Major NPC refresh is `Math.max(1, 3 − Math.max(0, stunts.length − 3))`. Hardcoding it was the first production bug we caught.
- **Consequence recovery**: You can't just say "mild consequence clears after a scene." The treatment overcome roll comes first. FCon SRD p.30.

Before every release, 72 named assertions run. They check these rules. The smoke test runs all 16 generators across all 7 worlds — 112 combinations — in Node.js. Zero undefs, zero crashes, every time.

---

### The teaching problem

Most Fate generators I'd seen assumed you already knew the game. But the GMs who need generators most are often the ones who just picked up the book, or who are converting from D&D.

So Ogma includes a **Learn Fate in 7 steps** guide — built into the tool, not a separate wiki page. It has live 4dF dice rollers embedded at every decision point. Every step has a "Coming from D&D?" callout that does a specific, accurate translation (not "it's like D&D but narrative"). Step 6 shows a fully annotated example NPC where every stunt design choice is explained.

The goal: by the time a new GM finishes the 7 steps, they've rolled dice 12 times, seen a compel in action, and understood why "Fights Before Thinking" is a better trouble than "Aggressive."

---

### What's next

The tool is in active development. Seven campaign worlds. Seven wiki pages. A Quick Find bar (`/` key) that searches generators, worlds, and help pages. Sensory tags on scene aspects (every generated scene aspect now includes a sense cue — sight, sound, smell, touch — for the GM to frame the scene).

The next milestone is dogfooding — I want 3–5 Fate GMs to actually prep and run sessions with Ogma and tell me what breaks, what's missing, what generates content that doesn't belong in the world's voice.

If you run Fate Condensed and want to be a tester: the repo is open, CONTRIBUTING.md covers exactly how to give feedback, and issues are open.

---

*Ogma is free, open source (CC BY 3.0 for the Fate SRD content), and built on the work of the entire Fate community. Randy Oest and the fate-srd.com team deserve the first thank-you.*
