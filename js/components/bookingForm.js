/* ============================================================
   js/components/bookingForm.js — Create / edit booking form
   ============================================================ */

/**
 * Builds and returns a booking form element.
 * @param {object|null} initial   - Existing booking to edit, or null for new
 * @param {Array}       staffList - Current staff list (from State)
 * @param {Function}    onSave    - Called with form data object on save
 * @param {Function}    onClose   - Called when Cancel is clicked
 */
function buildBookingForm(initial, staffList, onSave, onClose) {
  // Current data
  const data = Object.assign({
    name: '', client: '', phone: '', email: '',
    date: today(), time: '18:00', guests: '',
    pkg: 'silver', staff: [], status: 'pending',
    notes: '', venue: ''
  }, initial || {});

  const wrap = el('div');

  // Row: Event name + Venue
  const r1 = el('div', { className: 'form-row' });
  const nameGroup  = formGroup('Event name',  inputField('text',   data.name,   'e.g. Johnson Wedding Reception', v => data.name = v));
  const venueGroup = formGroup('Venue',        inputField('text',   data.venue,  'Location / address',              v => data.venue = v));
  append(r1, nameGroup, venueGroup);

  // Row: Client + Phone
  const r2 = el('div', { className: 'form-row' });
  const clientGroup = formGroup('Client name', inputField('text', data.client, 'Full name',      v => data.client = v));
  const phoneGroup  = formGroup('Phone',        inputField('text', data.phone,  '080-xxx-xxxx',  v => data.phone  = v));
  append(r2, clientGroup, phoneGroup);

  // Row: Email + Status
  const r3 = el('div', { className: 'form-row' });
  const emailGroup  = formGroup('Client email', inputField('email', data.email, 'client@email.com', v => data.email = v));
  const statusGroup = formGroup('Status',        selectField(data.status, ['pending','confirmed','completed','cancelled'], v => data.status = v));
  append(r3, emailGroup, statusGroup);

  // Row 3-col: Date + Time + Guests
  const r4 = el('div', { className: 'form-row3' });
  const dateGroup   = formGroup('Date',   inputField('date',   data.date,  '',    v => data.date   = v));
  const timeGroup   = formGroup('Time',   inputField('time',   data.time,  '',    v => data.time   = v));
  const guestsGroup = formGroup('Guests', inputField('number', data.guests,'0',   v => data.guests = v));
  append(r4, dateGroup, timeGroup, guestsGroup);

  // Row: Package
  const r5 = el('div', { className: 'form-row' });
  const pkgOptions = PACKAGES.map(p => `${p.name} — $${p.rate}/head`);
  const pkgValues  = PACKAGES.map(p => p.id);
  const pkgGroup   = formGroup('Package', selectField(data.pkg, pkgValues, v => data.pkg = v, pkgOptions));
  append(r5, pkgGroup, el('div'));

  // Staff assignment toggle buttons
  const staffLabelEl = el('label', { className: 'form-label', text: 'Assign staff' });
  const staffBtns    = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' } });

  staffList.forEach(s => {
    const c = COLORS[s.color % COLORS.length];
    const btn = el('button', {
      className: 'btn btn-sm',
      text: s.name,
      onClick: () => {
        const idx = data.staff.indexOf(s.name);
        if (idx > -1) {
          data.staff.splice(idx, 1);
          btn.style.background    = '';
          btn.style.color         = '';
          btn.style.borderColor   = '';
        } else {
          data.staff.push(s.name);
          btn.style.background    = c.bg;
          btn.style.color         = c.text;
          btn.style.borderColor   = c.border;
        }
      }
    });
    // Pre-select if editing
    if (data.staff.includes(s.name)) {
      btn.style.background  = c.bg;
      btn.style.color       = c.text;
      btn.style.borderColor = c.border;
    }
    staffBtns.appendChild(btn);
  });

  const staffGroup = el('div', { className: 'form-group' });
  append(staffGroup, staffLabelEl, staffBtns);

  // Notes
  const notesGroup = formGroup('Notes', textareaField(data.notes, 'Dietary requirements, special requests…', v => data.notes = v));

  // Action buttons
  const actions = el('div', { style: { display: 'flex', gap: '8px', paddingTop: '.5rem' } });
  const cancelBtn = el('button', { className: 'btn', text: 'Cancel', onClick: onClose });
  const saveBtn   = el('button', {
    className: 'btn btn-primary',
    html: `<i class="ti ti-check"></i> ${initial ? 'Update booking' : 'Create booking'}`,
    onClick: () => {
      if (!data.name || !data.date) { alert('Event name and date are required.'); return; }
      onSave({ ...data });
    }
  });
  append(actions, cancelBtn, saveBtn);

  append(wrap, r1, r2, r3, r4, r5, staffGroup, notesGroup, actions);
  return wrap;
}

/* ── Small form helpers ── */

function formGroup(labelText, inputEl) {
  const g = el('div', { className: 'form-group' });
  const l = el('label', { className: 'form-label', text: labelText });
  append(g, l, inputEl);
  return g;
}

function inputField(type, value, placeholder, onChange) {
  const input = el('input', { className: 'form-input', attrs: { type, placeholder: placeholder || '', value: value || '' } });
  input.addEventListener('input', e => onChange(e.target.value));
  return input;
}

function selectField(selected, values, onChange, labels) {
  const sel = el('select', { className: 'form-input' });
  values.forEach((v, i) => {
    const opt = el('option', { text: labels ? labels[i] : cap(v), attrs: { value: v } });
    if (v === selected) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', e => onChange(e.target.value));
  return sel;
}

function textareaField(value, placeholder, onChange) {
  const ta = el('textarea', { className: 'form-input', attrs: { placeholder: placeholder || '' } });
  ta.value = value || '';
  ta.addEventListener('input', e => onChange(e.target.value));
  return ta;
}
