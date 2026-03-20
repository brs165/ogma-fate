# Product Operating Council — GTM Strategy
## Ogma: A Fate Condensed Generator Suite

*First session. POC meets the delivery team. Priya, Lena, and Jordan have reviewed the codebase, the devdocs, the wiki, the about page, and the backlog. This document is their opening analysis and GTM strategy draft.*

*Date: 2026.03.71*

---

## The Meeting — POC Meets the Delivery Team

**Jordan opens:**

Thanks for the welcome. We've spent time with the codebase, the devdocs, and about.html. We're not here to tell the delivery team what to build. We're here to make sure that what gets built is the right thing — and that the right people find out about it.

Let's be direct about what we see. Ogma is a technically excellent project. The QA harness, the architecture discipline, the seven distinct campaign voices, the Fari export pipeline — this is a team that cares deeply about craft. That's rare. But craft alone doesn't build a community. A community needs a shared sense of *why*.

We also want to flag something about the "Feature Factory" pattern. Looking at the backlog: the sprint roadmap is well-structured, but almost every item is an engineering or UX refinement. There's no discovery work. No evidence that anyone has sat across from a GM running Fate Condensed and watched them prep a session. That's not a criticism — it's an opportunity. But it needs to change before we write more code.

**Priya:**

I'm going to lead with the Four Big Risks analysis, because that's where we have to start. Not with features. Not with what's technically interesting. With the evidence that users actually want this.

**Lena:**

After Priya's risk analysis, I'll walk through the market narrative — why the current way of working for Fate GMs is broken, and why Ogma is the inevitable better way. Then I'll define the winnable segment. The Fate community is small. That's not a disadvantage — it's a targeting opportunity.

**Jordan:**

I'll close with the community architecture. The mission question. And I'll propose a contributor pathway that gets someone from "I found this on GitHub" to "I own a piece of this project."

---

## 1. The Cagan Pillar — Discovery-Led GTM

### The Four Big Risks for Ogma (OSS Context)

**Value Risk — Will they actually use it at the table?**

This is the hardest risk to validate because the problem it's solving is invisible to the builder. The delivery team has built a technically impressive generator suite. But the critical question is: do Fate Condensed GMs experience the problem Ogma solves — prep friction — as their primary pain point?

Evidence of the risk: Fate Condensed is explicitly designed to be low-prep. The SRD says GMs should improvise. The community norm is "run lean, improv heavy." A significant fraction of Fate GMs may feel they *don't need* a prep tool because improvisation is a feature, not a bug.

This doesn't mean Ogma has no value — it means the value proposition may need repositioning. Not "prep faster" but "improvise better" or "improv with confidence." The tool doesn't replace prep; it gives the GM richer material to improvise *from*.

**Usability Risk — Can they figure out how to use it in the middle of a session?**

The 16 generators, the FP tracker, the Fari export, the Field Dossier cards — this is a feature-rich tool. Feature-rich tools are hard to use under session pressure. A GM in the middle of a chase scene doesn't have time to find the right generator. The usability risk is not "does the UI work" — it's "does it work at the specific moment of need: mid-session, low attention, high pressure."

**Feasibility Risk — LOW.**

The no-build-step architecture, the service worker, the 112/112 test suite — this team has already validated feasibility. The offline-first constraint is actually a *differentiator*, not a limitation. No other Fate tool runs from a local file with zero dependencies. This is solved.

**Viability Risk — The sustainability gap.**

This is an open-source project with no stated funding model, no stated contributor pipeline, no governance docs. The viability risk is: what happens when the current maintainer has a three-month crunch and can't respond to issues? The community built around a tool that goes dark doesn't survive. Viability for OSS means community sustainability, not revenue.

---

### 3 Discovery Experiments for Value Risk Validation

**Experiment 1 — The Session Zero Intercept**

*Hypothesis:* GMs who run Session Zero (the wizard is already built) represent the highest-intent user segment. If they adopt it, the tool has real value.

*Method:* Post in r/FATErpg, the Fate Patreon Discord, and the Evil Hat community Slack: "Running Session Zero this weekend? I built a guided wizard. 5-minute try, 2-minute feedback survey." Track: do they complete the wizard? Do they use the output at the table? What do they skip?

*Falsification:* If fewer than 30% of users who start the wizard complete it, the usability risk is high and the wizard needs a redesign sprint before GTM.

*Time to run:* 2 weeks. Zero code changes needed.

---

**Experiment 2 — The Mid-Session NPC Test**

*Hypothesis:* The highest-value moment for Ogma is a GM who needs an NPC *right now* during a live session — not during prep. If users can generate a playable Minor NPC in under 15 seconds without reading the docs, the usability risk is solved for that core use case.

*Method:* Recruit 5 Fate GMs from the community. Give them the URL. No instructions. Ask them to "generate an NPC for a chase scene that just went sideways." Time them. Watch where they get stuck.

