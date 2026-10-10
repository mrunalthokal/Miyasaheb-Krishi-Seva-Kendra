const express = require('express');
const router = express.Router();

const knowledge = [
  // Crops
  { keys: ['soybean', 'soya', 'soyabean'], reply: '🌱 Soybean Tips:\n• Sow after first good monsoon rain (June-July)\n• Use JS-335 or MAUS-71 varieties\n• Seed rate: 70-80 kg/hectare\n• Apply Rhizobium culture before sowing\n• Avoid waterlogging — ensure proper drainage\n• Harvest when 95% pods turn brown' },
  { keys: ['cotton', 'kapas'], reply: '🌿 Cotton Tips:\n• Sow in June after monsoon onset\n• Use BT hybrid varieties for bollworm resistance\n• Spacing: 90x60 cm for hybrid varieties\n• Monitor for bollworm from 45th day\n• Apply NPK 25:25:0 at sowing\n• Irrigate at flowering and boll formation stage' },
  { keys: ['wheat', 'gehu'], reply: '🌾 Wheat Tips:\n• Ideal sowing: mid-November to December\n• Use GW-496 or HD-2781 varieties\n• Seed rate: 100-125 kg/hectare\n• Apply first irrigation 20-25 days after sowing\n• Apply urea in 2 splits — at sowing and tillering\n• Harvest when grain moisture is below 14%' },
  { keys: ['onion', 'kanda', 'pyaz'], reply: '🧅 Onion Tips:\n• Use Bhima Raj or Nasik Red varieties\n• Transplant seedlings at 4-5 leaf stage\n• Spacing: 15x10 cm\n• Apply potash for better bulb size\n• Stop irrigation 10 days before harvest\n• Cure bulbs in shade for 7-10 days before storage' },
  { keys: ['tomato', 'tamatar'], reply: '🍅 Tomato Tips:\n• Use hybrid F1 varieties for high yield\n• Transplant 25-30 day old seedlings\n• Spacing: 60x45 cm\n• Apply calcium spray to prevent blossom end rot\n• Stake plants at 30 cm height\n• Irrigate regularly — avoid water stress at flowering' },
  { keys: ['maize', 'corn', 'makka'], reply: '🌽 Maize Tips:\n• Sow in June-July for Kharif season\n• Use DHM-117 or NK-6240 hybrid varieties\n• Seed rate: 20-25 kg/hectare\n• Spacing: 60x20 cm\n• Apply nitrogen in 3 splits\n• Harvest when husk turns brown and grain is hard' },
  { keys: ['groundnut', 'peanut', 'shengdana'], reply: '🥜 Groundnut Tips:\n• Sow in June-July\n• Use TAG-24 or JL-24 varieties\n• Seed rate: 100-120 kg/hectare\n• Apply gypsum at pegging stage for calcium\n• Avoid waterlogging — use raised beds\n• Harvest when leaves turn yellow and pods are mature' },
  // Fertilizers
  { keys: ['urea', 'nitrogen', 'natrajan'], reply: '🧪 Urea Tips:\n• Contains 46% Nitrogen\n• Apply in 2-3 splits for best results\n• Do not apply before rain — causes nitrogen loss\n• Recommended dose: 100-150 kg/hectare for most crops\n• Apply in the evening to reduce volatilization\n• Available at our center: ₹266/bag (45kg)' },
  { keys: ['dap', 'phosphorus', 'phosphate'], reply: '🧪 DAP Tips:\n• Contains 18% Nitrogen + 46% Phosphorus\n• Apply at sowing time as basal dose\n• Promotes strong root development\n• Recommended dose: 100-125 kg/hectare\n• Do not mix with urea directly\n• Available at our center: ₹1350/bag (50kg)' },
  { keys: ['fertilizer', 'khad', 'manure'], reply: '🌿 Fertilizer Guide:\n• NPK 19:19:19 — balanced nutrition for all crops\n• Urea — for nitrogen top dressing\n• DAP — for basal phosphorus application\n• Vermi Compost — for organic matter improvement\n• Zinc Sulphate — for zinc deficiency correction\n• Visit our Products page to order fertilizers' },
  // Pesticides
  { keys: ['pest', 'insect', 'kide', 'bug'], reply: '🐛 Pest Management:\n• Monitor crops regularly from early stage\n• Use yellow sticky traps for whiteflies\n• Neem oil spray (3ml/litre) for sucking pests\n• Imidacloprid for aphids and jassids\n• Chlorpyrifos for soil pests\n• Follow IPM — use chemicals only when necessary' },
  { keys: ['fungus', 'disease', 'blight', 'mildew'], reply: '🍄 Disease Management:\n• Ensure proper plant spacing for air circulation\n• Avoid overhead irrigation\n• Use Mancozeb 75% WP for fungal diseases\n• Copper Oxychloride for downy mildew and blight\n• Remove and destroy infected plant parts\n• Apply fungicide preventively during humid weather' },
  { keys: ['weed', 'gavar', 'tarn'], reply: '🌿 Weed Management:\n• Do first weeding 20-25 days after sowing\n• Use Glyphosate for non-crop area weeds\n• Manual weeding is best for standing crops\n• Mulching reduces weed growth significantly\n• Avoid weeding during flowering stage\n• Keep field bunds clean to prevent weed spread' },
  // Irrigation
  { keys: ['irrigation', 'water', 'drip', 'pani'], reply: '💧 Irrigation Tips:\n• Drip irrigation saves 40-50% water\n• Critical stages: flowering, grain filling, fruit set\n• Avoid irrigation during peak afternoon heat\n• Check soil moisture before irrigating\n• Drip Irrigation Kit (0.5 acre) available: ₹6800\n• Apply fertilizers through drip for best efficiency' },
  // Soil
  { keys: ['soil', 'mati', 'ph', 'health'], reply: '🌍 Soil Health Tips:\n• Test soil every 2 years for nutrients\n• Ideal pH for most crops: 6.5-7.5\n• Add organic matter to improve soil structure\n• Use Soil Health Card scheme for free testing\n• Apply Vermi Compost to improve fertility\n• Soil Testing Kit available at our center: ₹950' },
  // Weather
  { keys: ['weather', 'rain', 'monsoon', 'hava'], reply: '🌤️ Weather Info:\n• Check our Weather page for real-time updates\n• Monsoon onset in Maharashtra: June 10-15\n• Avoid spraying pesticides before rain\n• Harvest crops before predicted heavy rain\n• Use weather forecast for irrigation planning\n• Visit: weather.html for your district forecast' },
  // Schemes
  { keys: ['scheme', 'subsidy', 'government', 'yojana', 'sarkar'], reply: '🏛️ Government Schemes:\n• PM-KISAN: ₹6000/year income support\n• PMFBY: Crop insurance at low premium\n• Soil Health Card: Free soil testing\n• Kisan Credit Card: Loan at 4% interest\n• PM Krishi Sinchai: Drip irrigation subsidy\n• Visit our Schemes page for full details and official links' },
  // Seasons
  { keys: ['kharif', 'summer', 'monsoon crop'], reply: '☀️ Kharif Season (June-October):\n• Major crops: Soybean, Cotton, Maize, Groundnut\n• Sow after first good monsoon rain\n• Ensure field drainage before sowing\n• Monitor for pests during humid weather\n• Apply basal fertilizer at sowing time' },
  { keys: ['rabi', 'winter', 'winter crop'], reply: '❄️ Rabi Season (October-March):\n• Major crops: Wheat, Onion, Chickpea\n• Sow after monsoon withdrawal\n• Irrigation is critical — no rain dependence\n• Apply potash for better quality produce\n• Watch for frost damage in December-January' },
  // Products
  { keys: ['product', 'buy', 'price', 'order', 'kharedi'], reply: '🛒 Our Products:\n• Seeds: Cotton, Soybean, Wheat, Onion, Tomato, Maize\n• Fertilizers: Urea, DAP, Vermi Compost, NPK\n• Pesticides: Neem Oil, Chlorpyrifos, Mancozeb\n• Tools: Battery Sprayer, Drip Kit, Khurpi\n• Visit Products page to browse and order\n• Login required to place orders' },
  // Contact
  { keys: ['contact', 'phone', 'address', 'location', 'help'], reply: '📞 Contact Us:\n• Visit our Contact page for details\n• Submit your query through the contact form\n• Our team will respond within 24 hours\n• Visit the center during working hours for in-person help' },
];

router.post('/message', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const msg = message.toLowerCase();
  
  for (const item of knowledge) {
    if (item.keys.some(k => msg.includes(k))) {
      return res.json({ reply: item.reply });
    }
  }

  res.json({ reply: '🌾 I can help you with:\n• Crop tips (soybean, cotton, wheat, onion, tomato, maize)\n• Fertilizer advice (urea, DAP, NPK)\n• Pest & disease management\n• Irrigation guidance\n• Government schemes\n• Weather information\n• Product information\n\nPlease ask a specific farming question!' });
});

module.exports = router;
