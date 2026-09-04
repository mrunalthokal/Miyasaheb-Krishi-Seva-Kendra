initLayout('croptips');

async function loadTips(season) {
  const list = document.getElementById('tips-list');
  list.innerHTML = `<div class="card skeleton" style="height:150px;"></div><div class="card skeleton" style="height:150px;"></div>`;
  try {
    const params = season ? `?season=${encodeURIComponent(season)}` : '';
    const tips = await api.get(`/croptips${params}`, { auth: false });
    if (tips.length === 0) {
      list.innerHTML = `<p class="text-muted" style="grid-column:1/-1;">No crop tips for this season yet.</p>`;
      return;
    }
    list.innerHTML = tips
      .map(
        (t) => `
      <div class="card">
        <span class="product-cat">${escapeHtml(t.season)}</span>
        <h3 style="margin-top:4px;">${escapeHtml(t.cropName)}</h3>
        <p class="mb-0">${escapeHtml(t.tipContent)}</p>
      </div>`
      )
      .join('');
  } catch (err) {
    list.innerHTML = `<p class="text-muted">${escapeHtml(err.message)}</p>`;
  }
}

document.getElementById('season-filter').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('#season-filter .chip').forEach((c) => c.classList.remove('active'));
  btn.classList.add('active');
  loadTips(btn.dataset.season);
});

loadTips('');
