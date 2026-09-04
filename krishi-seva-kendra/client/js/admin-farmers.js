adminRequireAuth();
renderAdminShell('farmers');

let allFarmers = [];

function renderContent() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <h2 class="mt-0">Farmers</h2>
    <p style="margin-bottom:1.4rem;">All registered farmer accounts. Deactivate an account to block login.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Name</th><th>Mobile</th><th>Village</th><th>Joined</th><th>Status</th><th></th></tr></thead>
        <tbody id="farmer-rows"><tr><td colspan="6" class="text-muted text-center">Loading…</td></tr></tbody>
      </table>
    </div>`;
}

function renderRows() {
  const tbody = document.getElementById('farmer-rows');
  if (allFarmers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center">No farmers registered yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = allFarmers
    .map(
      (f) => `
    <tr>
      <td>${escapeHtml(f.name)}</td>
      <td>${escapeHtml(f.mobile)}</td>
      <td class="text-muted">${escapeHtml(f.village) || '—'}</td>
      <td>${formatDate(f.createdAt)}</td>
      <td><span class="badge ${f.status === 'Active' ? 'badge-active' : 'badge-deactivated'}">${f.status}</span></td>
      <td>
        ${
          f.status === 'Active'
            ? `<button class="btn btn-danger btn-sm" data-id="${f._id}" data-action="Deactivated">Deactivate</button>`
            : `<button class="btn btn-outline btn-sm" data-id="${f._id}" data-action="Active">Reactivate</button>`
        }
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-action]').forEach((btn) =>
    btn.addEventListener('click', () => toggleStatus(btn.dataset.id, btn.dataset.action))
  );
}

async function toggleStatus(id, status) {
  if (status === 'Deactivated' && !confirm('Deactivate this farmer account? They will not be able to log in.')) return;
  try {
    await api.put(`/farmers/${id}/status`, { status });
    showToast(`Farmer account ${status.toLowerCase()}.`);
    const idx = allFarmers.findIndex((f) => f._id === id);
    if (idx > -1) allFarmers[idx].status = status;
    renderRows();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function loadFarmers() {
  try {
    allFarmers = await api.get('/farmers');
    renderRows();
  } catch (err) {
    showToast(err.message, true);
  }
}

renderContent();
loadFarmers();
