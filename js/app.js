/* ============================================================
   js/app.js — App shell, state management, routing
   ============================================================ */

const State = {
  session:       Storage.get('cf_session', null),
  bookings:      Storage.get('cf_bookings',      SEED_BOOKINGS),
  staff:         Storage.get('cf_staff',          SEED_STAFF),
  notifications: Storage.get('cf_notifications',  SEED_NOTIFICATIONS),
  currentView:   'dashboard'
};

function persist() {
  Storage.set('cf_bookings',      State.bookings);
  Storage.set('cf_staff',         State.staff);
  Storage.set('cf_notifications', State.notifications);
}

/* ── Actions ── */
const Actions = {

  addBooking(data) {
    const local = { ...data, id: Date.now() };
    State.bookings = [...State.bookings, local];
    Actions.addNotification('booking', 'New booking created', `${data.name} added to the schedule.`);
    persist(); App.refreshCurrentView();
    if (window.API) {
      API.bookings.create(data).then(serverItem => {
        State.bookings = State.bookings.map(b => b.id === local.id ? serverItem : b);
        persist(); App.refreshCurrentView();
      }).catch(() => console.warn('API create booking failed'));
    }
  },
  updateBooking(data) {
    State.bookings = State.bookings.map(b => b.id === data.id ? { ...b, ...data } : b);
    Actions.addNotification('booking', 'Booking updated', `${data.name} has been updated.`);
    persist(); App.refreshCurrentView();
    if (window.API && data.id) {
      API.bookings.update(data.id, data).catch(() => console.warn('API update booking failed'));
    }
  },
  deleteBooking(id) {
    State.bookings = State.bookings.filter(b => b.id !== id);
    persist(); App.refreshCurrentView();
    if (window.API) {
      API.bookings.delete(id).catch(() => console.warn('API delete booking failed'));
    }
  },
  openNewBooking() {
    let modal;
    const formEl = buildBookingForm(null, State.staff,
      data => { Actions.addBooking(data); modal.close(); },
      ()   => modal.close()
    );
    modal = openModal('New booking', formEl);
  },
  openEditBooking(b) {
    let modal;
    const formEl = buildBookingForm(b, State.staff,
      data => { Actions.updateBooking({ ...b, ...data }); modal.close(); },
      ()   => modal.close()
    );
    modal = openModal('Edit booking', formEl);
  },

  addStaff(data) {
    const local = { ...data, id: Date.now() };
    State.staff = [...State.staff, local];
    persist(); App.refreshCurrentView();
    if (window.API) {
      API.staff.create(data).then(srv => { State.staff = State.staff.map(s => s.id === local.id ? srv : s); persist(); App.refreshCurrentView(); }).catch(() => console.warn('API create staff failed'));
    }
  },
  updateStaff(data) {
    State.staff = State.staff.map(s => s.id === data.id ? { ...s, ...data } : s);
    persist(); App.refreshCurrentView();
    if (window.API && data.id) {
      API.staff.update(data.id, data).catch(() => console.warn('API update staff failed'));
    }
  },
  deleteStaff(id) {
    State.staff = State.staff.filter(s => s.id !== id);
    persist(); App.refreshCurrentView();
    if (window.API) {
      API.staff.delete(id).catch(() => console.warn('API delete staff failed'));
    }
  },

  addNotification(type, title, body) {
    const notif = { id: Date.now(), type, title, body, time: 'Just now', read: false };
    State.notifications = [notif, ...State.notifications];
    persist(); App.updateNotifBadge();
    if (window.API) {
      API.notifications.create({ type, title, body }).catch(() => console.warn('API create notification failed'));
    }
  },
  markRead(id) {
    State.notifications = State.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    persist(); App.updateNotifBadge();
    if (window.API) { API.notifications.update(id, { read: true }).catch(() => console.warn('API update notification failed')); }
  },
  markAllRead() {
    State.notifications = State.notifications.map(n => ({ ...n, read: true }));
    persist(); App.updateNotifBadge();
    if (window.API) { State.notifications.forEach(n => { API.notifications.update(n.id, { read: true }).catch(()=>{}); }); }
  },

  signOut() {
    Storage.remove('cf_session');
    State.session = null;
    App.boot();
  }
};