*What we're measuring:* Time-to-first-useful-result. Not "do they like the tool" — do they get something they can use at the table before the moment passes.

*Falsification:* If nobody generates a usable result in under 30 seconds without help, the generator UI needs a "fast mode" — one-button obvious entry point with zero navigation required.

*Time to run:* 1 week setup, 1 week sessions.

---

**Experiment 3 — The Shareable Link Demand Test**

*Hypothesis:* BL-06 (shareable result links) was built. The Value Risk question: do GMs actually share Ogma results with their players or co-GMs? If shareable links are being used, the tool has moved from "GM prep aid" to "table communication tool" — a significantly stronger value proposition.

*Method:* Enable link-click analytics for one month. Not user tracking — just "was a ?seed= URL opened by a second browser session?" Count raw seed link opens vs. seed link origins. If someone generates a result and shares the link and someone else opens it: confirmed shared use.

*Falsification:* If fewer than 5% of generated results ever get their seed URL opened by a second session, the shareable links feature is solving a problem nobody has, and its prominence in the UI is wasted space.

*Time to run:* Passive — 30 days of observation with zero user contact.

---

## 2. The Lauchengco Pillar — Market Narrative

### The Storyteller: Why the Current Way is Broken

Here is the market story. Not what Ogma is. Why the world needed it.

---

*The scene: it's Thursday night. Your Fate Condensed session starts in two days. You open your notes. You have a half-sketched NPC with no stress track. You have a "faction" that's really just a name you liked. You have a scene location with no aspects because you ran out of time during the last session.*

*You go to the Fate SRD. You re-read the NPC creation rules. You spend 45 minutes making one Major NPC who feels mechanical and generic because you had to invent everything from scratch under time pressure.*

*You show up Saturday with a NPC who has a Great (+4) Fight and two aspects you're not sure how to compel. Your players spend the session poking at your world's edges. You improvise frantically. The NPC doesn't feel real. The scene doesn't have texture.*

*The problem isn't that you don't know the rules. The problem is that Fate Condensed asks you to create the world from whole cloth — and creation under pressure produces thin material.*

*Ogma doesn't replace your creativity. It gives you raw material that's already thematically calibrated, rules-accurate, and ready to use. You press Space. A Major NPC appears with a High Concept that fits your world's voice, a Trouble you can immediately compel, skills that make sense for the genre, and a GM tip that tells you exactly how to run this character. In one second.*

*The world was waiting for a Fate Condensed prep tool that understood the game deeply enough to be trusted at the table. That tool now exists.*

---

### The Strategist: The Winnable Segment

**Segment hypothesis:** The winnable first segment is not "all Fate Condensed GMs." It's one specific niche:

> **"Experienced RPG GMs who are Fate Condensed-curious but not yet Fate Condensed-fluent."**

This is the D&D Convert segment — Marcus from our persona stack. It is the largest addressable adjacent audience (the D&D 5e player base is enormous relative to the Fate base), and it is the segment with the highest motivation to find a tool that reduces the learning curve.

**Why this segment is winnable:**
1. They already have a digital tool habit (D&D Beyond, Foundry, Fari). Ogma fits that pattern.
2. They are not dogmatic about improv-only play — they come from a prep-heavy culture and are looking for Fate to fit their workflow.
3. The D&D Transition wiki page, the dnd_notes tab in results, and the D&D Convert help level are all already built. The product already has a moat here — we just haven't told the story.

**Why not "native Fate GMs" as first segment?**
Native Fate GMs are sophisticated improvisers who view prep tools with skepticism. They are harder to convert and more likely to resist the framing. They are the *second segment* — once the D&D Convert segment has validated the tool's table value, native Fate GMs will see the usage data and re-evaluate. This is the classic adjacent-segment entry strategy.

**How to dominate:**
- One blog post / community post targeted at "D&D GMs trying Fate for the first time" — "Here's how I prepped my first Fate session in 10 minutes"
- The help/dnd-transition.html and help/new-to-ogma.html pages are already perfect landing content for this segment
- Pin the D&D Transition page to the landing page hero section for this audience

---

## 3. The Idiodi Pillar — Empowered Community

### Vision & Purpose: The Mission

*Feature lists don't inspire Saturday contributions. This does:*

---

**The Mission of Ogma:**

*Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.*

*The table is where the story happens. Ogma clears the path to get there.*

---

This mission is falsifiable. In 18 months: if GMs are running Fate Condensed sessions with less prep friction — if we have evidence that Ogma materially reduced the gap between "I want to run Fate" and "I ran a great session" — the mission is being fulfilled. If we don't have that evidence, we're building features, not fulfilling a mission.

The mission also defines what Ogma is *not*: it is not a VTT, not a campaign management tool, not a character builder. It is a path-clearing tool. Every feature should be evaluated against: "does this reduce the distance between idea and great session?"

