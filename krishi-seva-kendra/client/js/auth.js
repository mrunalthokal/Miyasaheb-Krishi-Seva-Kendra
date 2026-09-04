const Auth = {
  saveSession(token, user) {
    localStorage.setItem('ksk_token', token);
    localStorage.setItem('ksk_user', JSON.stringify(user));
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('ksk_user'));
    } catch (e) {
      return null;
    }
  },
  getToken() {
    return localStorage.getItem('ksk_token');
  },
  isLoggedIn(role) {
    const user = this.getUser();
    if (!user || !this.getToken()) return false;
    return role ? user.role === role : true;
  },
  logout(redirectTo = 'index.html') {
    localStorage.removeItem('ksk_token');
    localStorage.removeItem('ksk_user');
    window.location.href = redirectTo;
  },
  // Redirects away if the required role isn't logged in. Call at top of protected pages.
  requireRole(role, loginPage) {
    if (!this.isLoggedIn(role)) {
      window.location.href = loginPage;
    }
  },
};

function showToast(message, isError = false) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = isError ? 'error' : '';
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
