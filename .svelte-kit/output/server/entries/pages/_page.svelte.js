import "clsx";
import { b as attr, e as escape_html, c as ensure_array_like, d as stringify, f as attr_style } from "../../chunks/index2.js";
function Landing($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let camps;
    let demoNpcs = [];
    let joinCode = "";
    const CAMPAIGN_INFO = {
      thelongafter: {
        name: "The Long After",
        icon: "◈",
        genre: "Sword & Planet",
        vibes: "Nausicaä · Thundarr · Book of the New Sun",
        hook: "Warlords and ruined gods in the wreckage of civilisation"
      },
      cyberpunk: {
        name: "Neon Abyss",
        icon: "⬡",
        genre: "Cyberpunk",
        vibes: "Neuromancer · Blade Runner · Edgerunners",
        hook: "Chrome, corp-blood, and the city that eats its own"
      },
      fantasy: {
        name: "Shattered Kingdoms",
        icon: "✦",
        genre: "Dark Fantasy",
        vibes: "Malazan · Black Company · Witcher",
        hook: "Grim blades, older magic, and the weight of history"
      },
      space: {
        name: "Void Runners",
        icon: "◯",
        genre: "Space Western",
        vibes: "Firefly · The Expanse · Cowboy Bebop",
        hook: "Hard vacuum, hard choices, and no one coming to help"
      },
      victorian: {
        name: "The Gaslight Chronicles",
        icon: "⊕",
        genre: "Gothic Horror",
        vibes: "Penny Dreadful · From Hell · The Prestige",
        hook: "Gaslight and secrets and things that should not exist"
      },
      postapoc: {
        name: "The Long Road",
        icon: "◻",
        genre: "Post-Apocalypse",
        vibes: "Mad Max · Last of Us · Station Eleven",
        hook: "The world already ended. Survive what comes next"
      },
      western: {
        name: "Dust and Iron",
        icon: "◈",
        genre: "Frontier Western",
        vibes: "Blood Meridian · Deadwood · True Grit",
        hook: "Frontier justice. Railroad money and the weight of the old war"
      },
      dVentiRealm: {
        name: "dVenti Realm",
        icon: "⬟",
        genre: "High Fantasy",
        vibes: "D&D 5e · Pathfinder · Dragon Age",
        hook: "The Senate collapsed. The Vaults are still here. So is everything sealed inside them."
      }
    };
    camps = (function() {
      const arr = Object.keys(CAMPAIGN_INFO).map((id) => ({ id, ...CAMPAIGN_INFO[id] }));
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    })();
    $$renderer2.push(`<div class="land-shell"><a href="#main" class="skip-link">Skip to main content</a> <header class="land-topnav topbar"><a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a> <div class="topbar-spacer" style="flex:1"></div> <div class="topbar-status"><button class="btn btn-icon btn-ghost"${attr("aria-label", "Switch to light mode")}${attr("title", "Light mode")} style="width:44px;height:44px">${escape_html("☀️")}</button></div></header> <main id="main"><div class="land-hero"><div class="land-hero-inner"><p class="land-hero-eyebrow"><span style="white-space:nowrap"><strong class="ogma-letter" style="--i:0">O</strong>n-demand</span> <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:1">G</strong>enerator for</span> <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:2">M</strong>asterful</span> <span style="white-space:nowrap"><strong class="ogma-letter" style="--i:3">A</strong>dventures</span></p> <h1 class="land-hero-title">Your session is in two hours. <br/> <span class="land-hero-sub">Pick a world. Roll. Play.</span></h1> <p class="land-hero-desc">Rules-accurate NPCs, scenes, and encounters — generated in one click, ready for the table.</p> <p class="land-hero-desc" style="font-size:var(--text-sm);color:var(--text-muted);margin-top:4px">Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.</p> <div class="land-hero-pills"><span class="land-hero-pill">📴 Fully offline</span> <span class="land-hero-pill">🔓 Free forever</span> <span class="land-hero-pill">🖨 Print-ready</span> <span class="land-hero-pill">⚡ One click</span></div> <div class="land-hero-ctas"><a href="/campaigns/fantasy" class="land-cta-primary" aria-label="Start with a world">🎲 Pick a World &amp; Generate</a></div></div></div> <div class="land-join-section"><div class="land-worlds-inner"><h2 class="land-section-heading">Join a Table</h2> <p class="land-section-sub">Your GM is running a live session. Enter the room code they shared to join.</p> <div class="land-join-form"><input class="land-join-input" type="text" placeholder="Room code \\u2014 e.g. A3KX"${attr("value", joinCode)} maxlength="6" aria-label="Room code" spellcheck="false"/> <button class="btn land-join-btn"${attr("disabled", joinCode.trim().length === 0, true)} aria-label="Join table">Join →</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="land-worlds-section" id="worlds"><div class="land-worlds-inner"><h2 class="land-section-heading">Choose your world</h2> <div class="land-worlds-grid"><!--[-->`);
    const each_array = ensure_array_like(camps);
    for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
      let camp = each_array[idx];
      $$renderer2.push(`<a${attr("href", `/campaigns/${stringify(camp.id)}`)} class="land-world-card"${attr("data-campaign", camp.id)}${attr_style(`animation-delay:${stringify(idx * 0.05)}s;position:relative;overflow:hidden`)}><div class="land-world-card-accent"></div> <div class="land-world-card-body"><div class="land-world-icon">${escape_html(camp.icon)}</div> <div class="land-world-info"><div class="land-world-name">${escape_html(camp.name)}</div> <div class="land-world-genre">${escape_html(camp.genre)}</div> <div class="land-world-hook">${escape_html(camp.hook)}</div></div> <div class="land-world-arrow">›</div></div> <div class="land-world-footer"><span class="land-world-vibes">${escape_html(camp.vibes)}</span></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="land-npc-demo-section"><div class="land-worlds-inner"><div class="land-npc-demo-hdr"><div><h2 class="land-section-heading" style="margin-bottom:4px">Every NPC is ready to run.</h2> <p class="land-npc-demo-sub">High concept, trouble, top skill, and a stunt — rules-accurate, fiction-first.</p></div> <button class="btn btn-ghost land-npc-shuffle-btn" aria-label="Show three different NPCs">🎲 Shuffle</button></div> <div class="land-npc-demo-grid"><!--[-->`);
    const each_array_1 = ensure_array_like(demoNpcs);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let npc = each_array_1[i];
      $$renderer2.push(`<div class="land-npc-card"><div class="land-npc-world"><span aria-hidden="true">${escape_html(npc.icon)}</span> ${escape_html(npc.world)}</div> <div class="land-npc-concept">${escape_html(npc.concept)}</div> <div class="land-npc-trouble"><span class="land-npc-label">Trouble</span> <span class="land-npc-trouble-text">${escape_html(npc.trouble)}</span></div> <div class="land-npc-row"><div class="land-npc-skill"><span class="land-npc-label">Top Skill</span> <span>${escape_html(npc.skill)}</span></div></div> <div class="land-npc-stunt"><span class="land-npc-label">Stunt</span> <span class="land-npc-stunt-text">${escape_html(npc.stunt)}</span></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></main> <footer class="land-footer"><div class="land-footer-inner"><div style="font-style:italic;color:var(--text-muted);margin-bottom:4px"><strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures</div> <div style="margin-bottom:4px">Fate™ is a trademark of Evil Hat Productions, LLC. Released under CC BY 3.0.</div></div></footer></div>`);
  });
}
function _page($$renderer) {
  Landing($$renderer);
}
export {
  _page as default
};
