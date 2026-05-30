/* ============================================================
   js/components/bookings.js — Bookings list page
   ============================================================ */

function renderBookings(container, state, actions) {
  const { bookings, staff } = state;
  let activeFilter = 'all';
  let searchQuery  = '';

  function draw() {
    container.innerHTML = '';

    // ── Toolbar ──
    const toolbar = el('div', { style: { display: 'flex', gap: '10px', marginBottom: '1.25rem', alignItems: 'center' } });

    const searchWrap = el('div', { className: 'search-bar', style: { flex: '1' } });
    searchWrap.appendChild(el('i', { className: 'ti ti-search' }));
    const searchInput = el('input', { className: 'form-input', attrs: { type: 'text', placeholder: 'Search events or clients…', value: searchQuery } });
    searchInput.addEventListener('input', e => { searchQuery = e.target.value; draw(); });
    searchWrap.appendChild(searchInput);

    const newBtn = el('button', { className: 'btn btn-primary', html: '<i class="ti ti-plus"></i> New booking', onClick: actions.openNewBooking });
    append(toolbar, searchWrap, newBtn);

    // ── Tabs ──
    const tabBar = el('div', { className: 'tabs' });
    const tabDefs = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];
    tabDefs.forEach(t => {
      const count = t === 'all' ? null : bookings.filter(b => b.status === t).length;
      const tab   = el('button', {
        className: `tab${activeFilter === t ? ' active' : ''}`,
        onClick: () => { activeFilter = t; draw(); }
      });
      tab.textContent = cap(t);
      if (count !== null) {
        const badge = el('span', { className: 'badge badge-gray', text: String(count) });
        badge.style.marginLeft = '5px'; badge.style.fontSize = '10px'; badge.style.padding = '1px 5px';
        tab.appendChild(badge);
      }
      tabBar.appendChild(tab);
    });

    // ── Filter & search ──
    const filtered = bookings.filter(b =>
      (activeFilter === 'all' || b.status === activeFilter) &&
      (b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       b.client.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // ── Table ──
    const tableWrap = el('div', { className: 'table-wrap' });
    const table     = el('table');
    const thead     = el('thead');
    const headerRow = el('tr');
    ['Event', 'Client', 'Date & Time', 'Guests', 'Package', 'Staff', 'Status', 'Revenue'].forEach(h => {
      headerRow.appendChild(el('th', { text: h }));
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = el('tbody');

    if (filtered.length === 0) {
      const empty = el('tr');
      const td    = el('td', { attrs: { colspan: '8' }, style: { textAlign: 'center', padding: '3rem', color: 'var(--text3)' } });
      td.innerHTML = '<i class="ti ti-database-off" style="display:block;font-size:32px;margin-bottom:8px;opacity:.3"></i>No bookings found';
      empty.appendChild(td);
      tbody.appendChild(empty);
    } else {
      filtered.forEach(b => {
        const row = el('tr');
        row.addEventListener('click', () => showBookingDetail(b, state, actions));

        // Event + venue
        const evTd = el('td');
        append(evTd, el('strong', { text: b.name }));
        if (b.venue) evTd.appendChild(el('div', { className: 'cell-sub', text: b.venue }));

        // Client + email
        const clTd = el('td');
        append(clTd, el('strong', { text: b.client }));
        if (b.email) clTd.appendChild(el('div', { className: 'cell-sub', text: b.email }));

        // Date + time
        const dtTd = el('td');
        append(dtTd, document.createTextNode(formatDate(b.date)));
        dtTd.appendChild(el('div', { className: 'cell-sub', text: b.time }));

        // Package badge
        const pkgTd = el('td');
        const pkgBadge = el('span', { className: 'badge badge-purple', text: pkgLabel(b.pkg) });
        pkgTd.appendChild(pkgBadge);

        // Staff
        const staffNames = (b.staff || []).slice(0, 2).join(', ') + ((b.staff || []).length > 2 ? ` +${b.staff.length - 2}` : '');

        // Revenue
        const revTd = el('td', { text: '$' + calcRevenue(b.guests, b.pkg).toLocaleString() });
        revTd.style.color      = 'var(--accent)';
        revTd.style.fontWeight = '500';

        append(row,
          evTd,
          clTd,
          dtTd,
          el('td', { text: String(b.guests) }),
          pkgTd,
          el('td', { text: staffNames }),
          (() => { const td = el('td'); td.appendChild(statusBadge(b.status)); return td; })(),
          revTd
        );
        tbody.appendChild(row);
      });
    }

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    append(container, toolbar, tabBar, tableWrap);
  }

  draw();

  // Listen for data changes from actions
  container._refresh = draw;
}

/* ── Booking detail modal ── */
function showBookingDetail(b, state, actions) {
  const body = el('div');

  // Two-col detail grid
  const grid = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' } });
  [
    ['Client',   b.client],
    ['Email',    b.email  || '—'],
    ['Phone',    b.phone  || '—'],
    ['Date',     formatDate(b.date)],
    ['Time',     b.time],
    ['Guests',   String(b.guests)],
    ['Package',  pkgLabel(b.pkg)],
    ['Venue',    b.venue  || '—'],
    ['Revenue',  '$' + calcRevenue(b.guests, b.pkg).toLocaleString() + ' + 7.5% VAT'],
    ['Status',   cap(b.status)]
  ].forEach(([k, v]) => {
    const cell = el('div');
    const lbl  = el('div', { text: k, style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '3px' } });
    const val  = el('div', { text: v, style: { fontSize: '13px', color: 'var(--text)', fontWeight: '500' } });
    append(cell, lbl, val);
    grid.appendChild(cell);
  });
  body.appendChild(grid);

  // Staff chips
  if ((b.staff || []).length > 0) {
    const staffSect = el('div', { style: { marginBottom: '1rem' } });
    const staffLbl  = el('div', { text: 'Staff', style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' } });
    const chips     = el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } });
    (b.staff || []).forEach((s, i) => {
      const c   = COLORS[i % COLORS.length];
      const chip = el('span', { className: 'chip', text: s });
      chip.style.color       = c.text;
      chip.style.borderColor = c.border;
      chips.appendChild(chip);
    });
    append(staffSect, staffLbl, chips);
    body.appendChild(staffSect);
  }

  // Notes
  if (b.notes) {
    const notesSect = el('div', { style: { marginBottom: '1rem' } });
    const notesLbl  = el('div', { text: 'Notes', style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '4px' } });
    const notesBox  = el('div', { text: b.notes, style: { fontSize: '13px', color: 'var(--text2)', lineHeight: '1.6', background: 'var(--bg3)', borderRadius: 'var(--r)', padding: '10px 12px' } });
    append(notesSect, notesLbl, notesBox);
    body.appendChild(notesSect);
  }

  // Actions
  const actionRow = el('div', { style: { display: 'flex', gap: '8px', paddingTop: '.75rem', borderTop: '1px solid var(--border)' } });

  const editBtn = el('button', {
    className: 'btn btn-primary btn-sm',
    html: '<i class="ti ti-edit"></i> Edit',
    onClick: () => { modal.close(); actions.openEditBooking(b); }
  });

  const delBtn = el('button', {
    className: 'btn btn-sm btn-danger',
    html: '<i class="ti ti-trash"></i> Delete',
    onClick: () => {
      if (confirm('Delete this booking?')) {
        actions.deleteBooking(b.id);
        modal.close();
      }
    }
  });

  append(actionRow, editBtn, delBtn);
  body.appendChild(actionRow);

  const modal = openModal(b.name, body);
}
