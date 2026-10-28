require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const cropTipRoutes = require('./routes/cropTipRoutes');
const contactRoutes = require('./routes/contactRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', inquiryRoutes);
app.use('/api', schemeRoutes);
app.use('/api', cropTipRoutes);
app.use('/api', contactRoutes);
app.use('/api', weatherRoutes);
app.use('/api', dashboardRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Krishi Seva Kendra API' }));

// Serve the frontend (client/) as static files, so the whole app can run from one server
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Krishi Seva Kendra server running on http://localhost:${PORT}`));
