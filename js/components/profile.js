/* ============================================================
   js/components/profile.js — User profile & settings page
   ============================================================ */

function renderProfile(container, state, actions) {
  container.innerHTML = '';

  const user  = state.session;
  const users = Storage.get('cf_users', []);
  const dbUser = users.find(u => u.id === user.id);   // null = demo account

  // ── Profile data (editable) ──
  const profileData = { name: user.name, org: user.org || '' };
  const pwData      = { old: '', new1: '', new2: '' };

  // ── Layout grid ──
  const grid = el('div', { className: 'profile-grid' });

  /* ─── Left column: avatar card ─── */
  const leftCard = el('div', { className: 'card', style: { textAlign: 'center' } });
  const c        = COLORS[0];

  const av = el('div', { className: 'profile-avatar-big', text: initials(user.name) });
  av.style.background = c.bg;
  av.style.color      = c.text;
  av.style.border     = `2px solid ${c.border}`;

  const nameEl  = el('div', { text: user.name,  style: { fontFamily: 'DM Serif Display,serif', fontSize: '18px', color: 'var(--text)', marginBottom: '4px' } });
  const emailEl = el('div', { text: user.email, style: { fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' } });
  const orgEl   = el('div', { text: user.org || 'CaterFlow', style: { fontSize: '12px', color: 'var(--text3)', marginBottom: '12px' } });
  const roleBadge = el('span', { className: 'badge badge-purple', text: user.role === 'manager' ? 'Manager' : 'Staff' });

  const signOutWrap = el('div', { style: { marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' } });
  const signOutBtn  = el('button', {
    className: 'btn btn-danger btn-full',
    html: '<i class="ti ti-logout"></i> Sign out',
    onClick: actions.signOut
  });
  signOutWrap.appendChild(signOutBtn);

  append(leftCard, av, nameEl, emailEl, orgEl, roleBadge, signOutWrap);

  /* ─── Right column ─── */
  const rightCol = el('div');

  // Feedback banners (shared)
  const successBanner = el('div', { className: 'auth-success', style: { display: 'none', marginBottom: '1rem' } });
  const errorBanner   = el('div', { className: 'auth-error',   style: { display: 'none', marginBottom: '1rem' } });

  function showMsg(type, msg) {
    if (type === 'success') {
      successBanner.style.display = '';
      successBanner.innerHTML = `<i class="ti ti-circle-check" style="margin-right:6px"></i>${msg}`;
      errorBanner.style.display = 'none';
    } else {
      errorBanner.style.display = '';
      errorBanner.innerHTML = `<i class="ti ti-alert-circle" style="margin-right:6px"></i>${msg}`;
      successBanner.style.display = 'none';
    }
  }

  // Profile info card
  const profileCard = el('div', { className: 'card', style: { marginBottom: '1rem' } });
  profileCard.appendChild(el('h2', { className: 'section-title', text: 'Profile information' }));

  const nameInput = buildLabelInput('Full name', user.name, v => profileData.name = v);
  const emailInp  = buildLabelInput('Email address', user.email, null);  // readonly
  emailInp.querySelector('input').disabled = true;
  emailInp.querySelector('input').style.opacity = '0.5';
  const orgInput  = buildLabelInput('Business name', user.org || '', v => profileData.org = v);

  const saveProfileBtn = el('button', {
    className: 'btn btn-primary',
    html: '<i class="ti ti-check"></i> Save changes',
    onClick: () => {
      if (!profileData.name) { showMsg('error', 'Name is required.'); return; }
      const updated = users.map(u => u.id === user.id ? { ...u, name: profileData.name, org: profileData.org } : u);
      Storage.set('cf_users', updated);
      const sess = { ...Storage.get('cf_session', {}), name: profileData.name, org: profileData.org };
      Storage.set('cf_session', sess);
      showMsg('success', 'Profile updated successfully.');
    }
  });

  append(profileCard, nameInput, emailInp, orgInput, saveProfileBtn);

  // Change password card
  const pwCard = el('div', { className: 'card' });
  pwCard.appendChild(el('h2', { className: 'section-title', text: 'Change password' }));

  if (!dbUser) {
    pwCard.appendChild(el('div', { text: 'Demo account — password changes are disabled.', style: { fontSize: '13px', color: 'var(--text3)', marginBottom: '1rem' } }));
  }

  const oldPwWrap  = buildPwInput('Current password', v => pwData.old  = v);
  const new1PwWrap = buildPwInput('New password',      v => pwData.new1 = v);
  const new2PwWrap = buildPwInput('Confirm new password', v => pwData.new2 = v);

  const pwRow = el('div', { className: 'form-row' });
  append(pwRow, new1PwWrap, new2PwWrap);

  const changePwBtn = el('button', {
    className: 'btn btn-primary',
    html: '<i class="ti ti-lock"></i> Change password',
    onClick: () => {
      if (!dbUser)          { showMsg('error', 'Demo account — cannot change password.'); return; }
      if (dbUser.password !== pwData.old) { showMsg('error', 'Current password is incorrect.'); return; }
      if (pwData.new1.length < 6)  { showMsg('error', 'New password must be at least 6 characters.'); return; }
      if (pwData.new1 !== pwData.new2)    { showMsg('error', 'Passwords do not match.'); return; }
      const updated = users.map(u => u.id === user.id ? { ...u, password: pwData.new1 } : u);
      Storage.set('cf_users', updated);
      pwData.old = pwData.new1 = pwData.new2 = '';
      oldPwWrap.querySelector('input').value  = '';
      new1PwWrap.querySelector('input').value = '';
      new2PwWrap.querySelector('input').value = '';
      showMsg('success', 'Password changed successfully.');
    }
  });
  if (!dbUser) changePwBtn.disabled = true;

  append(pwCard, oldPwWrap, pwRow, changePwBtn);

  append(rightCol, successBanner, errorBanner, profileCard, pwCard);
  append(grid, leftCard, rightCol);
  container.appendChild(grid);
}

/* ── Helpers ── */
function buildLabelInput(label, value, onChange) {
  const g   = el('div', { className: 'form-group' });
  const lbl = el('label', { className: 'form-label', text: label });
  const inp = el('input', { className: 'form-input', attrs: { type: 'text', value: value || '' } });
  if (onChange) inp.addEventListener('input', e => onChange(e.target.value));
  append(g, lbl, inp);
  return g;
}

function buildPwInput(label, onChange) {
  const g   = el('div', { className: 'form-group' });
  const lbl = el('label', { className: 'form-label', text: label });
  const wrap = el('div', { className: 'pw-wrap' });
  const inp  = el('input', { className: 'form-input', attrs: { type: 'password', placeholder: '••••••' } });
  const eye  = el('button', { className: 'pw-eye', html: '<i class="ti ti-eye"></i>' });
  let visible = false;
  eye.addEventListener('click', () => {
    visible = !visible;
    inp.type = visible ? 'text' : 'password';
    eye.innerHTML = `<i class="ti ${visible ? 'ti-eye-off' : 'ti-eye'}"></i>`;
  });
  inp.addEventListener('input', e => onChange(e.target.value));
  append(wrap, inp, eye);
  append(g, lbl, wrap);
  return g;
}
