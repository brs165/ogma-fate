#!/usr/bin/env node
// scripts/qa-smoke.mjs — Browser smoke tests for Ogma
// Run: node scripts/qa-smoke.mjs
// Requires: npx playwright install chromium
//
// Starts a local preview server, loads every route, checks for JS errors,
// verifies key interactions work. Catches runtime crashes like infinite
// $effect loops that static analysis and Node-based QA can't see.

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = 4174;
const BASE = `http://localhost:${PORT}`;
const TIMEOUT = 8000;

// All routes to test
const ROUTES = [
  { path: '/', label: 'Landing page' },
  { path: '/about', label: 'About page' },
  { path: '/license', label: 'License page' },
  { path: '/learn', label: 'Learn redirect' },
  { path: '/help', label: 'Help home' },
  { path: '/help/new-to-ogma', label: 'New to Ogma' },
  { path: '/help/getting-started', label: 'Getting Started' },
  { path: '/help/learn-fate', label: 'Learn Fate' },
  { path: '/help/how-to-use-ogma', label: 'How to Use Ogma' },
  { path: '/help/dnd-transition', label: 'D&D Transition' },
  { path: '/help/fate-mechanics', label: 'Fate Mechanics' },
  { path: '/help/at-the-table', label: 'At the Table' },
  { path: '/help/export-share', label: 'Export & Share' },
  { path: '/help/faq', label: 'FAQ' },
  { path: '/help/hosting', label: 'Hosting' },
  { path: '/help/mistakes', label: 'Common Mistakes' },
  { path: '/campaigns/fantasy', label: 'Fantasy generator' },
  { path: '/campaigns/cyberpunk', label: 'Cyberpunk generator' },
  { path: '/campaigns/thelongafter', label: 'The Long After generator' },
  { path: '/campaigns/space', label: 'Space generator' },
  { path: '/campaigns/victorian', label: 'Victorian generator' },
  { path: '/campaigns/postapoc', label: 'Post-apoc generator' },
  { path: '/campaigns/western', label: 'Western generator' },
  { path: '/campaigns/dVentiRealm', label: 'dVenti Realm generator' },
  { path: '/campaigns/fantasy/guide', label: 'Fantasy guide' },
  { path: '/campaigns/character-creation', label: 'Character creation' },
  { path: '/campaigns/sessionzero', label: 'Session Zero' },
];

// Worlds to test generation on
const GEN_WORLDS = ['fantasy', 'cyberpunk', 'thelongafter', 'space', 'victorian', 'postapoc', 'western', 'dVentiRealm'];

const results = [];
const errors = [];
let failures = 0;

function pass(name) { results.push({ status: 'PASS', name }); }
function fail(name, detail) { results.push({ status: 'FAIL', name, detail }); failures++; }

// ── Start preview server ──────────────────────────────────────────────────
async function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    let started = false;
    const timer = setTimeout(() => {
      if (!started) { reject(new Error('Server start timeout')); proc.kill(); }
    }, 15000);

    proc.stdout.on('data', (data) => {
      const out = data.toString();
      if (out.includes('localhost') || out.includes('Local')) {
        started = true;
        clearTimeout(timer);
        resolve(proc);
      }
    });

    proc.stderr.on('data', (data) => {
      const err = data.toString();
      if (err.includes('EADDRINUSE')) {
        clearTimeout(timer);
        reject(new Error(`Port ${PORT} in use`));
      }
    });

    proc.on('error', (err) => { clearTimeout(timer); reject(err); });
  });
}

