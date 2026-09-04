const axios = require('axios');

// Calls OpenWeatherMap and returns a simplified payload for the frontend.
// Keeps the API key on the server, per SRS section 6.2.
async function getWeatherByDistrict(district) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const place = district || process.env.DEFAULT_DISTRICT || 'Ahilyanagar';

  if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
    const err = new Error(
      'Weather service is not configured yet. Add OPENWEATHER_API_KEY to server/.env to enable live weather.'
    );
    err.status = 503;
    throw err;
  }

  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  const [currentRes, forecastRes] = await Promise.all([
    axios.get(url, { params: { q: `${place},IN`, appid: apiKey, units: 'metric' } }),
    axios.get(forecastUrl, { params: { q: `${place},IN`, appid: apiKey, units: 'metric' } }),
  ]);

  const current = currentRes.data;
  // Take one forecast point every ~24h (API returns 3-hour steps) for a short-term outlook
  const forecast = forecastRes.data.list
    .filter((_, idx) => idx % 8 === 0)
    .slice(0, 4)
    .map((f) => ({
      dateTime: f.dt_txt,
      temp: Math.round(f.main.temp),
      condition: f.weather[0].main,
      description: f.weather[0].description,
      icon: f.weather[0].icon,
    }));

  return {
    district: place,
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: current.weather[0].main,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    windSpeed: current.wind.speed,
    forecast,
  };
}

module.exports = { getWeatherByDistrict };
