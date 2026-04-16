const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");

admin.initializeApp();

// Initialize Razorpay with credentials from environment config
// Usage: firebase functions:config:set razorpay.key_id="YOUR_KEY" razorpay.key_secret="YOUR_SECRET"
const razorpay = new Razorpay({
  key_id: functions.config().razorpay?.key_id || "your_key_id",
  key_secret: functions.config().razorpay?.key_secret || "your_key_secret",
});

/**
 * Creates a Razorpay Order
 * Called from frontend with { amount, receipt }
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  // Authentication check (optional, but recommended)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  // }

  const options = {
    amount: data.amount * 100, // Amount in smallest currency unit (paise)
    currency: "INR",
    receipt: data.receipt || `receipt_${Date.now()}`,
    payment_capture: 1, // Auto-capture payment
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    throw new functions.https.HttpsError("internal", "Could not create Razorpay order.");
  }
});
