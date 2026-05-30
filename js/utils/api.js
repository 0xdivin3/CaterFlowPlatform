/* Lightweight API wrapper — talks to the local JSON API if available */
(function(){
  const BASE = (window.API_BASE || (location.hostname === 'localhost' ? 'http://localhost:3000' : ''));

  function url(path){
    if (!BASE) throw new Error('API base not configured');
    return BASE.replace(/\/$/, '') + path;
  }

  async function isAvailable(){
    if (!BASE) return false;
    try {
      const res = await fetch(url('/api/ping'), { method: 'GET' });
      return res.ok;
    } catch (e) { return false; }
  }

  async function fetchState(){
    if (!BASE) throw new Error('No API base');
    const res = await fetch(url('/api/state')); if (!res.ok) throw new Error('Fetch failed');
    return res.json();
  }

  async function list(resource){ const res = await fetch(url(`/api/${resource}`)); if (!res.ok) throw new Error('Fetch failed'); return res.json(); }
  async function create(resource, data){ const res = await fetch(url(`/api/${resource}`), { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); if (!res.ok) throw new Error('Create failed'); return res.json(); }
  async function update(resource, id, data){ const res = await fetch(url(`/api/${resource}/${id}`), { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); if (!res.ok) throw new Error('Update failed'); return res.json(); }
  async function remove(resource, id){ const res = await fetch(url(`/api/${resource}/${id}`), { method:'DELETE' }); if (!res.ok) throw new Error('Delete failed'); return res.json(); }

  window.API = {
    isAvailable,
    fetchState,
    bookings: {
      list: () => list('bookings'),
      create: b => create('bookings', b),
      update: (id, b) => update('bookings', id, b),
      delete: id => remove('bookings', id)
    },
    staff: {
      list: () => list('staff'),
      create: s => create('staff', s),
      update: (id, s) => update('staff', id, s),
      delete: id => remove('staff', id)
    },
    notifications: {
      list: () => list('notifications'),
      create: n => create('notifications', n),
      update: (id, n) => update('notifications', id, n),
      delete: id => remove('notifications', id)
    },
    packages: { list: () => list('packages') },
    menu: { list: () => list('menu') }
  };
})();
