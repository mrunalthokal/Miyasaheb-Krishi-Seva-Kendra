initLayout('contact');

function setAlert(message, type) {
  const el = document.getElementById('form-alert');
  el.innerHTML = message ? `<div class="alert alert-${type}">${escapeHtml(message)}</div>` : '';
}

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setAlert('', '');

  const name = document.getElementById('name').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !mobile || !message) {
    setAlert('Please fill in all fields.', 'error');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    await api.post('/contact', { name, mobile, message }, { auth: false });
    setAlert('Your message has been sent. The center will get back to you soon.', 'success');
    document.getElementById('contact-form').reset();
  } catch (err) {
    setAlert(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message';
  }
});
