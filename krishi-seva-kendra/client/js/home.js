initLayout('home');

const CATEGORY_ICONS = {
  'Seeds': '<path d="M12 3C7 6 5 10 5 14a7 7 0 0014 0c0-4-2-8-7-11Z" stroke="currentColor" stroke-width="1.6"/>',
  'Fertilizers': '<path d="M6 21V9l6-5 6 5v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 21v-6h4v6" stroke="currentColor" stroke-width="1.6"/>',
  'Pesticides': '<path d="M4 12h9M13 12l4-4M13 12l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="19" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/>',
  'Tools & Equipment': '<path d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-3-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};

async function loadWeatherChip() {
  const holder = document.getElementById('weather-chip-holder');
  try {
    const w = await api.get('/weather', { auth: false });
    holder.innerHTML = `
      <div class="weather-chip">
        <div class="weather-chip-top">
          <div>
            <div class="weather-place">${escapeHtml(w.district)}</div>
            <div class="weather-temp">${w.temperature}°C</div>
            <div class="weather-cond">${escapeHtml(w.description)}</div>
          </div>
          <img class="weather-icon" src="https://openweathermap.org/img/wn/${w.icon}@2x.png" alt="${escapeHtml(w.condition)}" />
        </div>
        <div class="weather-meta">
          <span>Feels like ${w.feelsLike}°C</span>
          <span>Humidity ${w.humidity}%</span>
          <span>Wind ${w.windSpeed} m/s</span>
        </div>
      </div>`;
  } catch (err) {
    holder.innerHTML = `
      <div class="weather-chip">
        <p class="mb-0" style="color: var(--ink-faint);">Weather is unavailable right now.</p>
        <a href="weather.html" class="btn btn-outline btn-sm" style="margin-top:10px;">Check weather page</a>
      </div>`;
  }
}

async function loadCategories() {
  const grid = document.getElementById('category-grid');
  try {
    const categories = await api.get('/categories', { auth: false });
    grid.innerHTML = categories
      .map(
        (c) => `
      <a href="products.html?category=${c._id}" class="card-flat" style="text-decoration:none;">
        <div class="icon-tile"><svg width="20" height="20" viewBox="0 0 24 24" fill="none">${CATEGORY_ICONS[c.name] || CATEGORY_ICONS['Seeds']}</svg></div>
        <h3 style="font-size:1.05rem; margin-bottom:2px;">${escapeHtml(c.name)}</h3>
        <span class="text-muted" style="font-size:0.85rem;">Browse products →</span>
      </a>`
      )
      .join('');
  } catch (err) {
    grid.innerHTML = `<p class="text-muted">Could not load categories.</p>`;
  }
}

async function loadFeaturedProducts() {
  const grid = document.getElementById('featured-products');
  try {
    const products = await api.get('/products', { auth: false });
    document.getElementById('stat-products').textContent = products.length;
    const featured = products.slice(0, 4);
    if (featured.length === 0) {
      grid.innerHTML = `<p class="text-muted">No products listed yet.</p>`;
      return;
    }
    grid.innerHTML = featured.map(productCardHtml).join('');
  } catch (err) {
    grid.innerHTML = `<p class="text-muted">Could not load products.</p>`;
  }
}

function productCardHtml(p) {
  const catName = p.categoryId && p.categoryId.name ? p.categoryId.name : '';
  const badgeClass = p.stockStatus === 'Available' ? 'badge-available' : 'badge-outofstock';
  return `
    <a href="product-details.html?id=${p._id}" class="product-card" style="text-decoration:none; color:inherit;">
      <div class="product-thumb"><svg width="34" height="34" viewBox="0 0 24 24" fill="none">${CATEGORY_ICONS[catName] || CATEGORY_ICONS['Seeds']}</svg></div>
      <div class="product-body">
        <span class="product-cat">${escapeHtml(catName)}</span>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <div class="product-price">${formatCurrency(p.price)} <span>/ ${escapeHtml(p.unit)}</span></div>
        <div class="product-foot">
          <span class="badge ${badgeClass}">${p.stockStatus}</span>
        </div>
      </div>
    </a>`;
}

loadWeatherChip();
loadCategories();
loadFeaturedProducts();

// Send welcome email when logged in farmer visits
if (Auth.isLoggedIn('Farmer') && !sessionStorage.getItem('ksk_visit_email_sent')) {
  api.post('/visitor-email', {}, {}).catch(() => {});
  sessionStorage.setItem('ksk_visit_email_sent', '1');
}
