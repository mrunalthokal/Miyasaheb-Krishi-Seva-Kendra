require('dotenv').config();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection (server kept running):', err?.message || err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception (server kept running):', err?.message || err);
});

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Existing routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const cropTipRoutes = require('./routes/cropTipRoutes');
const contactRoutes = require('./routes/contactRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// NEW: chatbot (merged from the separate chatbot project) and Razorpay payments
const chatbotRoutes = require('./routes/chatbotRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// NEW: specific prefixes are mounted first, so a router-level auth
// middleware in the generic '/api' routers can never intercept them
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/payment', paymentRoutes);

// API routes (existing)
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', inquiryRoutes);
app.use('/api', schemeRoutes);
app.use('/api', cropTipRoutes);
app.use('/api', contactRoutes);
app.use('/api', weatherRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', feedbackRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Krishi Seva Kendra API' }));

// Visitor email notification
app.post('/api/visitor-email', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.json({ message: 'No token' });
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('./models/User');
    const user = await User.findById(decoded.id);
    console.log('Visitor email - user:', user?.name, 'email:', user?.email);
    if (!user?.email) return res.json({ message: 'No email on file' });
    const { sendEmail } = require('./services/emailService');
    await sendEmail(user.email, 'Welcome back to Krishi Seva Kendra! 🌾', `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:#2e7d32;padding:20px;text-align:center;">
          <h2 style="color:#fff;margin:0;">🌾 Krishi Seva Kendra</h2>
        </div>
        <div style="padding:24px;">
          <h3>Welcome back, ${user.name}!</h3>
          <p>Thank you for visiting Miyasaheb Krishi Seva Kendra. Here is what's available for you today:</p>
          <ul>
            <li>Browse and buy agricultural products</li>
            <li>Check government schemes and subsidies</li>
            <li>Get seasonal crop tips</li>
            <li>Check local weather updates</li>
          </ul>
          <p style="color:#888;font-size:12px;margin-top:1.5rem;">- Miyasaheb Krishi Seva Kendra</p>
        </div>
      </div>`);
    res.json({ message: 'Email sent!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Serve the frontend (client/) as static files, so the whole app can run from one server
// This also serves client/widget/ (the chatbot widget) at /widget/...
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

const server = app.listen(PORT, () => console.log(`Krishi Seva Kendra server running on http://localhost:${PORT}`));

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}...`);
    server.listen(PORT + 1);
  }
});
