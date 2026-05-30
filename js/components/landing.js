/* ============================================================
   js/components/landing.js — Marketing home page
   ============================================================ */

function renderLanding(container, onGetStarted, onSignIn) {
  container.innerHTML = '';

  const page = el('div');

  /* ── NAV ── */
  const nav = el('nav', { className: 'lp-nav' });

  const logo = el('div', { className: 'lp-nav-logo', onClick: () => {} });
  logo.innerHTML = `<div class="lp-nav-logo-icon"><i class="ti ti-bowl-chopsticks"></i></div>
                    <span class="lp-nav-logo-text">CaterFlow</span>`;

  const links = el('div', { className: 'lp-nav-links' });
  [['Features','#features'],['How it works','#how'],['Pricing','#pricing']].forEach(([label]) => {
    links.appendChild(el('span', { className: 'lp-nav-link', text: label }));
  });

  const navActions = el('div', { className: 'lp-nav-actions' });
  const signInBtn  = el('button', { className: 'lp-btn',         text: 'Sign in',     onClick: onSignIn });
  const startBtn   = el('button', { className: 'lp-btn lp-btn-primary', html: '<i class="ti ti-arrow-right"></i> Get started free', onClick: onGetStarted });
  append(navActions, signInBtn, startBtn);
  append(nav, logo, links, navActions);

  /* ── HERO ── */
  const hero = el('section', { className: 'lp-hero' });

  const badge = el('div', { className: 'lp-badge' });
  badge.innerHTML = `<i class="ti ti-sparkles"></i> Built for catering businesses`;

  const heroTitle = el('h1', { className: 'lp-hero-title' });
  heroTitle.innerHTML = `Schedule smarter.<br><span>Cater better.</span>`;

  const heroSub = el('p', { className: 'lp-hero-sub', text: 'CaterFlow brings your bookings, staff, packages and invoices into one clean platform — so you spend less time on admin and more time delivering great events.' });

  const heroActions = el('div', { className: 'lp-hero-actions' });
  const heroStart   = el('button', { className: 'lp-btn lp-btn-primary', html: '<i class="ti ti-rocket"></i> Start for free', onClick: onGetStarted });
  const heroDemo    = el('button', { className: 'lp-btn', html: '<i class="ti ti-player-play"></i> Try demo', onClick: () => {
    const demo = { id: 'demo', name: 'Demo Manager', email: 'demo@caterflow.com', role: 'manager', org: 'CaterFlow Demo' };
    Storage.set('cf_session', demo);
    onGetStarted('demo');
  }});
  append(heroActions, heroStart, heroDemo);

  /* ── PREVIEW MOCK ── */
  const preview = el('div', { className: 'lp-preview' });
  preview.innerHTML = `
    <div class="lp-preview-bar">
      <div class="lp-preview-dot" style="background:#f87171"></div>
      <div class="lp-preview-dot" style="background:#fbbf24"></div>
      <div class="lp-preview-dot" style="background:#4ade80"></div>
      <div class="lp-preview-url">appcaterflowcom/dashboard</div>
    </div>
    <div class="lp-preview-inner">
      <div class="lp-preview-sidebar">
        <div class="lp-preview-logo">
          <div class="lp-preview-logo-icon"><i class="ti ti-bowl-chopsticks"></i></div>
          <span class="lp-preview-logo-text">CaterFlow</span>
        </div>
        <div class="lp-preview-nav-item active"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="lp-preview-nav-item"><i class="ti ti-calendar"></i> Calendar</div>
        <div class="lp-preview-nav-item"><i class="ti ti-clipboard-list"></i> Bookings</div>
        <div class="lp-preview-nav-item"><i class="ti ti-users"></i> Staff</div>
        <div class="lp-preview-nav-item"><i class="ti ti-package"></i> Packages</div>
        <div class="lp-preview-nav-item"><i class="ti ti-receipt"></i> Invoices</div>
      </div>
      <div class="lp-preview-main">
        <div class="lp-preview-topbar">
          <div class="lp-preview-title">Overview</div>
          <div style="display:flex;gap:6px">
            <div style="background:#dcfce7;color:#15803d;font-size:9px;padding:4px 10px;border-radius:6px;font-weight:600">+ New booking</div>
          </div>
        </div>
        <div class="lp-preview-metrics">
          <div class="lp-preview-metric"><div class="lp-preview-metric-label">Events / month</div><div class="lp-preview-metric-value">14</div><div class="lp-preview-metric-sub">↑ 11 confirmed</div></div>
          <div class="lp-preview-metric"><div class="lp-preview-metric-label">Est. revenue</div><div class="lp-preview-metric-value">$28k</div><div class="lp-preview-metric-sub">↑ 14 events</div></div>
          <div class="lp-preview-metric"><div class="lp-preview-metric-label">Staff active</div><div class="lp-preview-metric-value">6</div><div class="lp-preview-metric-sub">32 events total</div></div>
          <div class="lp-preview-metric"><div class="lp-preview-metric-label">Pending</div><div class="lp-preview-metric-value" style="color:#d97706">3</div><div class="lp-preview-metric-sub" style="color:#d97706">Needs action</div></div>
        </div>
        <div class="lp-preview-events">
          <div class="lp-preview-event"><div class="lp-preview-event-stripe" style="background:#16a34a"></div><div><div class="lp-preview-event-name">Johnson Wedding Reception</div><div class="lp-preview-event-meta">22 May · 5:00 PM · 120 guests · Eko Hotel</div></div><div style="background:#dcfce7;color:#15803d;font-size:8px;padding:2px 7px;border-radius:100px;font-weight:600">Confirmed</div></div>
          <div class="lp-preview-event"><div class="lp-preview-event-stripe" style="background:#2563eb"></div><div><div class="lp-preview-event-name">TechCorp Annual Gala</div><div class="lp-preview-event-meta">24 May · 7:00 PM · 80 guests · VI Centre</div></div><div style="background:#dcfce7;color:#15803d;font-size:8px;padding:2px 7px;border-radius:100px;font-weight:600">Confirmed</div></div>
          <div class="lp-preview-event"><div class="lp-preview-event-stripe" style="background:#d97706"></div><div><div class="lp-preview-event-name">Rivera Quinceañera</div><div class="lp-preview-event-meta">28 May · 6:00 PM · 200 guests · Landmark</div></div><div style="background:#fef3c7;color:#92400e;font-size:8px;padding:2px 7px;border-radius:100px;font-weight:600">Pending</div></div>
        </div>
      </div>
    </div>`;

  append(hero, badge, heroTitle, heroSub, heroActions, preview);

  /* ── STATS ── */
  const stats = el('div', { className: 'lp-stats' });
  [['500+','Events managed'],['98%','Client satisfaction'],['3hrs','Saved per booking'],['6','Modules in one app']].forEach(([val, lbl]) => {
    const s = el('div', { className: 'lp-stat' });
    append(s, el('div', { className: 'lp-stat-value', text: val }), el('div', { className: 'lp-stat-label', text: lbl }));
    stats.appendChild(s);
  });

  /* ── FEATURES ── */
  const features = el('section', { className: 'lp-features' });
  append(features,
    el('div', { className: 'lp-section-eyebrow', text: 'Everything you need' }),
    el('h2',  { className: 'lp-section-title',   text: 'One platform, all the tools' }),
    el('p',   { className: 'lp-section-sub',     text: 'From the first client enquiry to the final invoice — CaterFlow has every step covered.' })
  );

  const fGrid = el('div', { className: 'lp-features-grid' });
  [
    { icon: 'ti-calendar-event', color: '#dcfce7', iconColor: '#16a34a', title: 'Smart Scheduling',      desc: 'Visual calendar with drag-and-drop booking. See your entire month at a glance and avoid double-booking.' },
    { icon: 'ti-clipboard-list', color: '#dbeafe', iconColor: '#2563eb', title: 'Booking Management',    desc: 'Track every client booking from pending to completed. Search, filter, and update in seconds.' },
    { icon: 'ti-users',          color: '#ede9fe', iconColor: '#7c3aed', title: 'Staff Coordination',    desc: 'Assign staff to events, track weekly availability, and build the right team for every occasion.' },
    { icon: 'ti-package',        color: '#fef3c7', iconColor: '#d97706', title: 'Packages & Menus',      desc: 'Define Bronze, Silver and Gold service tiers. Build menus and attach them directly to bookings.' },
    { icon: 'ti-receipt',        color: '#fee2e2', iconColor: '#dc2626', title: 'Invoice Generator',     desc: 'Auto-generate professional invoices per booking with VAT calculation. Print or save as PDF instantly.' },
    { icon: 'ti-bell',           color: '#dcfce7', iconColor: '#16a34a', title: 'Live Notifications',    desc: 'In-app alerts for new bookings, staff changes, reminders and payments — never miss a beat.' },
  ].forEach(f => {
    const card = el('div', { className: 'lp-feature-card' });
    const icon = el('div', { className: 'lp-feature-icon', html: `<i class="ti ${f.icon}" style="color:${f.iconColor}"></i>` });
    icon.style.background = f.color;
    append(card, icon, el('div', { className: 'lp-feature-title', text: f.title }), el('p', { className: 'lp-feature-desc', text: f.desc }));
    fGrid.appendChild(card);
  });
  features.appendChild(fGrid);

  /* ── HOW IT WORKS ── */
  const how = el('section', { className: 'lp-how' });
  append(how,
    el('div', { className: 'lp-section-eyebrow', text: 'How it works' }),
    el('h2',  { className: 'lp-section-title',   text: 'Up and running in minutes' }),
    el('p',   { className: 'lp-section-sub',     text: 'No complicated setup. Just sign up and start managing your events.' })
  );
  const steps = el('div', { className: 'lp-steps' });
  [
    { num: '1', title: 'Create account',   desc: 'Sign up free in under 2 minutes. No credit card required.' },
    { num: '2', title: 'Add your staff',   desc: 'Build your team and set their weekly availability.' },
    { num: '3', title: 'Create a booking', desc: 'Add a client event, assign staff, and choose a package.' },
    { num: '4', title: 'Generate invoice', desc: 'One click to produce a professional invoice with VAT.' },
  ].forEach(s => {
    const step = el('div', { className: 'lp-step' });
    append(step,
      el('div', { className: 'lp-step-num',   text: s.num }),
      el('div', { className: 'lp-step-title', text: s.title }),
      el('p',   { className: 'lp-step-desc',  text: s.desc })
    );
    steps.appendChild(step);
  });
  how.appendChild(steps);

  /* ── TESTIMONIALS ── */
  const testi = el('section', { className: 'lp-testimonials' });
  append(testi,
    el('div', { className: 'lp-section-eyebrow', text: 'Loved by caterers' }),
    el('h2',  { className: 'lp-section-title',   text: 'What our users say' })
  );
  const tGrid = el('div', { className: 'lp-testi-grid' });
  [
    { stars: '★★★★★', text: '"CaterFlow completely transformed how we handle bookings. What used to take hours now takes minutes. I can see my whole schedule and assign staff from one screen."', name: 'Amara Osei', role: 'Owner, Gold Fork Catering', bg: '#dcfce7', color: '#15803d' },
    { stars: '★★★★★', text: '"The invoice generator alone is worth it. Our clients receive professional invoices instantly and the VAT is calculated automatically. No more spreadsheet nightmares."', name: 'Tunde Adeyemi', role: 'Manager, Events & Bites Ltd', bg: '#dbeafe', color: '#1d4ed8' },
    { stars: '★★★★★', text: '"We manage 20+ events a month across three teams. The staff availability feature means we never accidentally double-book someone. Absolute lifesaver."', name: 'Ngozi Eze', role: 'Director, Prestige Caterers', bg: '#ede9fe', color: '#6d28d9' },
  ].forEach(t => {
    const card = el('div', { className: 'lp-testi-card' });
    const av   = el('div', { className: 'lp-testi-av', text: t.name.split(' ').map(x=>x[0]).join('') });
    av.style.background = t.bg; av.style.color = t.color;
    const author = el('div', { className: 'lp-testi-author' });
    const info   = el('div');
    append(info, el('div', { className: 'lp-testi-name', text: t.name }), el('div', { className: 'lp-testi-role', text: t.role }));
    append(author, av, info);
    append(card, el('div', { className: 'lp-testi-stars', text: t.stars }), el('p', { className: 'lp-testi-text', text: t.text }), author);
    tGrid.appendChild(card);
  });
  testi.appendChild(tGrid);

  /* ── CTA ── */
  const cta = el('section', { className: 'lp-cta' });
  const ctaActions = el('div', { className: 'lp-cta-actions' });
  append(ctaActions,
    el('button', { className: 'lp-btn lp-btn-primary', html: '<i class="ti ti-rocket"></i> Get started free', onClick: onGetStarted }),
    el('button', { className: 'lp-btn', html: '<i class="ti ti-player-play"></i> Try demo first', onClick: () => {
      const demo = { id: 'demo', name: 'Demo Manager', email: 'demo@caterflow.com', role: 'manager', org: 'CaterFlow Demo' };
      Storage.set('cf_session', demo);
      onGetStarted('demo');
    }})
  );
  append(cta,
    el('h2', { className: 'lp-cta-title', text: 'Ready to take control of your catering business?' }),
    el('p',  { className: 'lp-cta-sub',   text: 'Join hundreds of caterers already using CaterFlow. Free to get started.' }),
    ctaActions
  );

  /* ── FOOTER ── */
  const footer = el('footer', { className: 'lp-footer' });
  const fLogo  = el('div', { className: 'lp-footer-logo' });
  fLogo.innerHTML = `<div class="lp-footer-logo-icon"><i class="ti ti-bowl-chopsticks"></i></div><span class="lp-footer-logo-text">CaterFlow</span>`;
  const fLinks = el('div', { className: 'lp-footer-links' });
  ['Privacy','Terms','Contact'].forEach(l => fLinks.appendChild(el('span', { className: 'lp-footer-link', text: l })));
  append(footer, fLogo, el('span', { className: 'lp-footer-copy', text: `© ${new Date().getFullYear()} CaterFlow. All rights reserved.` }), fLinks);

  /* ── Assemble ── */
  append(page, nav, hero, stats, features, how, testi, cta, footer);
  container.appendChild(page);
}
