/* ============================================================
   js/components/modal.js — Reusable modal dialog
   ============================================================ */

/**
 * Opens a modal overlay.
 * @param {string} title  - Modal heading
 * @param {HTMLElement} bodyEl - Content to place inside modal body
 * @param {object} [opts]
 * @param {string} [opts.width] - Override default width (e.g. '640px')
 * @returns {{ close: Function }} - Object with a close() method
 */
function openModal(title, bodyEl, opts = {}) {
  // Overlay
  const overlay = el('div', { className: 'modal-overlay' });

  // Box
  const box = el('div', { className: 'modal-box' });
  if (opts.width) box.style.width = opts.width;

  // Header
  const header = el('div', { className: 'modal-header' });
  const titleEl = el('h2', { className: 'modal-title', text: title });
  const closeBtn = el('button', {
    className: 'btn btn-ghost btn-sm',
    html: '<i class="ti ti-x"></i>',
    onClick: close
  });
  append(header, titleEl, closeBtn);

  // Body
  const body = el('div', { className: 'modal-body' });
  if (bodyEl) body.appendChild(bodyEl);

  append(box, header, body);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Close on backdrop click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Close on Escape key
  function onKey(e) { if (e.key === 'Escape') close(); }
  document.addEventListener('keydown', onKey);

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }

  return { close };
}
