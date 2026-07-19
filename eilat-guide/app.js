/* Эйлат 2026 · роутер и рендеринг. Vanilla JS, без сборщиков. */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const topbarTitle = document.getElementById('topbarTitle');
  const backBtn = document.getElementById('backBtn');

  // ---------- Waze / Google Maps ----------
  function wazeUrl(loc) {
    if (loc.lat != null && loc.lon != null) {
      return `https://waze.com/ul?ll=${loc.lat},${loc.lon}&navigate=yes`;
    }
    return `https://waze.com/ul?q=${encodeURIComponent(loc.q + ' Eilat')}&navigate=yes`;
  }
  function gmapsUrl(loc) {
    if (loc.lat != null && loc.lon != null) {
      return `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lon}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.q)}`;
  }

  // ---------- localStorage helpers ----------
  function loadChecked(id) {
    try { return JSON.parse(localStorage.getItem(id) || '{}'); } catch (e) { return {}; }
  }
  function saveChecked(id, state) {
    try { localStorage.setItem(id, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- Small DOM helpers ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (children) children.forEach(c => { if (c) node.appendChild(c); });
    return node;
  }

  // ---------- Block renderers ----------
  function renderP(block) {
    return el('p', { html: block.text });
  }

  function renderH2(block) {
    return el('h2', {}, [document.createTextNode(block.text)]);
  }

  function renderUlist(block) {
    const ul = el('ul', { class: 'ulist', style: 'padding-left:20px; margin:10px 0;' });
    block.items.forEach(t => {
      const li = el('li', { html: t, style: 'margin-bottom:8px; font-size:15px;' });
      ul.appendChild(li);
    });
    return ul;
  }

  function renderOlist(block) {
    const ol = el('ol', { style: 'padding-left:22px; margin:10px 0;' });
    block.items.forEach(t => {
      const li = el('li', { html: t, style: 'margin-bottom:10px; font-size:15px;' });
      ol.appendChild(li);
    });
    return ol;
  }

  function renderCallout(block) {
    return el('div', { class: `callout ${block.kind}` }, [
      el('span', { class: 'callout-title' }, [document.createTextNode(block.title)]),
      el('span', { html: block.text }),
    ]);
  }

  function renderTable(block) {
    const wrap = el('div', {});
    const titleCol = block.titleCol != null ? block.titleCol : 0;

    // Wide table (desktop)
    const table = el('table', { class: 'wide-table' });
    const thead = el('thead', {}, [el('tr', {}, block.headers.map(h => el('th', { html: h })))]);
    const tbody = el('tbody', {}, block.rows.map(row => el('tr', {}, row.map(c => el('td', { html: c })))));
    table.appendChild(thead);
    table.appendChild(tbody);
    wrap.appendChild(table);

    // Card list (mobile)
    const cards = el('div', { class: 'table-cards' });
    block.rows.forEach(row => {
      const card = el('div', { class: 'tcard' });
      card.appendChild(el('div', { class: 'tcard-title', html: row[titleCol] }));
      row.forEach((val, i) => {
        if (i === titleCol) return;
        const rowEl = el('div', { class: 'tcard-row' }, [
          el('span', { class: 'k', html: block.headers[i] }),
          el('span', { class: 'v', html: val }),
        ]);
        card.appendChild(rowEl);
      });
      cards.appendChild(card);
    });
    wrap.appendChild(cards);
    return wrap;
  }

  function locButtons(loc) {
    const row = el('div', { class: 'btn-row' });
    row.appendChild(el('a', {
      class: 'btn btn-waze', href: wazeUrl(loc), target: '_blank', rel: 'noopener',
      html: '🧭 Маршрут в Waze',
    }));
    row.appendChild(el('a', {
      class: 'btn btn-maps', href: gmapsUrl(loc), target: '_blank', rel: 'noopener',
      html: '📍 Google Maps',
    }));
    return row;
  }

  function renderLocations(block) {
    const wrap = el('div', {});
    block.groups.forEach(group => {
      if (group.title) wrap.appendChild(el('div', { class: 'loc-group-title', html: group.title }));
      group.items.forEach(item => {
        const card = el('div', { class: 'loc-card' });
        card.appendChild(el('div', { class: 'loc-name', html: item.loc.name }));
        if (item.note) card.appendChild(el('div', { class: 'loc-note', html: item.note }));
        card.appendChild(locButtons(item.loc));
        wrap.appendChild(card);
      });
    });
    return wrap;
  }

  function renderContacts(block) {
    const wrap = el('div', { class: 'table-cards' });
    block.rows.forEach(row => {
      const card = el('div', { class: 'tcard' });
      card.appendChild(el('div', { class: 'tcard-title', html: row.label }));
      card.appendChild(el('div', { style: 'margin-bottom:6px; color:var(--text-muted); font-size:14px;', html: row.value }));
      if (row.tel) {
        card.appendChild(el('a', { class: 'btn btn-tel', href: `tel:${row.tel}`, html: '📞 Позвонить' }));
      }
      wrap.appendChild(card);
    });
    return wrap;
  }

  function checklistItemNode(storageId, key, text, state) {
    const checked = !!state[key];
    const li = el('li', { class: checked ? 'checked' : '' });
    const cbId = `${storageId}-${key}`;
    const cb = el('input', { type: 'checkbox', id: cbId });
    cb.checked = checked;
    cb.addEventListener('change', () => {
      const s = loadChecked(storageId);
      s[key] = cb.checked;
      saveChecked(storageId, s);
      li.classList.toggle('checked', cb.checked);
      updateProgress();
    });
    const label = el('label', { for: cbId, html: text });
    li.appendChild(cb);
    li.appendChild(label);

    function updateProgress() {
      const progEl = li.closest('.checklist-block');
      if (!progEl) return;
      const total = progEl.querySelectorAll('input[type=checkbox]').length;
      const done = progEl.querySelectorAll('input[type=checkbox]:checked').length;
      const p = progEl.querySelector('.checklist-progress');
      if (p) p.textContent = `Отмечено ${done} из ${total}`;
    }
    return li;
  }

  function renderChecklist(block) {
    const state = loadChecked(block.id);
    const wrap = el('div', { class: 'checklist-block' });
    if (block.title) wrap.appendChild(el('h2', {}, [document.createTextNode(block.title)]));
    const total = block.items.length;
    const done = block.items.filter((_, i) => state[i]).length;
    wrap.appendChild(el('div', { class: 'checklist-progress', html: `Отмечено ${done} из ${total}` }));
    const ul = el('ul', { class: 'checklist' });
    block.items.forEach((text, i) => ul.appendChild(checklistItemNode(block.id, String(i), text, state)));
    wrap.appendChild(ul);
    const resetBtn = el('button', { class: 'checklist-reset', html: 'Сбросить' });
    resetBtn.addEventListener('click', () => {
      saveChecked(block.id, {});
      renderRoute(currentRoute, true);
    });
    wrap.appendChild(resetBtn);
    return wrap;
  }

  function renderChecklistGroups(block) {
    const state = loadChecked(block.id);
    const wrap = el('div', { class: 'checklist-block' });
    let total = 0, done = 0;
    block.groups.forEach(g => g.items.forEach((_, i) => {
      total++;
      const key = `${g.title}__${i}`;
      if (state[key]) done++;
    }));
    wrap.appendChild(el('div', { class: 'checklist-progress', html: `Отмечено ${done} из ${total}` }));
    block.groups.forEach(g => {
      wrap.appendChild(el('h2', {}, [document.createTextNode(g.title)]));
      const ul = el('ul', { class: 'checklist' });
      g.items.forEach((text, i) => {
        const key = `${g.title}__${i}`;
        ul.appendChild(checklistItemNode(block.id, key, text, state));
      });
      wrap.appendChild(ul);
    });
    const resetBtn = el('button', { class: 'checklist-reset', html: 'Сбросить всё' });
    resetBtn.addEventListener('click', () => {
      saveChecked(block.id, {});
      renderRoute(currentRoute, true);
    });
    wrap.appendChild(resetBtn);
    return wrap;
  }

  const BLOCK_RENDERERS = {
    p: renderP,
    h2: renderH2,
    ulist: renderUlist,
    olist: renderOlist,
    callout: renderCallout,
    table: renderTable,
    locations: renderLocations,
    contacts: renderContacts,
    checklist: renderChecklist,
    checklistGroups: renderChecklistGroups,
  };

  function renderBlocks(container, blocks) {
    blocks.forEach(b => {
      const fn = BLOCK_RENDERERS[b.t];
      if (!fn) return;
      const node = fn(b);
      node.classList && node.classList.add('block');
      container.appendChild(el('div', { class: 'block' }, [node]));
    });
  }

  // ---------- Page shell ----------
  function pageHeader(section) {
    const wrap = el('div', {});
    const h1 = el('h1', {}, [
      el('span', { class: 'num', html: section.num ? String(section.num) + '.' : '' }),
      document.createTextNode(section.title),
    ]);
    wrap.appendChild(h1);
    if (section.subtitle) wrap.appendChild(el('p', { class: 'subtitle', html: section.subtitle }));
    return wrap;
  }

  function renderSectionPage(route) {
    const section = SECTIONS[route];
    const page = el('div', { class: 'page' });
    page.appendChild(pageHeader(section));
    renderBlocks(page, section.blocks);
    app.appendChild(page);
    document.title = `${section.title} · Эйлат 2026`;
  }

  function renderExtraIndex() {
    const section = SECTIONS.extra;
    const page = el('div', { class: 'page' });
    page.appendChild(pageHeader(section));
    const list = el('div', { class: 'submenu-list' });
    const extraMenu = MENU.find(m => m.id === 'extra');
    extraMenu.children.forEach(child => {
      const item = el('a', { class: 'submenu-item', href: `#${child.route}` }, [
        el('span', { class: 'tile-icon', html: sectionIcon(child.route) }),
        el('span', {}, [document.createTextNode(child.label)]),
        el('span', { class: 'arrow', html: '›' }),
      ]);
      list.appendChild(item);
    });
    page.appendChild(list);
    app.appendChild(page);
    document.title = `${section.title} · Эйлат 2026`;
  }

  function sectionIcon(route) {
    const icons = {
      sunsets: '🌅', photospots: '📸', kids: '🧒', adults: '🍸', shopping: '🛍️',
      souvenirs: '🎁', packing: '🎒', budget: '💰', lifehacks: '💡', apps: '📱', top50: '🏆',
    };
    return icons[route] || '•';
  }

  function renderHome() {
    const hero = el('div', { class: 'hero' }, [
      el('div', { class: 'hero-eyebrow', html: 'КРАСНОЕ МОРЕ · ИЗРАИЛЬ' }),
      el('h1', { html: 'ЭЙЛАТ <span>2026</span>' }),
      el('p', { class: 'dates', html: '19 – 22 июля 2026 · Семейный путеводитель' }),
      el('p', { class: 'names', html: 'Василий · Полина · Ирина · Роберт · Ева' }),
    ]);
    app.appendChild(hero);

    const intro = el('div', { class: 'home-intro' });
    HOME_SHORT.forEach(t => intro.appendChild(el('p', { html: t })));
    const moreBtn = el('button', { class: 'read-more-btn', html: 'Читать полностью →' });
    const fullWrap = el('div', { class: 'block', style: 'display:none;' });
    renderBlocks(fullWrap, HOME_FULL);
    moreBtn.addEventListener('click', () => {
      const showing = fullWrap.style.display !== 'none';
      fullWrap.style.display = showing ? 'none' : 'block';
      moreBtn.textContent = showing ? 'Читать полностью →' : 'Свернуть ↑';
    });
    intro.appendChild(moreBtn);
    intro.appendChild(fullWrap);
    app.appendChild(intro);

    app.appendChild(el('div', { class: 'section-label', html: 'Разделы путеводителя' }));
    const grid = el('div', { class: 'tile-grid' });
    MENU.forEach(item => {
      if (item.sub) {
        grid.appendChild(el('a', { class: 'tile', href: '#extra' }, [
          el('span', { class: 'tile-icon', html: item.icon }),
          el('span', { class: 'tile-label', html: item.label }),
        ]));
      } else {
        grid.appendChild(el('a', { class: 'tile', href: `#${item.route}` }, [
          el('span', { class: 'tile-icon', html: item.icon }),
          el('span', { class: 'tile-label', html: item.label }),
        ]));
      }
    });
    app.appendChild(grid);
    app.appendChild(el('div', { class: 'page-footer', html: 'Составлено в июле 2026 · Цены и часы работы уточняйте на официальных сайтах перед поездкой' }));
    document.title = 'ЭЙЛАТ 2026 · Семейный путеводитель';
  }

  // ---------- Router ----------
  let currentRoute = 'home';

  function renderRoute(route, silent) {
    currentRoute = route;
    app.innerHTML = '';
    if (route === 'home' || !route) {
      backBtn.classList.remove('show');
      topbarTitle.textContent = 'ЭЙЛАТ 2026';
      renderHome();
    } else if (route === 'extra') {
      backBtn.classList.add('show');
      topbarTitle.textContent = 'Дополнительно';
      renderExtraIndex();
    } else if (SECTIONS[route]) {
      backBtn.classList.add('show');
      topbarTitle.textContent = SECTIONS[route].title.split('·')[0].trim();
      renderSectionPage(route);
    } else {
      backBtn.classList.remove('show');
      topbarTitle.textContent = 'ЭЙЛАТ 2026';
      renderHome();
    }
    updateActiveMenu(route);
    if (!silent) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function handleHash() {
    const route = (location.hash || '#home').replace('#', '');
    renderRoute(route);
    closeMenu();
  }

  window.addEventListener('hashchange', handleHash);

  // ---------- Menu overlay ----------
  const menuOverlay = document.getElementById('menu');
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const menuList = document.getElementById('menuList');

  function buildMenu() {
    menuList.innerHTML = '';
    const homeLi = el('li', {}, [el('a', { href: '#home', 'data-route': 'home' }, [
      el('span', { class: 'menu-icon', html: '🏠' }), document.createTextNode('Главная'),
    ])]);
    menuList.appendChild(homeLi);

    MENU.forEach(item => {
      if (item.sub) {
        const li = el('li', {});
        const toggle = el('button', { class: 'menu-sub-toggle' }, [
          el('span', { class: 'menu-icon', html: item.icon }),
          document.createTextNode(item.label),
          el('span', { class: 'menu-caret', html: '›' }),
        ]);
        const subUl = el('ul', { class: 'menu-sub' });
        item.children.forEach(child => {
          subUl.appendChild(el('li', {}, [el('a', { href: `#${child.route}`, 'data-route': child.route }, [
            document.createTextNode(child.label),
          ])]));
        });
        toggle.addEventListener('click', () => {
          subUl.classList.toggle('open');
          toggle.querySelector('.menu-caret').classList.toggle('rot');
        });
        li.appendChild(toggle);
        li.appendChild(subUl);
        menuList.appendChild(li);
      } else {
        const li = el('li', {}, [el('a', { href: `#${item.route}`, 'data-route': item.route }, [
          el('span', { class: 'menu-icon', html: item.icon }),
          document.createTextNode(item.label),
        ])]);
        menuList.appendChild(li);
      }
    });
  }

  function updateActiveMenu(route) {
    menuList.querySelectorAll('a[data-route]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-route') === route);
    });
  }

  function openMenu() { menuOverlay.classList.add('open'); }
  function closeMenu() { menuOverlay.classList.remove('open'); }

  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) closeMenu(); });
  topbarTitle.addEventListener('click', () => { location.hash = '#home'; });
  backBtn.addEventListener('click', () => { history.back(); });

  // ---------- Init ----------
  buildMenu();
  handleHash();
})();
