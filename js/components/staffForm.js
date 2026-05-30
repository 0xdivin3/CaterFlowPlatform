/* ============================================================
   js/components/staffForm.js — Add / edit staff member form
   ============================================================ */

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Builds and returns a staff form element.
 * @param {object|null} initial - Existing staff member or null for new
 * @param {Function}    onSave  - Called with staff data on save
 * @param {Function}    onClose - Called on cancel
 */
function buildStaffForm(initial, onSave, onClose) {
  const data = Object.assign({
    name: '', role: '', phone: '', email: '',
    avail: [true, true, true, true, true, false, false],
    color: Math.floor(Math.random() * COLORS.length)
  }, initial || {});

  // Deep-copy avail array so we don't mutate the original
  data.avail = [...data.avail];

  const wrap = el('div');

  // Row: Name + Role
  const r1 = el('div', { className: 'form-row' });
  append(r1,
    formGroup('Full name', inputField('text', data.name,  'e.g. Maria G.', v => data.name  = v)),
    formGroup('Role',       inputField('text', data.role,  'e.g. Head Chef', v => data.role  = v))
  );

  // Row: Phone + Email
  const r2 = el('div', { className: 'form-row' });
  append(r2,
    formGroup('Phone', inputField('text',  data.phone, '080-xxx-xxxx',   v => data.phone = v)),
    formGroup('Email', inputField('email', data.email, 'staff@email.com', v => data.email = v))
  );

  // Availability toggles
  const availLabel = el('label', { className: 'form-label', text: 'Weekly availability' });
  const availRow   = el('div', { style: { display: 'flex', gap: '6px', marginTop: '4px' } });

  DAYS_SHORT.forEach((d, i) => {
    const btn = el('button', {
      className: 'btn btn-sm',
      text: d,
      style: { flex: '1', padding: '6px 0' }
    });

    const applyStyle = () => {
      btn.style.background   = data.avail[i] ? '#dcfce7' : 'transparent';
      btn.style.color        = data.avail[i] ? '#15803d' : '#9ca3af';
      btn.style.borderColor  = data.avail[i] ? '#86efac' : '#e2e6ef';
    };

    applyStyle();
    btn.addEventListener('click', () => {
      data.avail[i] = !data.avail[i];
      applyStyle();
    });
    availRow.appendChild(btn);
  });

  const availGroup = el('div', { className: 'form-group' });
  append(availGroup, availLabel, availRow);

  // Actions
  const actions = el('div', { style: { display: 'flex', gap: '8px', marginTop: '1rem' } });
  const cancelBtn = el('button', { className: 'btn', text: 'Cancel', onClick: onClose });
  const saveBtn   = el('button', {
    className: 'btn btn-primary',
    html: `<i class="ti ti-check"></i> ${initial ? 'Update' : 'Add staff member'}`,
    onClick: () => {
      if (!data.name) { alert('Staff name is required.'); return; }
      onSave({ ...data });
    }
  });
  append(actions, cancelBtn, saveBtn);

  append(wrap, r1, r2, availGroup, actions);
  return wrap;
}
