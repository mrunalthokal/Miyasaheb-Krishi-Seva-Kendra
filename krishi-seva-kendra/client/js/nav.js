const BRAND_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21C12 21 5 16.5 5 10.5C5 6.9 7.9 4 11.5 4C12.5 4 13 4.5 13 4.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M12 21C12 14 16 10 20 8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M12 21C12 15 9 12 6 10.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

function renderNavbar(activePage) {
  const el = document.getElementById('site-header');
  if (!el) return;

  const farmer = Auth.isLoggedIn('Farmer') ? Auth.getUser() : null;

  const links = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'products.html', label: 'Products', key: 'products' },
    { href: 'schemes.html', label: 'Schemes', key: 'schemes' },
    { href: 'crop-tips.html', label: 'Crop tips', key: 'croptips' },
    { href: 'weather.html', label: 'Weather', key: 'weather' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];

  const linksHtml = links
    .map(
      (l) =>
        `<a href="${l.href}" class="${activePage === l.key ? 'active' : ''}">${l.label}</a>`
    )
    .join('');

  const ctaHtml = farmer
    ? `<a href="dashboard.html" class="btn btn-outline btn-sm">${escapeHtml(farmer.name.split(' ')[0])}</a>
       <button class="btn btn-primary btn-sm" id="nav-logout">Log out</button>`
    : `<a href="login.html" class="btn btn-outline btn-sm">Log in</a>
       <a href="register.html" class="btn btn-primary btn-sm">Register</a>`;

  el.innerHTML = `
    <header class="topbar">
      <div class="topbar-inner">
        <a href="index.html" class="brand">
          <span class="brand-mark">${BRAND_SVG}</span>
          Krishi Seva Kendra
        </a>
        <nav class="nav-links" id="nav-links">${linksHtml}</nav>
        <div class="nav-cta" id="nav-cta">${ctaHtml}</div>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#2b2117" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </header>`;

  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
    document.getElementById('nav-cta').classList.toggle('open');
  });

  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout('index.html'));
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <h4 style="font-family: var(--font-head); color: #fff; font-size: 1.15rem;">Krishi Seva Kendra</h4>
          <p style="color: #a9bda3; max-width: 340px;">A digital front door to the local agri-input center — browse supplies, track requests, and stay ahead of the season.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <p><a href="products.html">Products</a></p>
          <p><a href="schemes.html">Government schemes</a></p>
          <p><a href="crop-tips.html">Crop tips</a></p>
        </div>
        <div>
          <h4>Support</h4>
          <p><a href="contact.html">Contact center</a></p>
          <p><a href="weather.html">Weather updates</a></p>
          <p><a href="admin-login.html">Admin login</a></p>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>&copy; ${new Date().getFullYear()} Krishi Seva Kendra. Built for the local farming community.</span>
        <span>Minor project demo</span>
      </div>
    </footer>`;
}

function initLayout(activePage) {
  renderNavbar(activePage);
  renderFooter();
}
