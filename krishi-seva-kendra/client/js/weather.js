initLayout('weather');

async function loadWeather(district) {
  const result = document.getElementById('weather-result');
  result.innerHTML = `<div class="card skeleton" style="height:220px;"></div>`;
  try {
    const params = district ? `?district=${encodeURIComponent(district)}` : '';
    const w = await api.get(`/weather${params}`, { auth: false });

    const forecastHtml = (w.forecast || [])
      .map((f) => {
        const date = new Date(f.dateTime);
        const label = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
        return `
        <div class="card-flat text-center" style="flex:1;">
          <div class="text-muted" style="font-size:0.8rem; margin-bottom:6px;">${label}</div>
          <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="${escapeHtml(f.condition)}" style="margin:0 auto; width:40px; height:40px;" />
          <div style="font-weight:600;">${f.temp}°C</div>
          <div class="text-muted" style="font-size:0.78rem; text-transform:capitalize;">${escapeHtml(f.description)}</div>
        </div>`;
      })
      .join('');

    result.innerHTML = `
      <div class="card" style="margin-bottom:1.4rem;">
        <div class="weather-chip-top">
          <div>
            <div class="weather-place">${escapeHtml(w.district)}</div>
            <div class="weather-temp">${w.temperature}°C</div>
            <div class="weather-cond">${escapeHtml(w.description)}</div>
          </div>
          <img class="weather-icon" src="https://openweathermap.org/img/wn/${w.icon}@2x.png" alt="${escapeHtml(w.condition)}" style="width:76px;height:76px;" />
        </div>
        <div class="weather-meta">
          <span>Feels like ${w.feelsLike}°C</span>
          <span>Humidity ${w.humidity}%</span>
          <span>Wind ${w.windSpeed} m/s</span>
        </div>
      </div>
      ${forecastHtml ? `<div class="flex-gap" style="gap:12px; flex-wrap:wrap;">${forecastHtml}</div>` : ''}
    `;
  } catch (err) {
    result.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
}

document.getElementById('district-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const district = document.getElementById('district-input').value.trim();
  if (district) loadWeather(district);
});

// Show prompt instead of auto-loading
document.getElementById('weather-result').innerHTML = `
  <div class="card" style="text-align:center; padding:2rem;">
    <div style="font-size:3rem;">🌤️</div>
    <h3 style="margin-top:0.5rem;">Check Weather for Your Area</h3>
    <p class="text-muted">Enter your city or district name above and click Get Weather.</p>
  </div>`;
