/* ============================================================
   js/components/packages.js — Packages & Menu builder page
   ============================================================ */

function renderPackages(container, state) {
  const { bookings } = state;

  container.innerHTML = '';

  // ── Section title ──
  container.appendChild(el('h2', { className: 'section-title', text: 'Service packages' }));

  // ── Package cards ──
  const pkgGrid = el('div', { className: 'pkg-grid' });

  PACKAGES.forEach(p => {
    const count   = bookings.filter(b => b.pkg === p.id).length;
    const revenue = bookings.filter(b => b.pkg === p.id)
                            .reduce((s, b) => s + calcRevenue(b.guests, b.pkg), 0);

    const card = el('div', { className: `pkg-card${p.featured ? ' featured' : ''}` });

    if (p.featured) {
      card.appendChild(el('span', { className: 'badge badge-green', text: 'Most popular', style: { marginBottom: '8px' } }));
    }

    const name  = el('div', { className: 'pkg-name',  text: p.name });
    const price = el('div', { className: 'pkg-price' });
    price.innerHTML = `$${p.rate}<span> /head</span>`;

    const featList = el('ul', { className: 'pkg-features' });
    p.features.forEach(f => featList.appendChild(el('li', { text: f })));

    const stats = el('div', { className: 'pkg-stats' });
    append(stats,
      el('div', { text: `${count} bookings`, style: { fontSize: '12px', color: 'var(--text3)' } }),
      el('div', { text: `$${revenue.toLocaleString()} rev`, style: { fontSize: '12px', color: 'var(--accent)' } })
    );

    append(card, name, price, featList, stats);
    pkgGrid.appendChild(card);
  });

  container.appendChild(pkgGrid);

  // ── Divider ──
  container.appendChild(el('hr', { className: 'divider' }));

  // ── Menu builder ──
  container.appendChild(el('h2', { className: 'section-title', text: 'Menu builder' }));

  const menuGrid = el('div', { className: 'menu-grid' });

  Object.entries(MENU_ITEMS).forEach(([category, items]) => {
    const card  = el('div', { className: 'card' });
    const title = el('h3', { text: category, style: { fontFamily: 'DM Serif Display,serif', fontSize: '15px', marginBottom: '12px' } });
    card.appendChild(title);

    items.forEach(item => {
      const row   = el('div', { className: 'menu-item' });
      const label = el('span', { text: item });
      const badge = el('span', { className: 'badge badge-green', text: 'Included', style: { fontSize: '10px' } });
      append(row, label, badge);
      card.appendChild(row);
    });

    menuGrid.appendChild(card);
  });

  container.appendChild(menuGrid);
}
