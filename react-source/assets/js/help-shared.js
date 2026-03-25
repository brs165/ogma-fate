// _shared.js — Wiki shared JavaScript
// Loaded by all help pages. Keeps sidebar JS in one place.

function toggleSideNav(btn) {
  var id = btn.getAttribute('data-children');
  var el = document.getElementById(id);
  if (!el) return;
  var open = el.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.classList.toggle('active', open);
  // Rotate chevron
  var chev = btn.querySelector('.wiki-sidebar-chevron');
  if (chev) chev.style.transform = open ? 'rotate(90deg)' : '';
}

// Hamburger nav toggle (topbar mobile menu)
(function() {
  document.addEventListener('click', function(e) {
    var btn = document.getElementById('topnav-hbg');
    var dd  = document.getElementById('topnav-dd');
    if (!btn || !dd) return;
    if (btn.contains(e.target)) {
      var open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    } else if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Auto-open the sidebar section whose children contain the current page.
// Handles three cases:
//   1. Child href points to a different page (href="/help/learn-fate.html#step-1")
//   2. Child href is anchor-only (href="#step-1") - current page is already this page
//   3. The parent button already has class="active" (hardcoded in the HTML)
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var parents = document.querySelectorAll('.wiki-sidebar-parent');
    parents.forEach(function(btn) {
      var id = btn.getAttribute('data-children');
      var drawer = id && document.getElementById(id);
      if (!drawer) return;

      // Case 3: already marked active in HTML
      if (btn.classList.contains('active')) {
        drawer.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        var chev = btn.querySelector('.wiki-sidebar-chevron');
        if (chev) chev.style.transform = 'rotate(90deg)';
        return;
      }

      var links = drawer.querySelectorAll('a');
      var isActive = false;
      links.forEach(function(a) {
        var href = a.getAttribute('href') || '';
        var filePart = href.split('#')[0];
        // Case 2: anchor-only href - belongs to current page
        if (!filePart) { isActive = true; return; }
        // Case 1: cross-page link - check filename
        var hPage = filePart.split('/').pop().replace('.html', '');
        var curPage = page.replace('.html', '');
        if (hPage === curPage) isActive = true;
      });

      if (isActive) {
        drawer.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('active');
        var chev = btn.querySelector('.wiki-sidebar-chevron');
        if (chev) chev.style.transform = 'rotate(90deg)';
      }
    });

    // Mark the current page's direct sidebar link as active
    var allLinks = document.querySelectorAll('.wiki-sidebar-link');
    allLinks.forEach(function(a) {
      var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop().replace('.html', '');
      if (href === page.replace('.html', '')) a.classList.add('active');
    });
  });
})();

// Generic section observer - highlights .wiki-sidebar-child links as user scrolls.
// Reads #fragment from absolute hrefs (e.g. /help/fate-mechanics.html#aspects),
// watches the matching id= elements with IntersectionObserver.
// learn-fate.html has its own inline observer with progress dots - skips this one.
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // learn-fate has its own inline observer
    if (document.querySelector('.learn-step-link')) return;

    var curPath = window.location.pathname; // e.g. /help/fate-mechanics.html or /help/fate-mechanics

    // Collect child links that point to the current page
    var children = document.querySelectorAll('.wiki-sidebar-child');
    var idToLink = {};
    var sectionIds = [];

    children.forEach(function(a) {
      var href = a.getAttribute('href') || '';
      var hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;
      var filePart = href.slice(0, hashIdx); // e.g. /help/fate-mechanics.html
      var id = href.slice(hashIdx + 1);
      if (!id) return;

      // Match: strip .html and trailing slash for comparison
      var normalize = function(p) { return p.replace(/\.html$/, '').replace(/\/$/, ''); };
      if (filePart && normalize(filePart) !== normalize(curPath)) return;

      idToLink[id] = a;
      sectionIds.push(id);
    });

    if (!sectionIds.length) return;

    var activeId = null;

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      sectionIds.forEach(function(sid) {
        var link = idToLink[sid];
        if (!link) return;
        link.classList.toggle('active', sid === id);
      });
      // Scroll active link into view within sidebar without jarring jumps
      var activeLink = idToLink[id];
      if (activeLink) {
        var sidebar = activeLink.closest('.wiki-sidebar');
        if (sidebar) {
          var lRect = activeLink.getBoundingClientRect();
          var sRect = sidebar.getBoundingClientRect();
          if (lRect.top < sRect.top + 40 || lRect.bottom > sRect.bottom - 40) {
            activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    }

    // Set initial active based on hash or first section
    var initHash = window.location.hash.replace('#', '');
    setActive((initHash && idToLink[initHash]) ? initHash : sectionIds[0]);

    if (!('IntersectionObserver' in window)) return;

    // rootMargin: push top boundary down past sticky topbar (52px),
    // shrink bottom boundary so only the section near the top triggers
    var observer = new IntersectionObserver(function(entries) {
      var topmost = null;
      var topmostY = Infinity;
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var y = entry.boundingClientRect.top;
          if (y < topmostY) { topmostY = y; topmost = entry.target.id; }
        }
      });
      if (topmost) setActive(topmost);
    }, { threshold: 0, rootMargin: '-52px 0px -55% 0px' });

    sectionIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  });
})();
