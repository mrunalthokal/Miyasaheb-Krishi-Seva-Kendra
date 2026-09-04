adminRequireAuth();
renderAdminShell('content');

let allSchemes = [];
let allTips = [];
let allQueries = [];
let activeTab = 'schemes';

function renderContent() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <h2 class="mt-0">Schemes & tips</h2>
    <p style="margin-bottom:1.2rem;">Manage the government schemes and crop tips shown to farmers, and view contact messages.</p>
    <div class="chip-row" id="tab-row" style="margin-bottom:1.4rem;">
      <button class="chip active" data-tab="schemes">Schemes</button>
      <button class="chip" data-tab="tips">Crop tips</button>
      <button class="chip" data-tab="queries">Contact messages</button>
    </div>
    <div id="tab-body"></div>`;

  document.getElementById('tab-row').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#tab-row .chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    renderTab();
  });
}

function renderTab() {
  const body = document.getElementById('tab-body');
  if (activeTab === 'schemes') {
    body.innerHTML = `
      <div class="flex-between" style="margin-bottom:1rem;">
        <span class="text-muted">${allSchemes.length} scheme(s)</span>
        <button class="btn btn-primary btn-sm" id="add-scheme-btn">Add scheme</button>
      </div>
      <div id="scheme-list"></div>`;
    document.getElementById('add-scheme-btn').addEventListener('click', () => openSchemeModal());
    renderSchemeList();
  } else if (activeTab === 'tips') {
    body.innerHTML = `
      <div class="flex-between" style="margin-bottom:1rem;">
        <span class="text-muted">${allTips.length} tip(s)</span>
        <button class="btn btn-primary btn-sm" id="add-tip-btn">Add crop tip</button>
      </div>
      <div id="tip-list"></div>`;
    document.getElementById('add-tip-btn').addEventListener('click', () => openTipModal());
    renderTipList();
  } else {
    body.innerHTML = `<div id="query-list"></div>`;
    renderQueryList();
  }
}

function renderSchemeList() {
  const list = document.getElementById('scheme-list');
  if (allSchemes.length === 0) {
    list.innerHTML = `<p class="text-muted">No schemes added yet.</p>`;
    return;
  }
  list.innerHTML = allSchemes
    .map(
      (s) => `
    <div class="card-flat" style="margin-bottom:10px;">
      <div class="flex-between">
        <h3 style="margin:0;">${escapeHtml(s.title)}</h3>
        <div class="flex-gap">
          <button class="btn btn-outline btn-sm" data-edit-scheme="${s._id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete-scheme="${s._id}">Delete</button>
        </div>
      </div>
      <p class="text-muted" style="margin-top:6px; margin-bottom:0;">${escapeHtml(s.description)}</p>
    </div>`
    )
    .join('');

  list.querySelectorAll('[data-edit-scheme]').forEach((btn) =>
    btn.addEventListener('click', () => openSchemeModal(allSchemes.find((s) => s._id === btn.dataset.editScheme)))
  );
  list.querySelectorAll('[data-delete-scheme]').forEach((btn) =>
    btn.addEventListener('click', () => deleteScheme(btn.dataset.deleteScheme))
  );
}

function renderTipList() {
  const list = document.getElementById('tip-list');
  if (allTips.length === 0) {
    list.innerHTML = `<p class="text-muted">No crop tips added yet.</p>`;
    return;
  }
  list.innerHTML = allTips
    .map(
      (t) => `
    <div class="card-flat" style="margin-bottom:10px;">
      <div class="flex-between">
        <div>
          <span class="product-cat">${escapeHtml(t.season)}</span>
          <h3 style="margin:2px 0 0;">${escapeHtml(t.cropName)}</h3>
        </div>
        <div class="flex-gap">
          <button class="btn btn-outline btn-sm" data-edit-tip="${t._id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete-tip="${t._id}">Delete</button>
        </div>
      </div>
      <p class="text-muted" style="margin-top:6px; margin-bottom:0;">${escapeHtml(t.tipContent)}</p>
    </div>`
    )
    .join('');

  list.querySelectorAll('[data-edit-tip]').forEach((btn) =>
    btn.addEventListener('click', () => openTipModal(allTips.find((t) => t._id === btn.dataset.editTip)))
  );
  list.querySelectorAll('[data-delete-tip]').forEach((btn) =>
    btn.addEventListener('click', () => deleteTip(btn.dataset.deleteTip))
  );
}

function renderQueryList() {
  const list = document.getElementById('query-list');
  if (allQueries.length === 0) {
    list.innerHTML = `<p class="text-muted">No contact messages yet.</p>`;
    return;
  }
  list.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Mobile</th><th>Message</th><th>Received</th></tr></thead>
        <tbody>
          ${allQueries
            .map(
              (q) => `
            <tr>
              <td>${escapeHtml(q.name)}</td>
              <td>${escapeHtml(q.mobile)}</td>
              <td style="max-width:320px;">${escapeHtml(q.message)}</td>
              <td>${formatDate(q.createdAt)}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`;
}

// --- Scheme modal ---
function openSchemeModal(scheme) {
  document.getElementById('scheme-modal-alert').innerHTML = '';
  document.getElementById('scheme-modal-title').textContent = scheme ? 'Edit scheme' : 'Add scheme';
  document.getElementById('s-id').value = scheme ? scheme._id : '';
  document.getElementById('s-title').value = scheme ? scheme.title : '';
  document.getElementById('s-description').value = scheme ? scheme.description : '';
  document.getElementById('s-eligibility').value = scheme ? scheme.eligibility : '';
  document.getElementById('s-benefits').value = scheme ? scheme.benefits : '';
  document.getElementById('scheme-modal').classList.add('open');
}

document.getElementById('scheme-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById('scheme-modal-alert');
  alertEl.innerHTML = '';
  const id = document.getElementById('s-id').value;
  const payload = {
    title: document.getElementById('s-title').value.trim(),
    description: document.getElementById('s-description').value.trim(),
    eligibility: document.getElementById('s-eligibility').value.trim(),
    benefits: document.getElementById('s-benefits').value.trim(),
  };
  if (!payload.title || !payload.description) {
    alertEl.innerHTML = `<div class="alert alert-error">Title and description are required.</div>`;
    return;
  }
  try {
    if (id) await api.put(`/schemes/${id}`, payload);
    else await api.post('/schemes', payload);
    showToast('Scheme saved.');
    document.getElementById('scheme-modal').classList.remove('open');
    await loadSchemes();
    renderTab();
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
});

async function deleteScheme(id) {
  if (!confirm('Delete this scheme?')) return;
  try {
    await api.del(`/schemes/${id}`);
    showToast('Scheme deleted.');
    await loadSchemes();
    renderTab();
  } catch (err) {
    showToast(err.message, true);
  }
}

// --- Tip modal ---
function openTipModal(tip) {
  document.getElementById('tip-modal-alert').innerHTML = '';
  document.getElementById('tip-modal-title').textContent = tip ? 'Edit crop tip' : 'Add crop tip';
  document.getElementById('t-id').value = tip ? tip._id : '';
  document.getElementById('t-crop').value = tip ? tip.cropName : '';
  document.getElementById('t-season').value = tip ? tip.season : 'Kharif';
  document.getElementById('t-content').value = tip ? tip.tipContent : '';
  document.getElementById('tip-modal').classList.add('open');
}

document.getElementById('tip-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById('tip-modal-alert');
  alertEl.innerHTML = '';
  const id = document.getElementById('t-id').value;
  const payload = {
    cropName: document.getElementById('t-crop').value.trim(),
    season: document.getElementById('t-season').value,
    tipContent: document.getElementById('t-content').value.trim(),
  };
  if (!payload.cropName || !payload.tipContent) {
    alertEl.innerHTML = `<div class="alert alert-error">Crop name and tip content are required.</div>`;
    return;
  }
  try {
    if (id) await api.put(`/croptips/${id}`, payload);
    else await api.post('/croptips', payload);
    showToast('Crop tip saved.');
    document.getElementById('tip-modal').classList.remove('open');
    await loadTips();
    renderTab();
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
});

async function deleteTip(id) {
  if (!confirm('Delete this crop tip?')) return;
  try {
    await api.del(`/croptips/${id}`);
    showToast('Crop tip deleted.');
    await loadTips();
    renderTab();
  } catch (err) {
    showToast(err.message, true);
  }
}

document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', () => document.getElementById(btn.dataset.close).classList.remove('open'));
});
document.querySelectorAll('.modal-backdrop').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
});

async function loadSchemes() {
  allSchemes = await api.get('/schemes', { auth: false });
}
async function loadTips() {
  allTips = await api.get('/croptips', { auth: false });
}
async function loadQueries() {
  allQueries = await api.get('/contact');
}

async function loadAll() {
  try {
    await Promise.all([loadSchemes(), loadTips(), loadQueries()]);
    renderTab();
  } catch (err) {
    showToast(err.message, true);
  }
}

renderContent();
loadAll();
