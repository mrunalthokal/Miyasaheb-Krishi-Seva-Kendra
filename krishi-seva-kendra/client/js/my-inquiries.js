Auth.requireRole('Farmer', 'login.html');
initLayout('');

const STATUS_BADGE = {
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Fulfilled: 'badge-fulfilled',
  Rejected: 'badge-rejected',
};

let allInquiries = [];

function render(filterStatus) {
  const tbody = document.getElementById('inquiries-body');
  const list = filterStatus ? allInquiries.filter((i) => i.status === filterStatus) : allInquiries;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No requests found. <a href="products.html">Browse products</a>.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (i) => `
    <tr>
      <td>${escapeHtml(i.productId ? i.productId.name : 'Product removed')}</td>
      <td>${i.quantity}</td>
      <td class="text-muted">${escapeHtml(i.remarks) || '—'}</td>
      <td><span class="badge ${STATUS_BADGE[i.status]}">${i.status}</span></td>
      <td>${formatDate(i.createdAt)}</td>
    </tr>`
    )
    .join('');
}

async function loadInquiries() {
  try {
    allInquiries = await api.get('/inquiries/me');
    render('');
  } catch (err) {
    showToast(err.message, true);
  }
}

document.getElementById('status-filter').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('#status-filter .chip').forEach((c) => c.classList.remove('active'));
  btn.classList.add('active');
  render(btn.dataset.status);
});

loadInquiries();