/* ── App Shell ── */
const App = {
  root: document.getElementById('app'),

  async boot() {
    // Always start at landing page (home) unless already logged in
    if (State.session) {
      if (window.API) {
        const avail = await API.isAvailable().catch(() => false);
        if (avail) {
          try {
            const data = await API.fetchState();
            State.bookings = data.bookings || State.bookings;
            State.staff = data.staff || State.staff;
            State.notifications = data.notifications || State.notifications;
            persist();
          } catch (e) { console.warn('API sync failed', e); }
        }
      }
      this.renderShell();
      this.navigate('dashboard');
    } else {
      this.renderLandingPage();
    }
  },

  /* Landing / home page */
  renderLandingPage() {
    this.root.innerHTML = '';
    renderLanding(
      this.root,
      (mode) => {
        // "demo" means skip auth and go straight in
        if (mode === 'demo') {
          State.session = Storage.get('cf_session', null);
          this.renderShell();
          this.navigate('dashboard');
        } else {
          this.renderAuth('signup');
        }
      },
      () => this.renderAuth('signin')
    );
  },

  /* Auth screens */
  renderAuth(page) {
    this.root.innerHTML = '';
    if (page === 'signin') {
      renderSignIn(
        this.root,
        sess  => { State.session = sess; this.renderShell(); this.navigate('dashboard'); },
        ()    => this.renderAuth('signup'),
        ()    => this.renderLandingPage()   // back to home
      );
    } else {
      renderSignUp(
        this.root,
        sess  => { State.session = sess; this.renderShell(); this.navigate('dashboard'); },
        ()    => this.renderAuth('signin'),
        ()    => this.renderLandingPage()   // back to home
      );
    }
  },

  /* Build persistent sidebar + topbar shell */
  renderShell() {
    this.root.innerHTML = '';
    const layout  = el('div', { className: 'app-layout' });
    const sidebar = this.buildSidebar();
    const mainCol = el('div', { className: 'main-col' });
    this.topbar   = this.buildTopbar();
    this.content  = el('div', { className: 'page-content' });
    append(mainCol, this.topbar, this.content);
    append(layout, sidebar, mainCol);
    this.root.appendChild(layout);
    this.sidebar = sidebar;
  },

  buildSidebar() {
    const sidebar = el('div', { className: 'sidebar' });

    const logoDiv = el('div', { className: 'sidebar-logo', style: { cursor: 'pointer' }, onClick: () => { Actions.signOut(); } });
    logoDiv.innerHTML = `
      <div class="sidebar-logo-icon"><i class="ti ti-bowl-chopsticks" style="font-size:17px"></i></div>
      <div>
        <div class="sidebar-logo-text">CaterFlow</div>
        <div class="sidebar-logo-sub">Scheduling Platform</div>
      </div>`;
    sidebar.appendChild(logoDiv);

    const nav = el('div', { className: 'sidebar-nav' });
    const pages = [
      { section: 'Main' },
      { key: 'dashboard',     label: 'Dashboard',      icon: 'ti-layout-dashboard' },
      { key: 'calendar',      label: 'Calendar',        icon: 'ti-calendar' },
      { key: 'bookings',      label: 'Bookings',        icon: 'ti-clipboard-list' },
      { section: 'Management' },
      { key: 'staff',         label: 'Staff',           icon: 'ti-users' },
      { key: 'packages',      label: 'Packages & Menu', icon: 'ti-package' },
      { key: 'invoices',      label: 'Invoices',        icon: 'ti-receipt' },
      { section: 'Alerts' },
      { key: 'notifications', label: 'Notifications',   icon: 'ti-bell', notif: true },
      { section: 'Account' },
      { key: 'profile',       label: 'Profile',         icon: 'ti-user-circle' },
    ];

    this.navItems = {};
    pages.forEach(p => {
      if (p.section) { nav.appendChild(el('div', { className: 'nav-section', text: p.section })); return; }
      const item = el('div', { className: 'nav-item', onClick: () => this.navigate(p.key) });
      item.innerHTML = `<i class="ti ${p.icon}"></i>${p.label}`;
      if (p.notif) {
        this.notifBadge = el('span', { className: 'badge badge-green', style: { marginLeft: 'auto', padding: '2px 7px', fontSize: '10px', display: 'none' } });
        item.appendChild(this.notifBadge);
      }
      this.navItems[p.key] = item;
      nav.appendChild(item);
    });
    sidebar.appendChild(nav);

    const bottom = el('div', { className: 'sidebar-bottom' });
    const u = State.session;
    bottom.innerHTML = `
      <div class="user-chip">
        <div class="user-av">${initials(u.name)}</div>
        <div>
          <div class="user-name">${u.name}</div>
          <div class="user-role">${u.role === 'manager' ? 'Manager' : 'Staff'}</div>
        </div>
      </div>`;
    sidebar.appendChild(bottom);
    return sidebar;
  },

  buildTopbar() {
    const bar   = el('div', { className: 'topbar' });
    const left  = el('div', { className: 'topbar-left' });
    this.pageTitleEl = el('div', { className: 'page-title', text: 'Overview' });
    this.pageSubEl   = el('div', { className: 'page-sub' });
    this.updatePageSub();
    append(left, this.pageTitleEl, this.pageSubEl);

    const right     = el('div', { className: 'topbar-right' });
    const notifBtn  = el('button', { className: 'btn btn-ghost notif-btn', html: '<i class="ti ti-bell" style="font-size:16px"></i>', onClick: () => this.navigate('notifications') });
    this.topbarDot  = el('div', { className: 'notif-dot', style: { display: 'none' } });
    notifBtn.appendChild(this.topbarDot);

    const newBtn = el('button', {
      className: 'btn btn-primary',
      html: '<i class="ti ti-plus"></i> New booking',
      onClick: () => Actions.openNewBooking()
    });
    append(right, notifBtn, newBtn);
    append(bar, left, right);
    return bar;
  },

  navigate(view) {
    State.currentView = view;
    Object.entries(this.navItems).forEach(([k, item]) => item.classList.toggle('active', k === view));

    const titles = {
      dashboard: 'Overview', calendar: 'Calendar', bookings: 'Bookings',
      staff: 'Staff & Availability', packages: 'Packages & Menu',
      invoices: 'Invoices', notifications: 'Notifications', profile: 'My Profile'
    };
    this.pageTitleEl.textContent = titles[view] || view;
    this.updatePageSub();
    this.updateNotifBadge();

    this.content.innerHTML = '';
    switch (view) {
      case 'dashboard':     renderDashboard(this.content, State, Actions);    break;
      case 'calendar':      renderCalendar(this.content, State, Actions);      break;
      case 'bookings':      renderBookings(this.content, State, Actions);      break;
      case 'staff':         renderStaff(this.content, State, Actions);         break;
      case 'packages':      renderPackages(this.content, State);               break;
      case 'invoices':      renderInvoices(this.content, State);               break;
      case 'notifications': renderNotifications(this.content, State, Actions); break;
      case 'profile':       renderProfile(this.content, State, Actions);       break;
    }
  },

  refreshCurrentView() { this.navigate(State.currentView); },

  updatePageSub() {
    if (this.pageSubEl) {
      const firstName = State.session ? State.session.name.split(' ')[0] : '';
      const dateStr   = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      this.pageSubEl.textContent = `Welcome back, ${firstName} · ${dateStr}`;
    }
  },

  updateNotifBadge() {
    const count = State.notifications.filter(n => !n.read).length;
    if (this.notifBadge) { this.notifBadge.textContent = String(count); this.notifBadge.style.display = count > 0 ? '' : 'none'; }
    if (this.topbarDot)  { this.topbarDot.style.display = count > 0 ? '' : 'none'; }
  }
};

App.boot();
