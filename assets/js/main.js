/* TOOLSET — витрина: автосмена товаров, параллакс, свайп.
   Клик по картинке — переход на сайт ENAR (обычная ссылка <a>). */
(function () {
  'use strict';

  /* ---------- Тексты: грузинский (ka) и английский (en) ----------
     title — название товара, sub — назначение. Ключи товаров = data-key у <a class="slide">. */
  var I18N = {
    ka: {
      eyebrow: 'ბეტონის ტექნიკა',
      cta: 'ნახეთ ENAR-ის საიტზე',
      address: 'ვიქტორ კუპრაძის ქ. 20, თბილისი',
      products: 'პროდუქცია',
      items: {
        pump:     { title: 'წყლის ტუმბო',                    sub: 'წყლის გადატუმბვა' },
        vibrator: { title: 'ბეტონის სიღრმული ვიბრატორი',     sub: 'ბეტონის ვიბრირება' },
        screed:   { title: 'ვიბრაციული ლარტყა',              sub: 'ზედაპირის მოსწორება' },
        portable: { title: 'პორტატული ვიბრატორი',            sub: 'ბეტონის ვიბრირება' },
        trowel:   { title: 'ბეტონის მოსაპრიალებელი მანქანა', sub: 'ზედაპირის მოპრიალება' },
        float:    { title: 'ბეტონის ხელის სალესი',           sub: 'ზედაპირის მოსწორება' }
      }
    },
    en: {
      eyebrow: 'Concrete equipment',
      cta: 'View on ENAR website',
      address: '20 Viktor Kupradze St, Tbilisi',
      products: 'Products',
      items: {
        pump:     { title: 'Water pump',                 sub: 'Water pumping' },
        vibrator: { title: 'Internal concrete vibrator', sub: 'Concrete vibration' },
        screed:   { title: 'Vibrating screed',           sub: 'Surface levelling' },
        portable: { title: 'Portable vibrator',          sub: 'Concrete vibration' },
        trowel:   { title: 'Power trowel',               sub: 'Surface finishing' },
        float:    { title: 'Bull float',                 sub: 'Surface levelling' }
      }
    }
  };
  var lang = document.documentElement.lang === 'en' ? 'en' : 'ka';

  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var progress = document.querySelector('.progress');
  var titleEl = document.querySelector('[data-title]');
  var subEl = document.querySelector('[data-sub]');
  var curEl = document.querySelector('[data-cur]');
  var totalEl = document.querySelector('[data-total]');
  var ctaEl = document.querySelector('[data-cta]');
  if (!stage || !slides.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var current = 0;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  totalEl.textContent = pad(slides.length);

  // Сегменты прогресса
  var bars = slides.map(function (slide, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.addEventListener('click', function () { go(i); });
    progress.appendChild(b);
    return b;
  });

  // Когда полоска активного сегмента заполнилась — следующий товар
  progress.addEventListener('animationend', function (e) {
    if (e.target === bars[current]) go(current + 1);
  });

  function setText(el, text) {
    var span = document.createElement('span');
    span.textContent = text;
    if (!reduce) span.className = 'swap';
    el.replaceChildren(span);
  }

  function go(next, first) {
    next = (next + slides.length) % slides.length;
    if (next === current && !first) return;

    var prev = slides[current];
    if (!first) {
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      prev.setAttribute('tabindex', '-1');
      setTimeout(function () { prev.classList.remove('is-leaving'); }, 1100);
    }

    current = next;
    var s = slides[current];
    s.classList.remove('is-leaving');
    s.classList.add('is-active');
    s.removeAttribute('tabindex');

    // предзагрузка следующей картинки
    var nextImg = slides[(current + 1) % slides.length].querySelector('img');
    if (nextImg && nextImg.loading === 'lazy') nextImg.loading = 'eager';

    renderCaption();
    curEl.textContent = pad(current + 1);
    ctaEl.href = s.href;

    bars.forEach(function (b, i) {
      b.classList.remove('is-active');
      b.classList.toggle('is-done', i < current);
      b.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    // перезапуск CSS-анимации заполнения
    void bars[current].offsetWidth;
    bars[current].classList.add('is-active');
  }

  function product(slide) { return I18N[lang].items[slide.dataset.key] || { title: '', sub: '' }; }

  function renderCaption() {
    var p = product(slides[current]);
    setText(titleEl, p.title);
    setText(subEl, p.sub);
  }

  // Применить язык: статичные тексты, alt/aria у товаров, кнопки KA/EN
  function applyLang(next, save) {
    lang = next === 'en' ? 'en' : 'ka';
    document.documentElement.lang = lang;
    var t = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (t[el.dataset.i18n] != null) el.textContent = t[el.dataset.i18n];
    });
    slides.forEach(function (s, i) {
      var p = product(s);
      s.querySelector('img').alt = 'ENAR — ' + p.title;
      bars[i].setAttribute('aria-label', p.title);
    });
    progress.setAttribute('aria-label', t.products);
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    if (save) {
      try { localStorage.setItem('toolset-lang', lang); } catch (e) {}
    }
  }

  document.querySelectorAll('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === lang) return;
      applyLang(b.dataset.lang, true);
      renderCaption();
    });
  });

  slides.forEach(function (s, i) { if (i) s.setAttribute('tabindex', '-1'); });
  applyLang(lang, false);
  go(0, true);

  // Пауза, пока курсор на витрине или вкладка скрыта
  var showcase = document.querySelector('.showcase');
  if (canHover) {
    showcase.addEventListener('pointerenter', function () { stage.classList.add('is-paused'); });
    showcase.addEventListener('pointerleave', function () { stage.classList.remove('is-paused'); });
  }
  document.addEventListener('visibilitychange', function () {
    stage.classList.toggle('is-paused', document.hidden);
  });

  // Клавиатура: стрелки
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'ArrowLeft') go(current - 1);
  });

  // Свайп на телефоне (тап по-прежнему открывает ENAR)
  var sx = 0, sy = 0, swiped = false;
  stage.addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiped = false;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped = true;
      go(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  stage.addEventListener('click', function (e) {
    if (swiped) { e.preventDefault(); swiped = false; }
  }, true);

  // Параллакс за курсором (плавно, через rAF)
  if (canHover && !reduce) {
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    var tick = function () {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      stage.style.setProperty('--mx', x.toFixed(3));
      stage.style.setProperty('--my', y.toFixed(3));
      raf = (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) ? requestAnimationFrame(tick) : 0;
    };
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    stage.addEventListener('pointerleave', function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }
})();
