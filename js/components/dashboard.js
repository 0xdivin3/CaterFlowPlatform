/* ============================================================
   js/components/dashboard.js — Dashboard overview page
   ============================================================ */

function renderDashboard(container, state, actions) {
  const { bookings, staff } = state;

  const thisMonth  = new Date().getMonth();
  const monthBooks = bookings.filter(b => new Date(b.date + 'T12:00:00').getMonth() === thisMonth);
  const revenue    = monthBooks.reduce((s, b) => s + calcRevenue(b.guests, b.pkg), 0);
  const pending    = bookings.filter(b => b.status === 'pending').length;
  const confirmed  = bookings.filter(b => b.status === 'confirmed').length;
  const upcoming   = bookings
    .filter(b => b.status !== 'completed' && b.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  // ── Metric cards ──
  const metrics = el('div', { className: 'metrics' });

  const metricData = [
    { label: 'Events this month', value: monthBooks.length, sub: `${confirmed} confirmed`,      subColor: 'var(--accent)'  },
    { label: 'Est. revenue',       value: '$' + revenue.toLocaleString(), sub: monthBooks.length + ' events',   subColor: 'var(--blue)'    },
    { label: 'Active staff',       value: staff.length,     sub: `${bookings.length} total events`, subColor: 'var(--purple)'  },
    { label: 'Pending confirm',    value: pending,           sub: pending ? 'Needs attention' : 'All clear', subColor: 'var(--amber)' }
  ];

  metricData.forEach(m => {
    const card  = el('div', { className: 'metric' });
    const label = el('div', { className: 'metric-label', text: m.label });
    const value = el('div', { className: 'metric-value', text: String(m.value) });
    const sub   = el('div', { className: 'metric-sub',   text: m.sub });
    sub.style.color = m.subColor;
    if (m.label === 'Pending confirm' && pending > 0) value.style.color = 'var(--amber)';
    append(card, label, value, sub);
    metrics.appendChild(card);
  });

  // ── Upcoming events header ──
  const evHeader = el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' } });
  const evTitle  = el('h2', { className: 'section-title', text: 'Upcoming events', style: { margin: 0 } });
  evTitle.style.margin = '0';
  const newBtn   = el('button', {
    className: 'btn btn-primary btn-sm',
    html: '<i class="ti ti-plus"></i> New booking',
    onClick: actions.openNewBooking
  });
  append(evHeader, evTitle, newBtn);

  // ── Event list ──
  const evList = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } });

  if (upcoming.length === 0) {
    const empty = el('div', { className: 'empty' });
    append(empty, el('i', { className: 'ti ti-calendar-off' }), el('p', { text: 'No upcoming events' }));
    evList.appendChild(empty);
  } else {
    upcoming.forEach((b, i) => {
      const c    = COLORS[i % COLORS.length];
      const card = el('div', { className: 'card card-sm event-strip', onClick: () => actions.openEditBooking(b) });

      const stripe = el('div', { className: 'event-stripe' });
      stripe.style.background = c.text;

      const info = el('div');
      append(info,
        el('div', { className: 'event-name', text: b.name }),
        el('div', { className: 'event-meta', text: `${formatDate(b.date)} · ${b.time} · ${b.guests} guests · ${b.venue || 'TBD'}` })
      );

      append(card, stripe, info, statusBadge(b.status));
      evList.appendChild(card);
    });
  }

  // ── Quick-stats sidebar ──
  const quickStats = el('div');
  const qTitle     = el('h2', { className: 'section-title', text: 'Quick stats' });
  quickStats.appendChild(qTitle);

  const statsData = [
    { label: 'Weddings',        count: bookings.filter(b => b.name.toLowerCase().includes('wedding')).length,                     icon: 'ti-heart',    color: 'var(--red)'    },
    { label: 'Corporate',       count: bookings.filter(b => /corp|gala/i.test(b.name)).length,                                    icon: 'ti-building', color: 'var(--blue)'   },
    { label: 'Private parties', count: bookings.filter(b => !/wedding|corp|gala/i.test(b.name)).length,                           icon: 'ti-confetti', color: 'var(--purple)' }
  ];

  statsData.forEach(s => {
    const row  = el('div', { className: 'card card-sm', style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' } });
    const icon = el('div', { html: `<i class="ti ${s.icon}" style="font-size:18px"></i>`, style: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' } });
    icon.style.background = s.color + '22';
    icon.style.color      = s.color;
    const lbl  = el('div', { text: s.label, style: { flex: '1', fontSize: '13px', color: 'var(--text2)' } });
    const cnt  = el('div', { text: String(s.count), style: { fontSize: '20px', fontFamily: 'DM Serif Display,serif', color: 'var(--text)' } });
    append(row, icon, lbl, cnt);
    quickStats.appendChild(row);
  });

  // ── Two-column layout ──
  const cols = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' } });
  const left = el('div');
  append(left, evHeader, evList);
  append(cols, left, quickStats);

  render(container, metrics, cols);
}
