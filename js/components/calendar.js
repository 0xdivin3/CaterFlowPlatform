/* ============================================================
   js/components/calendar.js — Monthly calendar view
   ============================================================ */

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function renderCalendar(container, state, actions) {
  const { bookings } = state;
  const now = new Date();

  // Track current month/year in a local object so nav works
  let current = { month: now.getMonth(), year: now.getFullYear() };

  function draw() {
    container.innerHTML = '';

    const { month, year } = current;

    // ── Header ──
    const header  = el('div', { className: 'cal-header' });
    const nav     = el('div', { className: 'cal-nav' });
    const prevBtn = el('button', { className: 'btn btn-sm', html: '<i class="ti ti-chevron-left"></i>', onClick: () => { if (month === 0) { current = { month: 11, year: year - 1 }; } else { current = { month: month - 1, year }; } draw(); } });
    const label   = el('div', { className: 'cal-month-label', text: `${MONTH_NAMES[month]} ${year}` });
    const nextBtn = el('button', { className: 'btn btn-sm', html: '<i class="ti ti-chevron-right"></i>', onClick: () => { if (month === 11) { current = { month: 0, year: year + 1 }; } else { current = { month: month + 1, year }; } draw(); } });
    append(nav, prevBtn, label, nextBtn);

    const addBtn = el('button', { className: 'btn btn-primary', html: '<i class="ti ti-plus"></i> Add event', onClick: actions.openNewBooking });
    append(header, nav, addBtn);

    // ── Grid ──
    const grid = el('div', { className: 'cal-grid' });

    // Day labels
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      grid.appendChild(el('div', { className: 'cal-day-label', text: d }));
    });

    // Blank cells before first day
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(el('div', { className: 'cal-cell dim' }));
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr  = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday  = now.getDate() === d && now.getMonth() === month && now.getFullYear() === year;
      const dayEvents = bookings.filter(b => b.date === dateStr);

      const cell = el('div', { className: `cal-cell${isToday ? ' today' : ''}`, onClick: actions.openNewBooking });

      cell.appendChild(el('div', { className: 'cal-date', text: String(d) }));

      dayEvents.slice(0, 2).forEach((b, j) => {
        const c    = COLORS[j % COLORS.length];
        const chip = el('div', { className: 'cal-event-chip', text: b.name });
        chip.style.background = c.bg;
        chip.style.color      = c.text;
        cell.appendChild(chip);
      });

      if (dayEvents.length > 2) {
        cell.appendChild(el('div', { className: 'cal-more', text: `+${dayEvents.length - 2} more` }));
      }

      grid.appendChild(cell);
    }

    append(container, header, grid);
  }

  draw();
}
