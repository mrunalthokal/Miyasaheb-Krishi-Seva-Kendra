initLayout('products');

const CATEGORY_ICONS = {
  'Seeds': '<path d="M12 3C7 6 5 10 5 14a7 7 0 0014 0c0-4-2-8-7-11Z" stroke="currentColor" stroke-width="1.6"/>',
  'Fertilizers': '<path d="M6 21V9l6-5 6 5v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 21v-6h4v6" stroke="currentColor" stroke-width="1.6"/>',
  'Pesticides': '<path d="M4 12h9M13 12l4-4M13 12l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="19" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/>',
  'Tools & Equipment': '<path d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};

let categories = [];
let debounceTimer = null;
function getProductImage(p) {
  if (p.imageUrl) return p.imageUrl;
  const name = p.name || '';
  if (name.includes('Cotton')) return 'images/cotten_hybrid.jpg';
  if (name.includes('Soybean')) return 'images/soyabean.jpg';
  if (name.includes('Wheat')) return 'images/wheat.jpg';
  if (name.includes('Onion')) return 'images/onion.jpg';
  if (name.includes('Tomato')) return 'images/tomato.jpg';
  if (name.includes('Maize')) return 'images/Maize.jpg';
  if (name.includes('DAP')) return 'images/dap.jpg';
  if (name.includes('Urea')) return 'images/urea.jpg';
  if (name.includes('Vermi')) return 'images/vermicompost.jpg';
  if (name.includes('Neem Oil')) return 'images/neem-oil.jpg';
  if (name.includes('Chlorpyrifos')) return 'images/chlorpyrifos.jpg';
  if (name.includes('Khurpi') || name.includes('Hoe') || name.includes('Sickle')) return 'images/khurpi.jpg';
  if (name.includes('Battery Sprayer') || name.includes('Soil Testing')) return 'images/battery-sprayer.jpg';
  if (name.includes('Drip') || name.includes('Wheel') || name.includes('Tarpaulin')) return 'images/drip-irrigation.jpg';
  return 'images/cotten.jpg';
}
function productCardHtml(p) {
  const catName = p.categoryId && p.categoryId.name ? p.categoryId.name : '';
  const badgeClass = p.stockStatus === 'Available' ? 'badge-available' : 'badge-outofstock';
  return `
    <a href="product-details.html?id=${p._id}" class="product-card" style="text-decoration:none; color:inherit;">
      <div class="product-thumb"><img src="${getProductImage(p)}" alt="${escapeHtml(p.name)}"></div>
      <div class="product-body">
        <span class="product-cat">${escapeHtml(catName)}</span>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <div class="product-price">${formatCurrency(p.price)} <span>/ ${escapeHtml(p.unit)}</span></div>
        <div class="product-foot">
          <span class="badge ${badgeClass}">${p.stockStatus === 'Available' ? 'Available' : 'Unavailable'}</span>
        </div>
      </div>
    </a>`;
}

async function loadCategoryChips() {
  const params = new URLSearchParams(window.location.search);
  const activeCategory = params.get('category') || '';
  const row = document.getElementById('category-chips');

  try {
    categories = await api.get('/categories', { auth: false });
    row.innerHTML =
      `<button class="chip ${activeCategory === '' ? 'active' : ''}" data-cat="">All categories</button>` +
      categories
        .map(
          (c) =>
            `<button class="chip ${activeCategory === c._id ? 'active' : ''}" data-cat="${c._id}">${escapeHtml(c.name)}</button>`
        )
        .join('');

    row.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        setActiveCategory(chip.dataset.cat);
        fetchAndRender();
      });
    });
  } catch (err) {
    row.innerHTML = '';
  }
}

function setActiveCategory(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('category', id);
  else url.searchParams.delete('category');
  window.history.replaceState({}, '', url);
}

function getActiveCategory() {
  return new URLSearchParams(window.location.search).get('category') || '';
}

async function fetchAndRender() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('results-count');
  grid.innerHTML = `<div class="product-card skeleton" style="height:260px;"></div><div class="product-card skeleton" style="height:260px;"></div><div class="product-card skeleton" style="height:260px;"></div><div class="product-card skeleton" style="height:260px;"></div>`;

  const q = document.getElementById('search-input').value.trim();
  const availability = document.getElementById('availability-select').value;
  const category = getActiveCategory();

  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (availability) params.set('availability', availability);
  if (category) params.set('category', category);

  try {
    const products = await api.get(`/products?${params.toString()}`, { auth: false });
    countEl.textContent = `${products.length} product${products.length === 1 ? '' : 's'} found`;
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="icon-tile" style="margin:0 auto 14px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M21 21l-3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div>
          <h3>No products match your search</h3>
          <p>Try a different keyword or clear the filters.</p>
        </div>`;
      return;
    }
    grid.innerHTML = products.map(productCardHtml).join('');
  } catch (err) {
    console.error('Could not load products:', err);
    grid.innerHTML = `<p class="text-muted">Could not load products: ${escapeHtml(err.message || 'Unknown error')}</p>`;
  }
}

document.getElementById('search-input').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchAndRender, 350);
});
document.getElementById('availability-select').addEventListener('change', fetchAndRender);

loadCategoryChips().then(fetchAndRender);
