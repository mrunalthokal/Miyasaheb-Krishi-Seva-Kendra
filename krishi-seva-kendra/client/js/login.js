initLayout('');

if (Auth.isLoggedIn('Farmer')) window.location.href = 'dashboard.html';

function setAlert(message, type) {
  const el = document.getElementById('form-alert');
  el.innerHTML = message ? `<div class="alert alert-${type}">${escapeHtml(message)}</div>` : '';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setAlert('', '');

  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value;

  if (!mobile || !password) {
    setAlert('Enter your mobile number and password.', 'error');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Logging in…';

  try {
    const data = await api.post('/auth/login', { mobile, password }, { auth: false });
    Auth.saveSession(data.token, data.user);
    showToast('Logged in successfully.');
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    window.location.href = redirect || 'dashboard.html';
  } catch (err) {
    setAlert(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Log in';
  }
});
