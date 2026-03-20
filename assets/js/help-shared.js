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
//   1. Child href points to a different page (href="learn-fate.html#step-1")
//   2. Child href is anchor-only (href="#step-1") — current page is already this page
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
        // Case 2: anchor-only href — belongs to current page
        if (!filePart) { isActive = true; return; }
        // Case 1: cross-page link
        var hPage = filePart.split('/').pop();
        if (hPage === page) isActive = true;
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
      var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (href === page) a.classList.add('active');
    });
  });
})();
