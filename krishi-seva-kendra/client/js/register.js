initLayout('');

if (Auth.isLoggedIn('Farmer')) window.location.href = 'dashboard.html';

function setAlert(message, type) {
  const el = document.getElementById('form-alert');
  el.innerHTML = message ? `<div class="alert alert-${type}">${escapeHtml(message)}</div>` : '';
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setAlert('', '');

  const name = document.getElementById('name').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value;
  const village = document.getElementById('village').value.trim();
  const landSize = document.getElementById('landSize').value;
  const address = document.getElementById('address').value.trim();

  if (!name || !mobile || !password) {
    setAlert('Please fill in name, mobile number and password.', 'error');
    return;
  }
  if (!/^\d{10}$/.test(mobile)) {
    setAlert('Enter a valid 10-digit mobile number.', 'error');
    return;
  }
  if (password.length < 6) {
    setAlert('Password must be at least 6 characters.', 'error');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account…';

  try {
    const data = await api.post(
      '/auth/register',
      { name, mobile, password, village, address, landSize: landSize ? Number(landSize) : null },
      { auth: false }
    );
    Auth.saveSession(data.token, data.user);
    showToast('Welcome to Krishi Seva Kendra!');
    window.location.href = 'dashboard.html';
  } catch (err) {
    setAlert(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Create account';
  }
});
