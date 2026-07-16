(function () {
  function initNav() {
    var nav = document.getElementById('site-nav');
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!nav || !toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    var path = (window.location.pathname || '').toLowerCase();
    var file = path.split('/').pop() || 'index.html';
    if (file === '' || file === '/') file = 'index.html';

    var map = {
      'index.html': 'home',
      'about.html': 'about',
      'history.html': 'about',
      'membership.html': 'membership',
      'season.html': 'season',
      'photos.html': 'photos',
      'archive.html': 'archive',
      'contact.html': 'contact',
      'links.html': 'links'
    };

    var key = map[file];
    if (!key && path.indexOf('/archive/') !== -1) {
      key = 'archive';
    }
    if (key) {
      var active = menu.querySelector('[data-nav="' + key + '"]');
      if (active) active.setAttribute('aria-current', 'page');
    }
  }

  function loadShell() {
    var navTarget = document.getElementById('navbar-load');
    var footerTarget = document.getElementById('footer-load');
    var pending = 0;

    function done() {
      pending -= 1;
      if (pending <= 0) initNav();
    }

    if (window.jQuery) {
      if (navTarget) {
        pending += 1;
        jQuery(navTarget).load('/components/navbar.htm', done);
      }
      if (footerTarget) {
        pending += 1;
        jQuery(footerTarget).load('/components/footer.htm', done);
      }
      if (pending === 0) initNav();
      return;
    }

    function fetchInto(el, url) {
      if (!el) return;
      pending += 1;
      fetch(url)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          el.innerHTML = html;
          done();
        })
        .catch(function () { done(); });
    }

    fetchInto(navTarget, '/components/navbar.htm');
    fetchInto(footerTarget, '/components/footer.htm');
    if (pending === 0) initNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadShell);
  } else {
    loadShell();
  }
})();
