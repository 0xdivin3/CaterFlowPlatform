/* ============================================================
   js/components/auth.js — Sign-in and Sign-up screens
   ============================================================ */

/* ── SIGN IN ── */
function renderSignIn(container, onSignIn, onGoSignUp, onGoHome) {
  container.innerHTML = '';

  const wrap = el('div', { className: 'auth-wrap' });
  const card = el('div', { className: 'auth-card' });

  // Back to home
  if (onGoHome) {
    const back = el('button', { className: 'btn btn-ghost btn-sm', html: '<i class="ti ti-arrow-left"></i> Back to home', onClick: onGoHome, style: { marginBottom: '1rem', padding: '4px 0' } });
    back.style.boxShadow = 'none';
    card.appendChild(back);
  }

  card.appendChild(buildAuthLogo());
  card.appendChild(el('h1', { className: 'auth-title', text: 'Welcome back' }));
  card.appendChild(el('p',  { className: 'auth-sub',   text: 'Sign in to your account to continue' }));

  const errBanner = el('div', { className: 'auth-error', style: { display: 'none' } });
  card.appendChild(errBanner);

  const emailGroup = buildInputGroup('Email address', 'email', '', 'you@example.com');
  const pwGroup    = buildPwGroup('Password', '');
  const emailInput = emailGroup.querySelector('input');
  const pwInput    = pwGroup.querySelector('input');
  card.appendChild(emailGroup);
  card.appendChild(pwGroup);

  const signInBtn = el('button', { className: 'btn btn-primary btn-full', text: 'Sign in' });
  signInBtn.addEventListener('click', attemptSignIn);
  card.appendChild(signInBtn);

  card.appendChild(buildDivider('or'));

  const demoBtn = el('button', {
    className: 'btn btn-full',
    html: '<i class="ti ti-player-play"></i> Continue with demo account',
    style: { color: 'var(--blue)', borderColor: '#93c5fd' }
  });
  demoBtn.style.boxShadow = 'none';
  demoBtn.addEventListener('click', () => {
    const demo = { id: 'demo', name: 'Demo Manager', email: 'demo@caterflow.com', role: 'manager', org: 'CaterFlow Demo' };
    Storage.set('cf_session', demo);
    onSignIn(demo);
  });
  card.appendChild(demoBtn);

  const sw = el('div', { className: 'auth-switch' });
  sw.innerHTML = "Don't have an account? ";
  sw.appendChild(el('a', { text: 'Sign up', onClick: onGoSignUp }));
  card.appendChild(sw);

  wrap.appendChild(card);
  render(container, wrap);

  [emailInput, pwInput].forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') attemptSignIn(); }));

  function attemptSignIn() {
    const email = emailInput.value.trim();
    const pw    = pwInput.value;
    errBanner.style.display = 'none';
    if (!email || !pw) { showErr('Please enter your email and password.'); return; }
    signInBtn.disabled = true; signInBtn.textContent = 'Signing in…';
    setTimeout(() => {
      const users = Storage.get('cf_users', []);
      const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user)             { showErr('No account found with that email.'); reset(); return; }
      if (user.password !== pw) { showErr('Incorrect password.');            reset(); return; }
      const sess = { id: user.id, name: user.name, email: user.email, role: user.role, org: user.org };
      Storage.set('cf_session', sess);
      onSignIn(sess);
    }, 500);
  }

  function showErr(msg) { errBanner.innerHTML = `<i class="ti ti-alert-circle" style="margin-right:6px"></i>${msg}`; errBanner.style.display = ''; }
  function reset() { signInBtn.disabled = false; signInBtn.textContent = 'Sign in'; }
}