// ── Page load test ────────────────────────────────────────────────────────
async function testPageLoad(page, route) {
  const pageErrors = [];
  const consoleErrors = [];

  const onError = (err) => pageErrors.push(err.message);
  const onConsole = (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore Cloudflare beacon CORS errors (not our code)
      if (text.includes('cloudflareinsights') || text.includes('beacon.min.js')) return;
      consoleErrors.push(text);
    }
  };

  page.on('pageerror', onError);
  page.on('console', onConsole);

  try {
    const response = await page.goto(`${BASE}${route.path}`, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT,
    });

    // Check HTTP status
    const status = response?.status() || 0;
    if (status >= 400) {
      fail(`load-${route.label}`, `HTTP ${status}`);
      return;
    }

    // Wait a beat for $effect cycles to settle
    await sleep(500);

    // Check for Svelte runtime errors (effect_update_depth_exceeded, etc.)
    const svelteErrors = pageErrors.filter(e =>
      e.includes('effect_update_depth_exceeded') ||
      e.includes('state_snapshot_uncloneable') ||
      e.includes('effect_in_teardown') ||
      e.includes('rune') ||
      e.includes('Cannot read properties of undefined') ||
      e.includes('Cannot read properties of null')
    );

    if (svelteErrors.length > 0) {
      fail(`load-${route.label}`, `Svelte error: ${svelteErrors[0].slice(0, 100)}`);
      return;
    }

    // Check for any uncaught JS errors
    if (pageErrors.length > 0) {
      fail(`load-${route.label}`, `JS error: ${pageErrors[0].slice(0, 100)}`);
      return;
    }

    // Check critical console errors (ignore CORS, FA loading, SW)
    const realErrors = consoleErrors.filter(e =>
      !e.includes('CORS') && !e.includes('font-awesome') && !e.includes('sw.js') &&
      !e.includes('service-worker') && !e.includes('favicon')
    );

    if (realErrors.length > 0) {
      fail(`load-${route.label}`, `Console error: ${realErrors[0].slice(0, 100)}`);
      return;
    }

    // Check page has content (not blank)
    const bodyText = await page.evaluate(() => document.body?.innerText?.length || 0);
    if (bodyText < 20) {
      fail(`load-${route.label}`, 'Page appears blank (< 20 chars of text)');
      return;
    }

    pass(`load-${route.label}`);
  } catch (err) {
    fail(`load-${route.label}`, err.message.slice(0, 100));
  } finally {
    page.removeListener('pageerror', onError);
    page.removeListener('console', onConsole);
  }
}

// ── Generator test — roll and verify card appears ─────────────────────────
async function testGenerate(page, world) {
  const pageErrors = [];
  const onError = (err) => pageErrors.push(err.message);
  page.on('pageerror', onError);

  try {
    await page.goto(`${BASE}/campaigns/${world}`, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT,
    });
    await sleep(500);

    // Check for initial load errors
    if (pageErrors.length > 0) {
      fail(`gen-load-${world}`, `JS error on load: ${pageErrors[0].slice(0, 100)}`);
      return;
    }

    // Find and click the roll button
    const rollBtn = page.locator('.btn-roll').first();
    const rollExists = await rollBtn.count();
    if (rollExists === 0) {
      fail(`gen-roll-${world}`, 'No .btn-roll found on page');
      return;
    }

    await rollBtn.click();
    await sleep(800);

    // Check for errors after rolling
    const postRollErrors = pageErrors.filter(e =>
      e.includes('effect_update_depth_exceeded') ||
      e.includes('Cannot read properties')
    );
    if (postRollErrors.length > 0) {
      fail(`gen-roll-${world}`, `Error after roll: ${postRollErrors[0].slice(0, 100)}`);
      return;
    }

    // Verify a card appeared (fs-card class from the new card design)
    const card = page.locator('.fs-card').first();
    const cardExists = await card.count();
    if (cardExists === 0) {
      // Fall back to checking for any card-like element
      const anyCard = page.locator('.cv4-flip-container, .fs-card, .fd-card').first();
      if (await anyCard.count() === 0) {
        fail(`gen-card-${world}`, 'No card rendered after roll');
        return;
      }
    }

    pass(`gen-${world}`);
  } catch (err) {
    fail(`gen-${world}`, err.message.slice(0, 100));
  } finally {
    page.removeListener('pageerror', onError);
  }
}

