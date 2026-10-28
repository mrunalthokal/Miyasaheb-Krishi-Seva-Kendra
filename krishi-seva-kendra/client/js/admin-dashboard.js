adminRequireAuth();
renderAdminShell('dashboard');

async function loadOverview() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <h2 class="mt-0">Overview</h2>
    <p style="margin-bottom:1.8rem;">A snapshot of activity across the center.</p>
    <div class="grid-4" id="summary-cards">
      <div class="stat-card skeleton" style="height:80px;"></div>
      <div class="stat-card skeleton" style="height:80px;"></div>
      <div class="stat-card skeleton" style="height:80px;"></div>
      <div class="stat-card skeleton" style="height:80px;"></div>
    </div>
    <div class="section-head" style="margin-top:2.4rem;">
      <h3 class="mb-0">Latest requests (last 7 days)</h3>
      <a href="admin-inquiries.html" class="btn btn-outline btn-sm">Manage requests</a>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Farmer</th><th>Product</th><th>Qty</th><th>Status</th><th>Date</th></tr></thead>
        <tbody id="latest-inquiries"><tr><td colspan="5" class="text-muted text-center">Loading…</td></tr></tbody>
      </table>
    </div>`;

  try {
    const [summary, inquiries] = await Promise.all([
      api.get('/admin/summary'),
      api.get('/admin/latest-inquiries'),
    ]);
    document.getElementById('summary-cards').innerHTML = `
      <div class="stat-card"><b>${summary.totalFarmers}</b><span>Registered farmers</span></div>
      <div class="stat-card"><b>${summary.totalProducts}</b><span>Products listed</span></div>
      <div class="stat-card"><b>${summary.pendingInquiries}</b><span>Pending requests</span></div>
      <div class="stat-card"><b>${summary.totalQueries}</b><span>Contact messages</span></div>`;

    const STATUS_BADGE = { Pending: 'badge-pending', Approved: 'badge-approved', Fulfilled: 'badge-fulfilled', Rejected: 'badge-rejected' };
    const tbody = document.getElementById('latest-inquiries');
    if (inquiries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No requests from the last 7 days.</td></tr>`;
    } else {
      tbody.innerHTML = inquiries
        .map(
          (i) => {
            const isCompleteCod = i.paymentMethod === 'cod' && i.status === 'Fulfilled';
            const statusLabel = isCompleteCod ? 'Complete' : i.status;
            return `
        <tr>
          <td>${escapeHtml(i.userId ? i.userId.name : 'Unknown')}</td>
          <td>${escapeHtml(i.productId ? i.productId.name : 'Removed')}</td>
          <td>${i.quantity}</td>
          <td><span class="badge ${STATUS_BADGE[i.status]}">${statusLabel}</span></td>
          <td>${formatDate(i.createdAt)}</td>
        </tr>`
          }
        )
        .join('');
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

loadOverview();
