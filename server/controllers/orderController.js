import admin from 'firebase-admin';
import { nanoid } from 'nanoid';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { sendWhatsAppMessage } from '../utils/twilio.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
const rtdbUrl = process.env.FIREBASE_DATABASE_URL;

// Initialize Cashfree
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENV === 'production' 
  ? CFEnvironment.PRODUCTION 
  : CFEnvironment.SANDBOX;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: rtdbUrl
  });
} else {
  console.warn('[Firebase Admin] Service account file not found. Database operations might fail if not authenticated via other means.');
  // If running on environments like Firebase or with local defaults, you might try:
  // admin.initializeApp({ databaseURL: rtdbUrl });
}

const db = admin.database();

/**
 * Handle Order Placement
 */
export const createOrder = async (req, res) => {
  try {
    const { name, phone, productName, price, address, paymentMethod, cartItems } = req.body;

    // 1. Basic Validation
    if (!name || !phone || !productName || !price || !address) {
      return res.status(400).json({ success: false, message: 'Missing required order fields' });
    }

    // 2. Generate Unique Order ID
    const orderId = `SA-${nanoid(8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // 3. Prepare Order Data
    const orderData = {
      orderId,
      name,
      phone,
      productName,
      price,
      address,
      paymentMethod,
      cartItems: cartItems || [],
      status: 'Pending',
      createdAt: timestamp
    };

    // 4. Save to Firebase Realtime Database
    const orderRef = db.ref('orders').push();
    await orderRef.set({ ...orderData, dbKey: orderRef.key });

    // 5. Send WhatsApp Notifications
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    const customerNumber = `whatsapp:${phone}`; // Ensure phone is in E.164 format from frontend

    // Admin Message
    const adminMsg = `🛒 *NEW ORDER RECEIVED*
Order ID: ${orderId}
Customer: ${name}
Product: ${productName}
Price: ₹${price}
Phone: ${phone}
Address: ${address}
Payment: ${paymentMethod}
Time: ${new Date().toLocaleString()}`;

    // Customer Message
    const customerMsg = `✅ *Order Confirmed!*
Order ID: ${orderId}
Product: ${productName}
Amount: ₹${price}

We will deliver soon 🚚
Thank you for shopping with *Sathya Appalam*!`;

    // Fire and forget (or handle errors for each)
    try {
      if (adminNumber) {
        await sendWhatsAppMessage(adminMsg, adminNumber);
      }
      await sendWhatsAppMessage(customerMsg, customerNumber);
    } catch (msgError) {
      console.error('[WhatsApp Notification Error]', msgError.message);
      // We don't fail the whole order if notification fails, but we log it
    }

    // 6. Respond to Frontend
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: orderId,
      data: orderData
    });

  } catch (error) {
    console.error('[Create Order Error]', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

/**
 * Creates a Cashfree Order Session
 */
export const createCashfreeSession = async (req, res) => {
  const { amount, customer_id, customer_phone, customer_email, order_id } = req.body;

  const request = {
    order_amount: amount,
    order_currency: "INR",
    order_id: order_id || `order_${Date.now()}`,
    customer_details: {
      customer_id: customer_id,
      customer_phone: customer_phone,
      customer_email: customer_email || 'customer@example.com'
    },
    order_meta: {
      return_url: `${req.headers.origin}/orders?order_id={order_id}`
    }
  };

  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Cashfree Order Session Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Could not create Cashfree order", error: error.response?.data || error.message });
  }
};

/**
 * Verify Cashfree Payment
 */
export const verifyCashfreePayment = async (req, res) => {
  const { order_id } = req.body;

  try {
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", order_id);
    const payments = response.data;
    const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      return res.status(200).json({ success: true, payment: successfulPayment });
    } else {
      return res.status(400).json({ success: false, message: 'No successful payment found' });
    }
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
