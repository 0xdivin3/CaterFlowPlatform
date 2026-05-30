/* ============================================================
   js/components/invoices.js — Invoice list and detail view
   ============================================================ */

function renderInvoices(container, state) {
  drawList();

  function drawList() {
    container.innerHTML = '';
    container.appendChild(el('h2', { className: 'section-title', text: 'Invoices' }));

    const eligible = state.bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');

    if (eligible.length === 0) {
      const empty = el('div', { className: 'empty' });
      empty.innerHTML = '<i class="ti ti-receipt-off"></i><p>No confirmed bookings to invoice yet.</p>';
      container.appendChild(empty);
      return;
    }

    const tableWrap = el('div', { className: 'table-wrap' });
    const table     = el('table');
    const thead     = el('thead');
    const hRow      = el('tr');
    ['Invoice #', 'Event', 'Client', 'Date', 'Package', 'Total (incl. VAT)', 'Status'].forEach(h => {
      hRow.appendChild(el('th', { text: h }));
    });
    thead.appendChild(hRow);
    table.appendChild(thead);

    const tbody = el('tbody');
    eligible.forEach(b => {
      const sub   = calcRevenue(b.guests, b.pkg);
      const total = sub + Math.round(sub * 0.075);
      const row   = el('tr');
      row.addEventListener('click', () => drawInvoice(b));

      const totalTd = el('td', { text: '$' + total.toLocaleString() });
      totalTd.style.color      = 'var(--accent)';
      totalTd.style.fontWeight = '500';

      const statusTd = el('td');
      statusTd.appendChild(statusBadge(b.status));

      append(row,
        el('td', { html: `<strong>INV-${String(b.id).padStart(4,'0')}</strong>` }),
        el('td', { text: b.name }),
        el('td', { text: b.client }),
        el('td', { text: formatDate(b.date) }),
        (() => { const td = el('td'); td.appendChild(el('span', { className: 'badge badge-purple', text: pkgLabel(b.pkg) })); return td; })(),
        totalTd,
        statusTd
      );
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    container.appendChild(tableWrap);
  }

  function drawInvoice(b) {
    container.innerHTML = '';

    const pkg   = PACKAGES.find(p => p.id === b.pkg) || PACKAGES[1];
    const guests = parseInt(b.guests) || 0;
    const sub    = calcRevenue(guests, b.pkg);
    const tax    = Math.round(sub * 0.075);
    const total  = sub + tax;
    const invNum = 'INV-' + String(b.id).padStart(4, '0');
    const dueDate = new Date(b.date + 'T12:00:00');
    dueDate.setDate(dueDate.getDate() - 14);

    const paper = el('div', { className: 'invoice-paper' });

    // ── Header ──
    const hdr     = el('div', { className: 'invoice-header' });
    const logoDiv = el('div');
    const logo    = el('div', { className: 'invoice-logo' });
    logo.innerHTML = 'Cater<span>Flow</span>';
    logoDiv.appendChild(logo);
    logoDiv.appendChild(el('div', { text: 'Professional Catering · Lagos, Nigeria', style: { fontSize: '12px', color: 'var(--text3)', marginTop: '6px' } }));

    const numDiv = el('div', { style: { textAlign: 'right' } });
    numDiv.appendChild(el('div', { text: 'Invoice', style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' } }));
    numDiv.appendChild(el('div', { className: 'invoice-number', text: invNum }));
    numDiv.appendChild(el('div', { text: 'Issued: ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), style: { fontSize: '12px', color: 'var(--text3)', marginTop: '6px' } }));
    numDiv.appendChild(el('div', { text: 'Due: ' + dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), style: { fontSize: '12px', color: 'var(--amber)' } }));

    append(hdr, logoDiv, numDiv);
    paper.appendChild(hdr);

    // ── Bill to / event details ──
    const detailGrid = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' } });

    const billTo = el('div');
    billTo.appendChild(el('div', { text: 'Bill to', style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' } }));
    billTo.appendChild(el('div', { text: b.client, style: { fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '2px' } }));
    billTo.appendChild(el('div', { text: b.email  || '—', style: { fontSize: '12px', color: 'var(--text2)' } }));
    billTo.appendChild(el('div', { text: b.phone  || '—', style: { fontSize: '12px', color: 'var(--text2)' } }));

    const evDet = el('div');
    evDet.appendChild(el('div', { text: 'Event', style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' } }));
    evDet.appendChild(el('div', { text: b.name,              style: { fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '2px' } }));
    evDet.appendChild(el('div', { text: `${formatDate(b.date)} at ${b.time}`, style: { fontSize: '12px', color: 'var(--text2)' } }));
    evDet.appendChild(el('div', { text: b.venue || 'Venue TBD', style: { fontSize: '12px', color: 'var(--text2)' } }));

    append(detailGrid, billTo, evDet);
    paper.appendChild(detailGrid);

    // ── Line items table ──
    const lineTable = el('table', { className: 'invoice-table' });
    const lineHead  = el('thead');
    const lineHRow  = el('tr');
    ['Description', 'Qty', 'Unit price', 'Amount'].forEach((h, i) => {
      const th = el('th', { text: h });
      if (i === 3) th.style.textAlign = 'right';
      lineHRow.appendChild(th);
    });
    lineHead.appendChild(lineHRow);
    lineTable.appendChild(lineHead);

    const lineBody = el('tbody');
    [
      [`${pkg.name} package — full catering service`, `${guests} guests`, `$${pkg.rate}/head`, '$' + sub.toLocaleString()],
      ['Staff & service charge', `${(b.staff || []).length || 1} staff`, 'Included', '$0']
    ].forEach(row => {
      const tr = el('tr');
      row.forEach((cell, i) => {
        const td = el('td', { text: cell });
        if (i === 3) td.style.textAlign = 'right';
        tr.appendChild(td);
      });
      lineBody.appendChild(tr);
    });
    lineTable.appendChild(lineBody);
    paper.appendChild(lineTable);

    // ── Totals ──
    const totalsBlock = el('div', { className: 'invoice-total-block', style: { marginTop: '1.5rem' } });
    const totalsInner = el('div', { style: { textAlign: 'right' } });
    totalsInner.appendChild(el('div', { text: `Subtotal: $${sub.toLocaleString()}`,  style: { fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' } }));
    totalsInner.appendChild(el('div', { text: `VAT 7.5%: $${tax.toLocaleString()}`, style: { fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' } }));
    totalsInner.appendChild(el('div', { text: 'Total due',                           style: { fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' } }));
    totalsInner.appendChild(el('div', { className: 'invoice-total-val',              text: '$' + total.toLocaleString() }));
    totalsBlock.appendChild(totalsInner);
    paper.appendChild(totalsBlock);

    // ── Action buttons ──
    const actions = el('div', { style: { display: 'flex', gap: '8px', marginTop: '1rem' } });
    append(actions,
      el('button', { className: 'btn', html: '<i class="ti ti-arrow-left"></i> Back to invoices', onClick: drawList }),
      el('button', { className: 'btn btn-primary', html: '<i class="ti ti-printer"></i> Print / save PDF', onClick: () => window.print() })
    );

    append(container, paper, actions);
  }
}
