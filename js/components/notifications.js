/* js/components/notifications.js */

const NOTIF_ICON  = { booking:'ti-calendar-event', staff:'ti-users', reminder:'ti-bell', payment:'ti-credit-card' };
const NOTIF_COLOR = { booking:'#1d4ed8',  staff:'#6d28d9',  reminder:'#92400e',  payment:'#15803d'  };
const NOTIF_BG    = { booking:'#dbeafe',  staff:'#ede9fe',  reminder:'#fef3c7',  payment:'#dcfce7'  };

function renderNotifications(container, state, actions) {
  function draw() {
    container.innerHTML = '';
    const unread = state.notifications.filter(n => !n.read).length;

    const topRow  = el('div', { style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'} });
    const left    = el('div');
    if (unread > 0) left.appendChild(el('span', { className:'badge badge-green', text:`${unread} unread` }));
    const markBtn = unread > 0 ? el('button', { className:'btn btn-sm', html:'<i class="ti ti-checks"></i> Mark all read', onClick:()=>{actions.markAllRead();draw();} }) : null;
    append(topRow, left, markBtn);

    const list = el('div', { className:'notif-list' });
    state.notifications.forEach(n => {
      const item = el('div', { className:`notif-item${!n.read?' unread':''}` });
      item.addEventListener('click', () => { actions.markRead(n.id); draw(); });
      const icon = el('div', { className:'notif-icon', html:`<i class="ti ${NOTIF_ICON[n.type]||'ti-bell'}"></i>` });
      icon.style.background = NOTIF_BG[n.type]    || '#f1f3f7';
      icon.style.color      = NOTIF_COLOR[n.type]  || '#4b5563';
      const content  = el('div');
      const titleEl  = el('div', { className:'notif-title', text:n.title });
      if (!n.read) titleEl.appendChild(el('span', { className:'notif-dot' }));
      const bodyEl   = el('div', { className:'notif-body', text:n.body });
      append(content, titleEl, bodyEl);
      append(item, icon, content, el('div', { className:'notif-time', text:n.time }));
      list.appendChild(item);
    });
    append(container, topRow, list);
  }
  draw();
  container._refresh = draw;
}
