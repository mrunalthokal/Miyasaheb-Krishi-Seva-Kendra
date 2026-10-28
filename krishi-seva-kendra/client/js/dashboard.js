Auth.requireRole('Farmer', 'login.html');
initLayout('');

const STATUS_BADGE = {
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Fulfilled: 'badge-fulfilled',
  Rejected: 'badge-rejected',
};

async function loadDashboard() {
  const user = Auth.getUser();
  document.getElementById('welcome-heading').textContent = `Welcome back, ${user.name.split(' ')[0]}`;

  try {
    const inquiries = await api.get('/inquiries/me');
    const pending = inquiries.filter((i) => i.status === 'Pending').length;
    const fulfilled = inquiries.filter((i) => i.status === 'Fulfilled').length;

    document.getElementById('stat-total').textContent = inquiries.length;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-fulfilled').textContent = fulfilled;

    const tbody = document.getElementById('recent-inquiries');
    if (inquiries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-muted text-center">No requests yet. <a href="products.html">Browse products</a> to get started.</td></tr>`;
      return;
    }
    tbody.innerHTML = inquiries
      .slice(0, 5)
      .map(
        (i) => {
          const isCompleteCod = i.paymentMethod === 'cod' && i.status === 'Fulfilled';
          const statusLabel = isCompleteCod ? 'Complete' : i.status;
          return `
      <tr>
        <td>${escapeHtml(i.productId ? i.productId.name : 'Product removed')}</td>
        <td>${i.quantity}</td>
        <td><span class="badge ${STATUS_BADGE[i.status]}">${statusLabel}</span></td>
        <td>${formatDate(i.createdAt)}</td>
      </tr>`
        }
      )
      .join('');
  } catch (err) {
    showToast(err.message, true);
  }
}

loadDashboard();
