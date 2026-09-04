initLayout('products');

const CATEGORY_ICONS = {
  'Seeds': '<path d="M12 3C7 6 5 10 5 14a7 7 0 0014 0c0-4-2-8-7-11Z" stroke="currentColor" stroke-width="1.6"/>',
  'Fertilizers': '<path d="M6 21V9l6-5 6 5v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 21v-6h4v6" stroke="currentColor" stroke-width="1.6"/>',
  'Pesticides': '<path d="M4 12h9M13 12l4-4M13 12l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="19" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/>',
  'Tools & Equipment': '<path d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const section = document.getElementById('product-section');

async function loadProduct() {
  if (!productId) {
    section.innerHTML = `<p class="text-muted">No product selected.</p>`;
    return;
  }
  try {
    const p = await api.get(`/products/${productId}`, { auth: false });
    const catName = p.categoryId && p.categoryId.name ? p.categoryId.name : '';
    const badgeClass = p.stockStatus === 'Available' ? 'badge-available' : 'badge-outofstock';
    const loggedIn = Auth.isLoggedIn('Farmer');

    section.innerHTML = `
      <div class="card product-detail-grid">
        <div class="product-thumb" style="height:260px; border-radius:14px;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">${CATEGORY_ICONS[catName] || CATEGORY_ICONS['Seeds']}</svg>
        </div>
        <div>
          <span class="product-cat">${escapeHtml(catName)}</span>
          <h2 style="margin-top:4px;">${escapeHtml(p.name)}</h2>
          <span class="badge ${badgeClass}" style="margin-bottom:1rem; display:inline-block;">${p.stockStatus}</span>
          <p>${escapeHtml(p.description || 'No description provided.')}</p>
          <div class="product-price" style="font-size:1.4rem; margin-bottom:1.4rem;">${formatCurrency(p.price)} <span style="font-size:0.9rem;">/ ${escapeHtml(p.unit)}</span></div>

          <div id="inquiry-area"></div>
        </div>
      </div>
    `;

    const inquiryArea = document.getElementById('inquiry-area');
    if (p.stockStatus !== 'Available') {
      inquiryArea.innerHTML = `<div class="alert alert-error">This product is currently out of stock. Please check back later.</div>`;
      return;
    }
    if (!loggedIn) {
      inquiryArea.innerHTML = `
        <div class="alert" style="background: var(--leaf-050); color: var(--leaf-900); border:1px solid var(--line);">
          <a href="login.html">Log in</a> or <a href="register.html">register</a> to request this product.
        </div>`;
      return;
    }

    inquiryArea.innerHTML = `
      <div class="card-flat" style="background: var(--leaf-050);">
        <h3 style="margin-bottom:0.8rem;">Request this product</h3>
        <div id="inquiry-alert"></div>
        <form id="inquiry-form">
          <div class="form-row">
            <div class="field">
              <label for="quantity">Quantity (${escapeHtml(p.unit)})</label>
              <input type="number" id="quantity" min="1" value="1" required />
            </div>
          </div>
          <div class="field">
            <label for="remarks">Remarks (optional)</label>
            <textarea id="remarks" rows="2" placeholder="Any delivery preference or note for the center"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" id="inquiry-submit">Submit request</button>
        </form>
      </div>`;

    document.getElementById('inquiry-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('inquiry-alert');
      alertEl.innerHTML = '';
      const quantity = Number(document.getElementById('quantity').value);
      if (!quantity || quantity < 1) {
        alertEl.innerHTML = `<div class="alert alert-error">Enter a valid quantity.</div>`;
        return;
      }
      const btn = document.getElementById('inquiry-submit');
      btn.disabled = true;
      btn.textContent = 'Submitting…';
      try {
        await api.post('/inquiries', {
          productId: p._id,
          quantity,
          remarks: document.getElementById('remarks').value.trim(),
        });
        showToast('Request submitted. Track it in My requests.');
        window.location.href = 'my-inquiries.html';
      } catch (err) {
        alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
        btn.disabled = false;
        btn.textContent = 'Submit request';
      }
    });
  } catch (err) {
    section.innerHTML = `<p class="text-muted">${escapeHtml(err.message)}</p>`;
  }
}

loadProduct();