/* ── SIGN UP ── */
function renderSignUp(container, onSignUp, onGoSignIn, onGoHome) {
  let step = 1;
  const data = { name: '', email: '', org: '', role: 'manager', password: '', confirm: '' };

  draw();

  function draw() {
    container.innerHTML = '';
    const wrap = el('div', { className: 'auth-wrap' });
    const card = el('div', { className: 'auth-card' });

    if (onGoHome && step === 1) {
      const back = el('button', { className: 'btn btn-ghost btn-sm', html: '<i class="ti ti-arrow-left"></i> Back to home', onClick: onGoHome, style: { marginBottom: '1rem', padding: '4px 0' } });
      back.style.boxShadow = 'none';
      card.appendChild(back);
    }

    card.appendChild(buildAuthLogo());
    card.appendChild(el('h1', { className: 'auth-title', text: step === 1 ? 'Create your account' : 'Set your password' }));
    card.appendChild(el('p',  { className: 'auth-sub',   text: step === 1 ? 'Get started with CaterFlow today' : 'Almost there — secure your account' }));

    const stepsBar = el('div', { className: 'auth-steps' });
    [1,2].forEach(s => stepsBar.appendChild(el('div', { className: 'auth-step-bar' + (step >= s ? ' active' : '') })));
    card.appendChild(stepsBar);

    const errBanner = el('div', { className: 'auth-error', style: { display: 'none' } });
    card.appendChild(errBanner);
    function showErr(msg) { errBanner.innerHTML = `<i class="ti ti-alert-circle" style="margin-right:6px"></i>${msg}`; errBanner.style.display = ''; }

    if (step === 1) {
      const nameInp  = buildInputGroup('Full name',              'text',  data.name,  'Your full name');
      const emailInp = buildInputGroup('Work email',             'email', data.email, 'you@company.com');
      const orgInp   = buildInputGroup('Business / organisation','text',  data.org,   'e.g. Lagos Premier Catering');
      [nameInp, emailInp, orgInp].forEach(g => card.appendChild(g));

      const roleLbl = el('label', { className: 'form-label', text: 'Your role', style: { display: 'block', marginBottom: '6px' } });
      const roleRow = el('div', { className: 'role-select' });
      [{ v:'manager', label:'Manager', icon:'ti-briefcase', desc:'Full access' },
       { v:'staff',   label:'Staff',   icon:'ti-user',      desc:'View & update' }].forEach(r => {
        const opt = el('div', { className: `role-opt${data.role===r.v?' selected':''}` });
        opt.innerHTML = `<i class="ti ${r.icon}"></i><div class="role-name">${r.label}</div><div class="role-desc">${r.desc}</div>`;
        opt.addEventListener('click', () => {
          data.role = r.v;
          roleRow.querySelectorAll('.role-opt').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
        });
        roleRow.appendChild(opt);
      });
      const roleGroup = el('div', { className: 'form-group' });
      append(roleGroup, roleLbl, roleRow);
      card.appendChild(roleGroup);

      const contBtn = el('button', { className: 'btn btn-primary btn-full', text: 'Continue →' });
      contBtn.addEventListener('click', () => {
        data.name  = nameInp.querySelector('input').value.trim();
        data.email = emailInp.querySelector('input').value.trim();
        data.org   = orgInp.querySelector('input').value.trim();
        if (!data.name || !data.email || !data.org) { showErr('All fields are required.'); return; }
        if (!/\S+@\S+\.\S+/.test(data.email))       { showErr('Please enter a valid email.'); return; }
        const users = Storage.get('cf_users', []);
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) { showErr('An account with this email already exists.'); return; }
        step = 2; draw();
      });
      card.appendChild(contBtn);

    } else {
      const pw1 = buildPwGroup('Password', '');
      const pw2 = buildPwGroup('Confirm password', '');
      const pw1Input = pw1.querySelector('input');
      const pw2Input = pw2.querySelector('input');

      const review = el('div', { style: { background: 'var(--bg3)', borderRadius: 'var(--r)', padding: '12px', fontSize: '12px', color: 'var(--text2)', marginBottom: '1rem', border: '1px solid var(--border)' } });
      review.innerHTML = `<div style="font-weight:600;color:var(--text);margin-bottom:4px">Review your details</div><div>${data.name} · ${data.email}</div><div style="color:var(--text3);margin-top:2px">${data.org} · ${cap(data.role)}</div>`;

      append(card, pw1, pw2, review);

      const btnRow   = el('div', { style: { display: 'flex', gap: '8px' } });
      const backBtn  = el('button', { className: 'btn', html: '<i class="ti ti-arrow-left"></i> Back', onClick: () => { step = 1; draw(); } });
      const createBtn = el('button', { className: 'btn btn-primary', text: 'Create account', style: { flex: '1', justifyContent: 'center' } });
      createBtn.addEventListener('click', () => {
        data.password = pw1Input.value;
        data.confirm  = pw2Input.value;
        if (!data.password)            { showErr('Please set a password.'); return; }
        if (data.password.length < 6)  { showErr('Password must be at least 6 characters.'); return; }
        if (data.password !== data.confirm) { showErr('Passwords do not match.'); return; }
        createBtn.disabled = true; createBtn.textContent = 'Creating account…';
        setTimeout(() => {
          const users = Storage.get('cf_users', []);
          const nu = { id: 'u_' + Date.now(), name: data.name, email: data.email, org: data.org, role: data.role, password: data.password, createdAt: new Date().toISOString() };
          Storage.set('cf_users', [...users, nu]);
          const sess = { id: nu.id, name: nu.name, email: nu.email, role: nu.role, org: nu.org };
          Storage.set('cf_session', sess);
          onSignUp(sess);
        }, 500);
      });
      append(btnRow, backBtn, createBtn);
      card.appendChild(btnRow);
    }

    const sw = el('div', { className: 'auth-switch' });
    sw.innerHTML = 'Already have an account? ';
    sw.appendChild(el('a', { text: 'Sign in', onClick: onGoSignIn }));
    card.appendChild(sw);

    wrap.appendChild(card);
    render(container, wrap);
  }
}

/* ── Shared helpers ── */
function buildAuthLogo() {
  const wrap = el('div', { className: 'auth-logo' });
  const icon = el('div', { className: 'auth-logo-icon', html: '<i class="ti ti-bowl-chopsticks" style="font-size:22px"></i>' });
  const text = el('div');
  append(text, el('div', { className: 'auth-logo-text', text: 'CaterFlow' }), el('div', { className: 'auth-logo-sub', text: 'Scheduling Platform' }));
  append(wrap, icon, text);
  return wrap;
}
function buildInputGroup(label, type, value, placeholder) {
  const g = el('div', { className: 'form-group' });
  const l = el('label', { className: 'form-label', text: label });
  const i = el('input', { className: 'form-input', attrs: { type, value: value||'', placeholder: placeholder||'' } });
  append(g, l, i); return g;
}
function buildPwGroup(label) {
  const g    = el('div', { className: 'form-group' });
  const lbl  = el('label', { className: 'form-label', text: label });
  const wrap = el('div', { className: 'pw-wrap' });
  const inp  = el('input', { className: 'form-input', attrs: { type: 'password', placeholder: '••••••' } });
  const eye  = el('button', { className: 'pw-eye', html: '<i class="ti ti-eye"></i>' });
  let vis = false;
  eye.addEventListener('click', () => { vis = !vis; inp.type = vis ? 'text' : 'password'; eye.innerHTML = `<i class="ti ${vis?'ti-eye-off':'ti-eye'}"></i>`; });
  append(wrap, inp, eye); append(g, lbl, wrap); return g;
}
function buildDivider(text) {
  return el('div', { className: 'auth-divider', text });
}
