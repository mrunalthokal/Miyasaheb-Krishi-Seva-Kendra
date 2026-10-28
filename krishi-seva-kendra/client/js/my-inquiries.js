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
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center">No requests from the last 7 days. <a href="products.html">Browse products</a>.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (i) => {
        const isCod = i.paymentMethod === 'cod';
        const isCompleteCod = isCod && i.status === 'Fulfilled';
        const statusLabel = isCompleteCod ? 'Complete' : i.status;
        const paymentLabel = isCod
          ? 'Cash on Delivery'
          : `Online${i.paymentStatus === 'pending' ? '<br><span class="badge badge-pending">Payment pending</span>' : '<br><span class="badge badge-fulfilled">Paid</span>'}`;
        return `
    <tr>
      <td>${escapeHtml(i.productId ? i.productId.name : 'Product removed')}</td>
      <td>${i.quantity}</td>
      <td>${paymentLabel}</td>
      <td class="text-muted">${escapeHtml(i.remarks) || '—'}</td>
      <td><span class="badge ${STATUS_BADGE[i.status]}">${statusLabel}</span></td>
      <td>${formatDate(i.createdAt)}</td>
    </tr>`
      }
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