---

### Empowerment: The Contributor Experience Design

The current state of contributor access: zero. No `CONTRIBUTING.md`, no governance docs, no "good first issue" labels, no contributor pathway. The delivery team is a closed system. This is sustainable for a solo project; it is fatal for an OSS community.

The empowered contributor experience has five stages. Each stage has a defined outcome, a clear next step, and a recognition mechanism.

**Stage 1 — Discovery:** A Fate GM finds Ogma via a community post. They read the README. The goal: understand what it is in 60 seconds. *Success criterion: they open index.html.*

**Stage 2 — First Use:** They run a session with Ogma. The tool works. They trust it. *Success criterion: they return to use it again.*

**Stage 3 — First Contribution (Content):** They notice a table entry that doesn't fit the campaign world's voice. There is a clear path: `devdocs/content-authoring.md` explains exactly how to add an entry, the data schema, the quality bar. They submit a PR. A maintainer responds within 7 days. *Success criterion: their PR is merged.*

**Stage 4 — Ownership (Campaign Contributor):** They contribute a full campaign world — a new `data/[world].js` file with 1,500+ entries. They go through the 9-step new-world process. Their world ships in the next release. Their name is in the changelog. *Success criterion: they recruit someone else.*

**Stage 5 — Stewardship:** They become a regular reviewer of new campaign PRs. They hold the editorial bar for their campaign world. *Success criterion: they catch a rules error before it ships.*

**What needs to be built for this to work:**
1. `CONTRIBUTING.md` at the project root — links to `devdocs/content-authoring.md`, explains the schema, states the quality bar, sets response time expectations
2. GitHub issue templates: "New table entry", "New campaign world", "Bug report", "Feature request (must include discovery evidence)"
3. "Good first issue" labels on any table entry that could be improved
4. A `CHANGELOG.md` contributors section — every contributor named by their contribution

None of this requires code. It requires 4 hours of documentation work. Jordan owns it.

---

## 4. The North Star Metric

**Rejected metrics (vanity):**
- GitHub Stars — measures discovery, not value
- npm downloads — not applicable (offline-first)
- Wiki page views — measures traffic, not outcomes
- Discord member count — measures interest, not use

**The North Star Metric:**

> **Sessions Run With Ogma**

Defined as: a unique browser session on a campaign page that generates ≥3 results and remains active for ≥15 minutes.

*Why this works:* It measures actual GM behaviour at the table. It distinguishes "someone opened it and bounced" from "someone used it to run a session." It is not perfectly measurable without analytics (UX-18 is parked), but it is the right definition of value even if the measurement is approximate.

**Proxy metric until analytics ship:**

> **Shareable Link Opens (Seed URL second opens)**

Defined as: Experiment 3 above — a ?seed= URL opened by a session that did not generate it. Each shared link open is evidence that Ogma produced something a GM wanted to show someone else. That is the minimum viable evidence of value.

**The test:** In 6 months, if the proxy metric is flat or declining, we are not creating value. If it is growing, we are. Every feature decision should be evaluated against: "will this increase Sessions Run With Ogma?"

---

## POC Recommendations for Next Sprint

These are not code requests. They are discovery and community investments that should run *in parallel* with the engineering sprint.

| ID | Type | What | Owner | Effort |
|---|---|---|---|---|
| GTM-01 | Discovery | Run Experiment 1: Session Zero Intercept post on r/FATErpg + Fate Discord | Priya + Jordan | 1 day |
| GTM-02 | Discovery | Run Experiment 3: Enable proxy metric — count ?seed= URL second opens passively | Priya | 0 code (observation only) |
| GTM-03 | Community | Write `CONTRIBUTING.md` at project root | Jordan | 4 hours |
| GTM-04 | Narrative | Write one community post: "How I prepped my first Fate session in 10 minutes" — targets D&D Convert segment | Lena | 1 day |
| GTM-05 | Strategy | Add mission statement to `README.md` hero and `about.html` | Lena + Jordan | 2 hours |
| GTM-06 | Discovery | Run Experiment 2 (NPC intercept) — recruit 5 Fate GMs for 30-min sessions | Priya | 2 weeks |

None of these delay the engineering roadmap. They run alongside it.

---

## Closing Statement — Jordan

*To the delivery team:*

You have built something rare. An offline-first, rules-accurate, craft-level tool for a community that deserves better tooling than it has. The wiki is excellent. The campaign voices are specific in a way most AI-generated tools are not.

What you don't have yet is the community that deserves to own this with you. That's what we're here to build.

The mission is not "ship features." The mission is: *every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.*

That mission is worth spending a Saturday on.

---

*Document maintained by the Product Operating Council.*
*GTM-01 through GTM-06 submitted to devdocs/BACKLOG.md as Tier 2 items.*
*Next POC review: 2026.09.01 parking lot.*