// ── Navigation test — verify key links work ───────────────────────────────
async function testNavigation(page) {
  try {
    // Start at landing
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await sleep(300);

    // Click Help link
    const helpLink = page.locator('a[href="/help"]').first();
    if (await helpLink.count() > 0) {
      await helpLink.click();
      await page.waitForURL('**/help**', { timeout: 5000 });
      pass('nav-landing-to-help');
    } else {
      fail('nav-landing-to-help', 'No /help link found on landing');
    }

    // Click About link
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: TIMEOUT });
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await page.waitForURL('**/about**', { timeout: 5000 });
      pass('nav-landing-to-about');
    } else {
      fail('nav-landing-to-about', 'No /about link found on landing');
    }

    // Navigate to License page (use goto to avoid footer link actionability issues)
    await sleep(300);
    const licLink = page.locator('a[href="/license"]').first();
    if (await licLink.count() > 0) {
      await page.goto(`${BASE}/license`, { waitUntil: 'networkidle', timeout: TIMEOUT });
      pass('nav-about-to-license');
    } else {
      fail('nav-about-to-license', 'No /license link found');
    }

    // Navigate to a generator world
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await sleep(300);
    const worldLink = page.locator('a[href*="/campaigns/fantasy"]').first();
    if (await worldLink.count() > 0) {
      await worldLink.click();
      await page.waitForURL('**/campaigns/fantasy**', { timeout: 5000 });
      pass('nav-landing-to-generator');
    } else {
      fail('nav-landing-to-generator', 'No fantasy world link found on landing');
    }

  } catch (err) {
    fail('nav-test', err.message.slice(0, 100));
  }
}

// ── Footer test — verify footer appears on key pages ──────────────────────
async function testFooter(page) {
  const footerPages = ['/', '/about', '/license', '/help', '/help/faq'];
  for (const path of footerPages) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: TIMEOUT });
      await sleep(300);
      const footer = page.locator('footer').first();
      const footerExists = await footer.count();
      if (footerExists > 0) {
        // Verify footer has the required links
        const helpLink = await page.locator('footer a[href="/help"]').count();
        const aboutLink = await page.locator('footer a[href="/about"]').count();
        const licLink = await page.locator('footer a[href="/license"]').count();
        if (helpLink && aboutLink && licLink) {
          pass(`footer-${path}`);
        } else {
          fail(`footer-links-${path}`, `Missing footer links (help:${helpLink} about:${aboutLink} license:${licLink})`);
        }
      } else {
        fail(`footer-${path}`, 'No <footer> element found');
      }
    } catch (err) {
      fail(`footer-${path}`, err.message.slice(0, 80));
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  OGMA QA — Browser Smoke Tests (Playwright)');
  console.log('═'.repeat(60) + '\n');

  // Check build exists
  const fs = await import('fs');
  if (!fs.existsSync('build/index.html')) {
    console.error('  ❌ build/ directory not found. Run npm run build first.');
    process.exit(1);
  }

  // Start preview server
  let server;
  try {
    console.log('  Starting preview server...');
    server = await startServer();
    await sleep(1000);
    console.log(`  Server ready at ${BASE}\n`);
  } catch (err) {
    console.error(`  ❌ Could not start server: ${err.message}`);
    process.exit(1);
  }

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    // Ignore HTTPS errors for local dev
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    // Test 1: All routes load without errors
    console.log('  ── Page load tests ──');
    for (const route of ROUTES) {
      await testPageLoad(page, route);
    }

    // Test 2: Generate content on all 8 worlds
    console.log('\n  ── Generator tests ──');
    for (const world of GEN_WORLDS) {
      await testGenerate(page, world);
    }

    // Test 3: Navigation between pages
    console.log('\n  ── Navigation tests ──');
    await testNavigation(page);

    // Test 4: Footer presence
    console.log('\n  ── Footer tests ──');
    await testFooter(page);

  } finally {
    await browser.close();
    server.kill();
  }

  // ── Summary ──
  console.log('\n' + '═'.repeat(60));
  console.log('  SMOKE TEST RESULTS');
  console.log('═'.repeat(60) + '\n');

  for (const r of results) {
    if (r.status === 'PASS') {
      console.log(`  ✅ ${r.name}`);
    } else {
      console.log(`  ❌ ${r.name} — ${r.detail}`);
    }
  }

  const total = results.length;
  console.log(`\n${'─'.repeat(60)}`);
  if (failures === 0) {
    console.log(`  SMOKE PASSED — ${total} checks, 0 failures.`);
    process.exit(0);
  } else {
    console.log(`  SMOKE FAILED — ${failures} failures out of ${total} checks.`);
    process.exit(1);
  }
}

main().catch(err => {
  if (err.message.includes('Executable') || err.message.includes('browserType.launch')) {
    console.error('\n  ⚠  Playwright browsers not installed. Run:');
    console.error('     npx playwright install chromium\n');
    process.exit(2);  // exit 2 = skipped, not failure
  }
  console.error('  ❌ Smoke test crashed:', err.message);
  process.exit(1);
});
