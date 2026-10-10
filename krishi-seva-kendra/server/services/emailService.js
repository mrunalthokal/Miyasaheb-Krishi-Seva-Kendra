const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`Email sent! Preview: https://ethereal.email/message/${info.messageId}`);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const sendInquiryNotification = (user, product, inquiry) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#2e7d32;padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">🌾 Krishi Seva Kendra</h2>
      </div>
      <div style="padding:24px;">
        <h3>Thank you for visiting, ${user.name}!</h3>
        <p>Your request has been received. Here are the details:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Product</b></td><td style="padding:8px;border:1px solid #ddd;">${product.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Quantity</b></td><td style="padding:8px;border:1px solid #ddd;">${inquiry.quantity} ${product.unit}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Total</b></td><td style="padding:8px;border:1px solid #ddd;">₹${inquiry.total}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Status</b></td><td style="padding:8px;border:1px solid #ddd;">Pending Payment</td></tr>
        </table>
        <p style="margin-top:16px;">Please complete your payment to confirm the order.</p>
        <p style="color:#888;font-size:12px;">- Miyasaheb Krishi Seva Kendra</p>
      </div>
    </div>`;
  return sendEmail(user.email || process.env.EMAIL_USER, `Your request for ${product.name} - Krishi Seva Kendra`, html);
};

const sendPaymentSuccess = (user, inquiry) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#2e7d32;padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">🌾 Krishi Seva Kendra</h2>
      </div>
      <div style="padding:24px;">
        <h3>🎉 Payment Successful, ${user.name}!</h3>
        <p>Your payment of <b>₹${inquiry.total}</b> has been confirmed.</p>
        <p>Your order will be processed shortly. Thank you for shopping with us!</p>
        <p style="color:#888;font-size:12px;">- Miyasaheb Krishi Seva Kendra</p>
      </div>
    </div>`;
  return sendEmail(user.email || process.env.EMAIL_USER, `Payment Confirmed - Krishi Seva Kendra`, html);
};

const sendWelcomeEmail = (user) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#2e7d32;padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">🌾 Krishi Seva Kendra</h2>
      </div>
      <div style="padding:24px;">
        <h3>Welcome, ${user.name}! 🎉</h3>
        <p>Thank you for visiting and registering at <b>Miyasaheb Krishi Seva Kendra</b>.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse and request agricultural products</li>
          <li>Check government schemes and subsidies</li>
          <li>Get crop tips and weather updates</li>
          <li>Track your orders anytime</li>
        </ul>
        <p>We are happy to serve you. Feel free to contact us anytime!</p>
        <p style="color:#888;font-size:12px;">- Miyasaheb Krishi Seva Kendra</p>
      </div>
    </div>`;
  return sendEmail(user.email, 'Welcome to Krishi Seva Kendra! 🌾', html);
};

module.exports = { sendEmail, sendInquiryNotification, sendPaymentSuccess, sendWelcomeEmail };
