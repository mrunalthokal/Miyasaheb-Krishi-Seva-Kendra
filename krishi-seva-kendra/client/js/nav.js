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
    { href: 'feedback.html', label: 'Feedback', key: 'feedback' },
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
  renderChatbot();
}

function renderChatbot() {
  const widget = document.createElement('div');
  widget.innerHTML = `
    <!-- Chatbot Toggle Button -->
    <button id="chat-toggle" style="position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#2e7d32;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="13" rx="3" stroke="#fff" stroke-width="1.6"/>
        <circle cx="9" cy="13" r="1.5" fill="#fff"/>
        <circle cx="15" cy="13" r="1.5" fill="#fff"/>
        <path d="M9 17h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M12 7V4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="12" cy="3" r="1" fill="#fff"/>
        <path d="M3 13H1M23 13h-2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Chatbot Window -->
    <div id="chat-window" style="display:none;position:fixed;bottom:90px;right:24px;width:340px;max-height:480px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:9999;flex-direction:column;overflow:hidden;">
      <div style="background:#2e7d32;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="13" rx="3" stroke="#fff" stroke-width="1.6"/>
            <circle cx="9" cy="13" r="1.5" fill="#fff"/>
            <circle cx="15" cy="13" r="1.5" fill="#fff"/>
            <path d="M9 17h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M12 7V4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="12" cy="3" r="1" fill="#fff"/>
            <path d="M3 13H1M23 13h-2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <div>
            <div style="color:#fff;font-weight:600;font-size:0.95rem;">Agro Assistant</div>
            <div style="color:#a5d6a7;font-size:0.75rem;">Ask me anything about farming</div>
          </div>
        </div>
        <button id="chat-close" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">✕</button>
      </div>
      <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;max-height:320px;">
        <div style="background:#f1f8e9;padding:10px 14px;border-radius:12px;border-bottom-left-radius:4px;font-size:0.88rem;max-width:85%;">
          🤖 Hello! I am your Agro Assistant. Ask me about crops, fertilizers, pests, irrigation, schemes or weather!
        </div>
      </div>
      <div style="padding:12px;border-top:1px solid #eee;display:flex;gap:8px;">
        <input id="chat-input" type="text" placeholder="Ask about farming..." style="flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:0.88rem;outline:none;" />
        <button id="chat-send" style="background:#2e7d32;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:0.88rem;font-weight:600;">Send</button>
      </div>
    </div>`;
  document.body.appendChild(widget);

  const toggle = document.getElementById('chat-toggle');
  const window_ = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');

  toggle.addEventListener('click', () => {
    window_.style.display = window_.style.display === 'none' ? 'flex' : 'none';
    window_.style.flexDirection = 'column';
    if (window_.style.display === 'flex') input.focus();
  });

  closeBtn.addEventListener('click', () => window_.style.display = 'none');

  async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    // User message
    messages.innerHTML += `<div style="background:#2e7d32;color:#fff;padding:10px 14px;border-radius:12px;border-bottom-right-radius:4px;font-size:0.88rem;max-width:85%;align-self:flex-end;">${escapeHtml(msg)}</div>`;
    messages.scrollTop = messages.scrollHeight;

    // Typing indicator
    messages.innerHTML += `<div id="typing" style="background:#f1f8e9;padding:10px 14px;border-radius:12px;border-bottom-left-radius:4px;font-size:0.88rem;max-width:85%;color:#888;">Typing...</div>`;
    messages.scrollTop = messages.scrollHeight;

    try {
      const data = await api.post('/chatbot/message', { message: msg }, { auth: false });
      document.getElementById('typing')?.remove();
      const replyHtml = escapeHtml(data.reply).replace(/\n/g, '<br>');
      messages.innerHTML += `<div style="background:#f1f8e9;padding:10px 14px;border-radius:12px;border-bottom-left-radius:4px;font-size:0.88rem;max-width:85%;">${replyHtml}</div>`;
    } catch (err) {
      document.getElementById('typing')?.remove();
      messages.innerHTML += `<div style="background:#ffebee;padding:10px 14px;border-radius:12px;font-size:0.88rem;max-width:85%;">Sorry, I could not respond. Please try again.</div>`;
    }
    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}
