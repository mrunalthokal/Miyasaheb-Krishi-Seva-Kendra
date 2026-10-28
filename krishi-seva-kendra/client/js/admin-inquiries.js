adminRequireAuth();
renderAdminShell('inquiries');

const STATUS_BADGE = { Pending: 'badge-pending', Approved: 'badge-approved', Fulfilled: 'badge-fulfilled', Rejected: 'badge-rejected' };
let allInquiries = [];

function renderContent() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <h2 class="mt-0">Requests</h2>
    <p style="margin-bottom:1.2rem;">Review farmer requests and update their status.</p>
    <div class="chip-row" id="status-filter" style="margin-bottom:1.4rem;">
      <button class="chip active" data-status="">All</button>
      <button class="chip" data-status="Pending">Pending</button>
      <button class="chip" data-status="Approved">Approved</button>
      <button class="chip" data-status="Fulfilled">Fulfilled</button>
      <button class="chip" data-status="Rejected">Rejected</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Farmer</th><th>Product</th><th>Qty</th><th>Total</th><th>Payment</th><th>Remarks</th><th>Status</th><th>Update</th></tr></thead>
        <tbody id="inquiry-rows"><tr><td colspan="8" class="text-muted text-center">Loading…</td></tr></tbody>
      </table>
    </div>`;

  document.getElementById('status-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#status-filter .chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    renderRows(btn.dataset.status);
  });
}

function renderRows(filterStatus) {
  const tbody = document.getElementById('inquiry-rows');
  const list = filterStatus ? allInquiries.filter((i) => i.status === filterStatus) : allInquiries;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-muted text-center">No requests found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (i) => {
        const isCod = i.paymentMethod === 'cod';
        const isCompleteCod = isCod && i.status === 'Fulfilled';
        const paymentDetails = isCod
          ? `Cash on Delivery${i.paymentStatus !== 'paid' ? `<br><button type="button" class="btn btn-outline btn-sm cash-received" data-id="${i._id}" style="margin-top:0.35rem;">Cash received & complete</button>` : ''}`
          : `Online<br><span class="badge ${i.paymentStatus === 'paid' ? 'badge-fulfilled' : 'badge-pending'}">${i.paymentStatus === 'paid' ? 'Paid' : 'Payment pending'}</span>`;
        return `
    <tr>
      <td>${escapeHtml(i.userId ? i.userId.name : 'Unknown')}<br><span class="text-muted" style="font-size:0.78rem;">${escapeHtml(i.userId ? i.userId.mobile : '')}</span></td>
      <td>${escapeHtml(i.productId ? i.productId.name : 'Removed')}</td>
      <td>${i.quantity}</td>
      <td>${formatCurrency(i.total)}</td>
      <td>${paymentDetails}</td>
      <td class="text-muted" style="max-width:160px;">${escapeHtml(i.remarks) || '—'}</td>
      <td><span class="badge ${STATUS_BADGE[i.status]}">${isCompleteCod ? 'Complete' : i.status}</span></td>
      <td>
        <select data-id="${i._id}" class="status-select" style="padding:8px 10px; border:1.5px solid var(--line-strong); border-radius:6px;">
          <option value="Pending" ${i.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Approved" ${i.status === 'Approved' ? 'selected' : ''}>Approved</option>
          <option value="Fulfilled" ${i.status === 'Fulfilled' ? 'selected' : ''}>${isCompleteCod ? 'Complete' : 'Fulfilled'}</option>
          <option value="Rejected" ${i.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
    </tr>`
      }
    )
    .join('');

  tbody.querySelectorAll('.status-select').forEach((sel) => {
    sel.addEventListener('change', () => updateStatus(sel.dataset.id, sel.value));
  });
  tbody.querySelectorAll('.cash-received').forEach((btn) => {
    btn.addEventListener('click', () => recordCashReceived(btn.dataset.id));
  });
}

async function updateStatus(id, status) {
  try {
    await api.put(`/inquiries/${id}`, { status });
    showToast('Request status updated.');
    const idx = allInquiries.findIndex((i) => i._id === id);
    if (idx > -1) allInquiries[idx].status = status;
    renderRows(document.querySelector('#status-filter .chip.active')?.dataset.status || '');
  } catch (err) {
    showToast(err.message, true);
  }
}

async function recordCashReceived(id) {
  try {
    const result = await api.put(`/inquiries/${id}`, {
      paymentStatus: 'paid',
      status: 'Fulfilled',
    });
    const idx = allInquiries.findIndex((i) => i._id === id);
    if (idx > -1) allInquiries[idx] = result.inquiry;
    showToast('Cash payment recorded and request completed.');
    renderRows(document.querySelector('#status-filter .chip.active')?.dataset.status || '');
  } catch (err) {
    showToast(err.message, true);
  }
}

async function loadInquiries() {
  try {
    allInquiries = await api.get('/inquiries');
    renderRows('');
  } catch (err) {
    showToast(err.message, true);
  }
}

renderContent();
loadInquiries();
