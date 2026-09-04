const { getWeatherByDistrict } = require('../services/weatherService');

// GET /api/weather?district=  (FR11)
exports.getWeather = async (req, res, next) => {
  try {
    const data = await getWeatherByDistrict(req.query.district);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
