import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cashfree Setup
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENV === 'production' 
  ? CFEnvironment.PRODUCTION 
  : CFEnvironment.SANDBOX;

// Twilio Setup
const accountSid = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

let client;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Twilio client:', err.message);
  }
} else {
  console.warn('⚠️ Twilio credentials missing (SID or Token). WhatsApp notifications will not work.');
  console.log('Check your .env file for TWILIO_SID and TWILIO_AUTH_TOKEN');
}

/**
 * @route POST /send-order
 * @desc Send WhatsApp notification to Admin & Customer
 */
const sendOrderHandler = async (req, res) => {
  const { name, product, price, phone, address, orderId } = req.body;

  console.log('📦 New Order received for notification:', { name, product, price, phone, orderId });

  // Basic validation
  if (!name || !product || !price || !phone || !address) {
    return res.status(400).json({ success: false, message: 'Missing required order fields' });
  }

  // Format WhatsApp numbers (Twilio requires 'whatsapp:' prefix)
  const formattedAdminNum = adminNumber?.startsWith('whatsapp:') ? adminNumber : `whatsapp:${adminNumber}`;
  const formattedCustomerNum = phone?.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

  // Admin Message Content
  const adminMsg = `🛒 *New Order Alert*
Order ID: ${orderId || 'N/A'}
Name: ${name}
Product: ${product}
Price: ₹${price}
Phone: ${phone}
Address: ${address}`;

  // Customer Message Content
  const customerMsg = `✅ *Order Confirmed!*
Hi ${name}, thank you for ordering from *Sathya Appalam*.
Your order for *${product}* (₹${price}) has been received.

🚚 We will deliver it to:
${address}

Order ID: ${orderId || 'N/A'}`;

  try {
    if (!client) throw new Error('Twilio client not initialized');

    // 1. Send to Admin
    if (adminNumber) {
      await client.messages.create({
        body: adminMsg,
        from: twilioNumber,
        to: formattedAdminNum
      });
      console.log('✅ WhatsApp sent to Admin');
    }

    // 2. Send to Customer
    await client.messages.create({
      body: customerMsg,
      from: twilioNumber,
      to: formattedCustomerNum
    });
    console.log('✅ WhatsApp sent to Customer');

    res.status(200).json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('❌ Twilio Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send WhatsApp notification', 
      error: error.message 
    });
  }
};

app.post('/send-order', sendOrderHandler);
app.post('/api/send-order', sendOrderHandler);

app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Sathya Appalam Backend is running! 🚀');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/send-order\n`);
});
