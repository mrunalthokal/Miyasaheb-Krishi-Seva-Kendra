initLayout('schemes');

async function loadSchemes() {
  const list = document.getElementById('schemes-list');
  try {
    const schemes = await api.get('/schemes', { auth: false });
    if (schemes.length === 0) {
      list.innerHTML = `<p class="text-muted" style="grid-column:1/-1;">No schemes listed yet.</p>`;
      return;
    }
    list.innerHTML = schemes
      .map(
        (s) => `
      <div class="card">
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
        ${s.eligibility ? `<p style="font-size:0.88rem;"><strong style="color:var(--soil-700); font-weight:600;">Eligibility:</strong> ${escapeHtml(s.eligibility)}</p>` : ''}
        ${s.benefits ? `<p style="font-size:0.88rem; margin-bottom:0;"><strong style="color:var(--soil-700); font-weight:600;">Benefits:</strong> ${escapeHtml(s.benefits)}</p>` : ''}
      </div>`
      )
      .join('');
  } catch (err) {
    list.innerHTML = `<p class="text-muted">${escapeHtml(err.message)}</p>`;
  }
}

loadSchemes();
