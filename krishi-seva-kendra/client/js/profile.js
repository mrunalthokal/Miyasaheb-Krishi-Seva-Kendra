Auth.requireRole('Farmer', 'login.html');
initLayout('');

function setAlert(message, type) {
  const el = document.getElementById('form-alert');
  el.innerHTML = message ? `<div class="alert alert-${type}">${escapeHtml(message)}</div>` : '';
}

async function loadProfile() {
  try {
    const user = await api.get('/users/me');
    document.getElementById('name').value = user.name || '';
    document.getElementById('mobile').value = user.mobile || '';
    document.getElementById('village').value = user.village || '';
    document.getElementById('landSize').value = user.landSize ?? '';
    document.getElementById('address').value = user.address || '';
  } catch (err) {
    setAlert(err.message, 'error');
  }
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setAlert('', '');

  const name = document.getElementById('name').value.trim();
  if (!name) {
    setAlert('Name cannot be empty.', 'error');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    const landSize = document.getElementById('landSize').value;
    const data = await api.put('/users/me', {
      name,
      village: document.getElementById('village').value.trim(),
      landSize: landSize ? Number(landSize) : null,
      address: document.getElementById('address').value.trim(),
    });
    const currentUser = Auth.getUser();
    currentUser.name = data.user.name;
    localStorage.setItem('ksk_user', JSON.stringify(currentUser));
    showToast('Profile updated.');
  } catch (err) {
    setAlert(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save changes';
  }
});

loadProfile();
