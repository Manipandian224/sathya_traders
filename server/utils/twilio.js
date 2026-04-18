import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

let client;
try {
  if (process.env.TWILIO_SID && process.env.TWILIO_SID.startsWith('AC')) {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.warn('[Twilio] Invalid or missing TWILIO_SID. WhatsApp notifications will be disabled.');
  }
} catch (err) {
  console.error('[Twilio] Initialization error:', err.message);
}

/**
 * Sends a WhatsApp message using Twilio
 * @param {string} message - The text content of the message
 * @param {string} to - The recipient's WhatsApp number in E.164 format (e.g., whatsapp:+91xxxxxxxxxx)
 * @returns {Promise<string>} - The Message SID if successful
 */
export const sendWhatsAppMessage = async (message, to) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: to
    });
    
    console.log(`[Twilio] Message sent successfully. SID: ${response.sid}`);
    return response.sid;
  } catch (error) {
    console.error(`[Twilio Error] Failed to send WhatsApp message to ${to}:`, error.message);
    throw new Error('WhatsApp notification failed');
  }
};
