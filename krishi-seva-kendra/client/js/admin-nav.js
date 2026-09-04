function adminRequireAuth() {
  if (!Auth.isLoggedIn('Admin')) {
    window.location.href = 'admin-login.html';
  }
}

function renderAdminShell(activeKey) {
  const el = document.getElementById('admin-shell');
  if (!el) return;
  const admin = Auth.getUser();

  const links = [
    { key: 'dashboard', href: 'admin-dashboard.html', label: 'Overview' },
    { key: 'products', href: 'admin-products.html', label: 'Products' },
    { key: 'inquiries', href: 'admin-inquiries.html', label: 'Requests' },
    { key: 'farmers', href: 'admin-farmers.html', label: 'Farmers' },
    { key: 'content', href: 'admin-content.html', label: 'Schemes & tips' },
  ];

  el.innerHTML = `
    <header class="topbar">
      <div class="topbar-inner">
        <a href="admin-dashboard.html" class="brand">
          <span class="brand-mark"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 21V10L12 4L20 10V21H14V15H10V21H4Z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg></span>
          KSK Admin
        </a>
        <div class="flex-gap">
          <span class="text-muted" style="font-size:0.88rem;">${escapeHtml(admin ? admin.name : '')}</span>
          <button class="btn btn-outline btn-sm" id="admin-logout">Log out</button>
        </div>
      </div>
    </header>
    <section class="section container">
      <div class="dash-layout">
        <aside class="dash-side">
          <span class="dash-side-heading">Manage</span>
          ${links
            .map(
              (l) =>
                `<a href="${l.href}" class="${activeKey === l.key ? 'active' : ''}">${l.label}</a>`
            )
            .join('')}
        </aside>
        <div id="admin-content"></div>
      </div>
    </section>`;

  document.getElementById('admin-logout').addEventListener('click', () => Auth.logout('admin-login.html'));
}
