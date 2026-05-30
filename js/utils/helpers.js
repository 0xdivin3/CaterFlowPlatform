/* ============================================================
   js/utils/helpers.js — Shared utility functions
   ============================================================ */

/** Format a YYYY-MM-DD string to "12 May 2026" */
function formatDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

/** Get initials from a full name, e.g. "Maria G." → "MG" */
function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(x => x[0]).join('').toUpperCase();
}

/** Capitalise first letter */
function cap(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Calculate revenue: guests × rate per head */
function calcRevenue(guests, pkg) {
  const rates = { bronze: 25, silver: 45, gold: 75 };
  return (parseInt(guests) || 0) * (rates[pkg] || 0);
}

/** Return the package label e.g. "silver" → "Silver" */
function pkgLabel(p) {
  return p ? cap(p) : '—';
}

/** Build a status badge element */
function statusBadge(status) {
  const map = {
    confirmed: ['badge-green', 'Confirmed'],
    pending:   ['badge-amber', 'Pending'],
    completed: ['badge-gray',  'Completed'],
    cancelled: ['badge-red',   'Cancelled']
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  const span = document.createElement('span');
  span.className = 'badge ' + cls;
  span.textContent = label;
  return span;
}

/** Create a DOM element with optional class, text and attributes */
function el(tag, opts = {}) {
  const elem = document.createElement(tag);
  if (opts.className) elem.className = opts.className;
  if (opts.text)      elem.textContent = opts.text;
  if (opts.html)      elem.innerHTML = opts.html;
  if (opts.attrs) {
    Object.entries(opts.attrs).forEach(([k, v]) => elem.setAttribute(k, v));
  }
  if (opts.style) {
    Object.entries(opts.style).forEach(([k, v]) => elem.style[k] = v);
  }
  if (opts.onClick)   elem.addEventListener('click', opts.onClick);
  return elem;
}

/** Append multiple children to a parent element */
function append(parent, ...children) {
  children.forEach(c => { if (c) parent.appendChild(c); });
  return parent;
}

/** Clear and re-render a container */
function render(container, ...children) {
  container.innerHTML = '';
  append(container, ...children);
}

/** Today's date as YYYY-MM-DD */
function today() {
  return new Date().toISOString().split('T')[0];
}

/** Generate a unique ID */
function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

/** Show / hide an element */
function show(elem) { if (elem) elem.style.display = ''; }
function hide(elem) { if (elem) elem.style.display = 'none'; }
