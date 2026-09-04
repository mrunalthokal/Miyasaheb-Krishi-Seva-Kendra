adminRequireAuth();
renderAdminShell('products');

let allCategories = [];
let allProducts = [];

function renderContent() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="section-head">
      <div>
        <h2 class="mt-0">Products</h2>
        <p class="mb-0">Add, edit or remove items in the catalog.</p>
      </div>
      <button class="btn btn-primary" id="add-product-btn">Add product</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody id="product-rows"><tr><td colspan="5" class="text-muted text-center">Loading…</td></tr></tbody>
      </table>
    </div>`;
  document.getElementById('add-product-btn').addEventListener('click', () => openModal());
}

function renderRows() {
  const tbody = document.getElementById('product-rows');
  if (allProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No products yet. Add your first one.</td></tr>`;
    return;
  }
  const badgeClass = (s) => (s === 'Available' ? 'badge-available' : 'badge-outofstock');
  tbody.innerHTML = allProducts
    .map(
      (p) => `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td class="text-muted">${escapeHtml(p.categoryId ? p.categoryId.name : '')}</td>
      <td>${formatCurrency(p.price)} <span class="text-muted">/ ${escapeHtml(p.unit)}</span></td>
      <td><span class="badge ${badgeClass(p.stockStatus)}">${p.stockStatus}</span></td>
      <td class="flex-gap">
        <button class="btn btn-outline btn-sm" data-edit="${p._id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-delete="${p._id}">Delete</button>
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-edit]').forEach((btn) =>
    btn.addEventListener('click', () => openModal(allProducts.find((p) => p._id === btn.dataset.edit)))
  );
  tbody.querySelectorAll('[data-delete]').forEach((btn) =>
    btn.addEventListener('click', () => deleteProduct(btn.dataset.delete))
  );
}

async function loadAll() {
  try {
    [allCategories, allProducts] = await Promise.all([api.get('/categories', { auth: false }), api.get('/products', { auth: false })]);
    const select = document.getElementById('p-category');
    select.innerHTML = allCategories.map((c) => `<option value="${c._id}">${escapeHtml(c.name)}</option>`).join('');
    renderRows();
  } catch (err) {
    showToast(err.message, true);
  }
}

function openModal(product) {
  document.getElementById('modal-alert').innerHTML = '';
  document.getElementById('modal-title').textContent = product ? 'Edit product' : 'Add product';
  document.getElementById('product-id').value = product ? product._id : '';
  document.getElementById('p-name').value = product ? product.name : '';
  document.getElementById('p-category').value = product ? product.categoryId._id || product.categoryId : allCategories[0]?._id || '';
  document.getElementById('p-stock').value = product ? product.stockStatus : 'Available';
  document.getElementById('p-price').value = product ? product.price : '';
  document.getElementById('p-unit').value = product ? product.unit : '';
  document.getElementById('p-description').value = product ? product.description : '';
  document.getElementById('product-modal').classList.add('open');
}
function closeModal() {
  document.getElementById('product-modal').classList.remove('open');
}
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('product-modal').addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') closeModal();
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById('modal-alert');
  alertEl.innerHTML = '';

  const id = document.getElementById('product-id').value;
  const payload = {
    name: document.getElementById('p-name').value.trim(),
    categoryId: document.getElementById('p-category').value,
    stockStatus: document.getElementById('p-stock').value,
    price: Number(document.getElementById('p-price').value),
    unit: document.getElementById('p-unit').value.trim(),
    description: document.getElementById('p-description').value.trim(),
  };

  if (!payload.name || !payload.categoryId || !payload.unit || payload.price < 0) {
    alertEl.innerHTML = `<div class="alert alert-error">Fill in all required fields correctly.</div>`;
    return;
  }

  const btn = document.getElementById('modal-submit');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    if (id) {
      await api.put(`/products/${id}`, payload);
      showToast('Product updated.');
    } else {
      await api.post('/products', payload);
      showToast('Product added.');
    }
    closeModal();
    await loadAll();
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save product';
  }
});

async function deleteProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  try {
    await api.del(`/products/${id}`);
    showToast('Product deleted.');
    await loadAll();
  } catch (err) {
    showToast(err.message, true);
  }
}

renderContent();
loadAll();
