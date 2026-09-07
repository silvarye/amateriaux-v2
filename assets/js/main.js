/* ==========================================================================
   A MATÉRIAUX — comportements de l'interface
   Aucune dépendance externe. Chaque module se désactive tout seul
   si les éléments qu'il pilote ne sont pas présents sur la page.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------- Thème : auto → clair → sombre ---------- */
  (function theme() {
    var KEY = 'am-theme';
    var btn = $('[data-theme-toggle]');
    var stored;
    try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }

    function apply(mode) {
      if (mode === 'light' || mode === 'dark') {
        document.documentElement.setAttribute('data-theme', mode);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      if (btn) {
        var label = mode === 'light' ? 'Thème clair' :
                    mode === 'dark'  ? 'Thème sombre' : 'Thème automatique';
        btn.setAttribute('aria-label', label + ' — cliquer pour changer');
        btn.setAttribute('title', label);
      }
    }

    apply(stored);
    if (!btn) return;

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
      try {
        if (next === 'auto') { localStorage.removeItem(KEY); }
        else { localStorage.setItem(KEY, next); }
      } catch (e) { /* navigation privée : on applique quand même */ }
      apply(next === 'auto' ? null : next);
    });
  })();

  /* ---------- Barre de navigation ---------- */
  (function nav() {
    var bar = $('.nav');
    if (bar) {
      var onScroll = function () {
        bar.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    var burger = $('[data-burger]');
    var drawer = $('[data-drawer]');
    if (!burger || !drawer) return;

    var close = function () {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.removeProperty('overflow');
    };

    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('a', drawer).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) { close(); }
    });
  })();

  /* ---------- Apparition au défilement ---------- */
  (function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Galerie : filtres + visionneuse ---------- */
  (function gallery() {
    var grid = $('[data-gallery]');
    if (!grid) return;

    var shots   = $$('.shot', grid);
    var chips   = $$('[data-filter]');
    var counter = $('[data-gallery-count]');

    function visible() {
      return shots.filter(function (s) { return !s.classList.contains('is-hidden'); });
    }

    function filter(cat) {
      shots.forEach(function (s) {
        var match = cat === 'all' || s.dataset.cat === cat;
        s.classList.toggle('is-hidden', !match);
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.dataset.filter === cat));
      });
      if (counter) {
        var n = visible().length;
        counter.textContent = n + (n > 1 ? ' réalisations' : ' réalisation');
      }
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { filter(c.dataset.filter); });
    });
    filter('all');

    /* --- Visionneuse --- */
    var box = $('[data-lightbox]');
    if (!box) return;

    var boxImg  = $('img', box);
    var boxCap  = $('[data-lightbox-caption]');
    var boxPos  = $('[data-lightbox-position]');
    var list    = [];
    var index   = 0;
    var opener  = null;

    function render() {
      var shot = list[index];
      var src  = shot.dataset.full || $('img', shot).src;
      boxImg.src = src;
      boxImg.alt = $('img', shot).alt || 'Réalisation A Matériaux';
      if (boxCap) { boxCap.textContent = shot.dataset.label || ''; }
      if (boxPos) { boxPos.textContent = (index + 1) + ' / ' + list.length; }
    }

    function open(shot) {
      list = visible();
      index = Math.max(0, list.indexOf(shot));
      opener = shot;
      render();
      box.classList.add('is-open');
      box.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      var closeBtn = $('[data-lightbox-close]', box);
      if (closeBtn) { closeBtn.focus(); }
    }

    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.removeProperty('overflow');
      if (opener) { opener.focus(); }
    }

    function step(delta) {
      if (!list.length) return;
      index = (index + delta + list.length) % list.length;
      render();
    }

    shots.forEach(function (s) {
      s.addEventListener('click', function () { open(s); });
    });

    $$('[data-lightbox-close]', box).forEach(function (b) {
      b.addEventListener('click', close);
    });
    var prev = $('[data-lightbox-prev]', box);
    var next = $('[data-lightbox-next]', box);
    if (prev) { prev.addEventListener('click', function () { step(-1); }); }
    if (next) { next.addEventListener('click', function () { step(1); }); }

    box.addEventListener('click', function (e) {
      if (e.target === box) { close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape')     { close(); }
      if (e.key === 'ArrowLeft')  { step(-1); }
      if (e.key === 'ArrowRight') { step(1); }
    });
  })();

  /* ---------- Accordéon ---------- */
  (function accordion() {
    var btns = $$('.acc__btn');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.dataset.open = String(!open);
      });
    });

    var expandAll = $('[data-acc-expand]');
    if (expandAll) {
      expandAll.addEventListener('click', function () {
        var openAll = expandAll.dataset.state !== 'open';
        btns.forEach(function (btn) {
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          btn.setAttribute('aria-expanded', String(openAll));
          if (panel) { panel.dataset.open = String(openAll); }
        });
        expandAll.dataset.state = openAll ? 'open' : 'closed';
        expandAll.textContent = openAll ? 'Tout replier' : 'Tout déplier';
      });
    }

    /* Ouvre l'article ciblé par l'URL (#article-7) */
    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target && target.classList.contains('acc__item')) {
        var b = $('.acc__btn', target);
        var p = $('.acc__panel', target);
        if (b && p) { b.setAttribute('aria-expanded', 'true'); p.dataset.open = 'true'; }
      }
    }
  })();

  /* ---------- Formulaire de contact ---------- */
  (function contactForm() {
    var form = $('[data-contact-form]');
    if (!form) return;

    var status = $('[data-form-status]');

    function setError(input, message) {
      var slot = $('#' + input.id + '-error');
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (slot) { slot.textContent = message || ''; }
      return !message;
    }

    function validate() {
      var ok = true;
      $$('[required]', form).forEach(function (input) {
        var value = input.value.trim();
        var message = '';
        if (!value) {
          message = 'Ce champ est obligatoire.';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          message = 'Merci de saisir une adresse e-mail valide.';
        }
        if (!setError(input, message)) { ok = false; }
      });
      return ok;
    }

    $$('input, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') { setError(input, ''); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        if (status) {
          status.hidden = false;
          status.textContent = 'Merci de corriger les champs signalés.';
        }
        var firstBad = $('[aria-invalid="true"]', form);
        if (firstBad) { firstBad.focus(); }
        return;
      }

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      var subject = get('objet') || 'Demande via le site amateriaux.fr';
      var body = [
        'Nom : ' + get('nom'),
        'E-mail : ' + get('email'),
        'Téléphone : ' + (get('telephone') || '—'),
        'Type de projet : ' + (get('projet') || '—'),
        '',
        get('message')
      ].join('\n');

      var mailto = 'mailto:' + form.dataset.contactForm +
                   '?subject=' + encodeURIComponent(subject) +
                   '&body=' + encodeURIComponent(body);

      if (status) {
        status.hidden = false;
        status.textContent = 'Votre logiciel de messagerie s\'ouvre avec le message pré-rempli. ' +
                             'Si rien ne se passe, écrivez-nous directement à ' + form.dataset.contactForm + '.';
      }
      window.location.href = mailto;
    });
  })();

  /* ---------- Année courante dans le pied de page ---------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
