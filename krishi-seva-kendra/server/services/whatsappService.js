const twilio = require('twilio');

const getClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const formatPhone = (phone) => {
  const digits = String(phone).replace(/\D/g, '');
  return `whatsapp:+${digits.length === 10 ? '91' + digits : digits}`;
};

const sendMessage = async (phone, message) => {
  const client = getClient();
  if (!client) { console.error('Twilio client not initialized'); return; }

  const to = formatPhone(phone);
  const from = process.env.TWILIO_WHATSAPP_FROM;

  console.log(`Sending WhatsApp to ${to}`);

  try {
    const result = await client.messages.create({
      from,
      to,
      body: message,
    });
    console.log(`WhatsApp sent! SID: ${result.sid}`);
  } catch (err) {
    console.error('WhatsApp error:', err.message);
  }
};

const sendTemplate = async (phone, template, params = []) => {
  const messages = {
    payment_success: `🎉 Payment Successful!\n\nHello ${params[0]}, your payment of ₹${params[1]} has been confirmed.\n\nThank you for shopping at Krishi Seva Kendra. Your order will be processed shortly!\n\n- Miyasaheb Krishi Seva Kendra`,
  };
  const body = messages[template] || params.join(', ');
  await sendMessage(phone, body);
};

module.exports = { sendTemplate, sendMessage };
