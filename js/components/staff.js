/* ============================================================
   js/components/staff.js — Staff management page
   ============================================================ */

function renderStaff(container, state, actions) {
  const { bookings } = state;

  function draw() {
    container.innerHTML = '';

    // Toolbar
    const toolbar = el('div', { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' } });
    const addBtn  = el('button', {
      className: 'btn btn-primary',
      html: '<i class="ti ti-user-plus"></i> Add staff',
      onClick: () => openAddStaffModal()
    });
    toolbar.appendChild(addBtn);

    // Staff grid
    const grid = el('div', { className: 'staff-grid' });

    state.staff.forEach(s => {
      const c      = COLORS[s.color % COLORS.length];
      const evCount = bookings.filter(b => (b.staff || []).includes(s.name)).length;
      const card   = el('div', { className: 'staff-card' });

      // Avatar
      const av = el('div', { className: 'staff-avatar', text: initials(s.name) });
      av.style.background = c.bg;
      av.style.color      = c.text;
      av.style.border     = `1.5px solid ${c.border}`;

      // Availability pips
      const availBar = el('div', { className: 'avail-bar' });
      s.avail.forEach((a, i) => {
        const pip = el('div', { className: 'avail-pip' });
        pip.style.background  = a ? 'var(--accent)' : 'var(--bg4)';
        pip.style.border      = `1px solid ${a ? 'rgba(74,222,128,.4)' : 'var(--border)'}`;
        pip.title             = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i];
        availBar.appendChild(pip);
      });

      // Action buttons
      const btnRow  = el('div', { style: { display: 'flex', gap: '6px', marginTop: '10px' } });
      const editBtn = el('button', {
        className: 'btn btn-sm',
        html: '<i class="ti ti-edit"></i> Edit',
        style: { flex: '1' },
        onClick: () => openEditStaffModal(s)
      });
      const delBtn = el('button', {
        className: 'btn btn-sm btn-danger',
        html: '<i class="ti ti-trash"></i>',
        onClick: () => {
          if (confirm(`Remove ${s.name} from the team?`)) {
            actions.deleteStaff(s.id);
          }
        }
      });
      append(btnRow, editBtn, delBtn);

      append(card,
        av,
        el('div', { className: 'staff-name',   text: s.name }),
        el('div', { className: 'staff-role',   text: s.role }),
        el('div', { className: 'staff-events', text: `${evCount} events assigned` }),
        availBar,
        el('div', { className: 'avail-label',  text: 'Availability (Sun – Sat)' }),
        s.phone ? el('div', { className: 'staff-phone', text: s.phone }) : null,
        btnRow
      );

      grid.appendChild(card);
    });

    append(container, toolbar, grid);
  }

  // ── Open modals ──
  function openAddStaffModal() {
    let modal;
    const formEl = buildStaffForm(null,
      data => { actions.addStaff({ ...data, id: Date.now() }); modal.close(); },
      ()   => modal.close()
    );
    modal = openModal('Add staff member', formEl);
  }

  function openEditStaffModal(s) {
    let modal;
    const formEl = buildStaffForm(s,
      data => { actions.updateStaff({ ...s, ...data }); modal.close(); },
      ()   => modal.close()
    );
    modal = openModal('Edit staff member', formEl);
  }

  draw();
  container._refresh = draw;
}
