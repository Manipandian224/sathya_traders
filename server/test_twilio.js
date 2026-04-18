import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
const to = process.env.ADMIN_WHATSAPP_NUMBER;

console.log('--- Twilio Diagnostic Test ---');
console.log('SID:', accountSid ? 'FOUND' : 'MISSING');
console.log('TOKEN:', authToken ? 'FOUND' : 'MISSING');
console.log('FROM:', from);
console.log('TO:', to);

if (!accountSid || !authToken || !to) {
    console.error('❌ Error: Missing credentials or recipient number in .env');
    process.exit(1);
}

const client = twilio(accountSid, authToken);

async function testTwilio() {
    try {
        console.log('\nSending test message...');
        const message = await client.messages.create({
            body: '🔍 Sathya Traders: Twilio Connection Test - Successful!',
            from: from,
            to: to
        });
        console.log('✅ Success! Message SID:', message.sid);
    } catch (error) {
        console.error('\n❌ Twilio API Error:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('More Info:', error.moreInfo);
        
        if (error.code === 21608) {
            console.log('\n💡 Tip: This number has not joined your Twilio Sandbox. Send "join <your-keyword>" to the Twilio number from your WhatsApp.');
        }
    }
}

testTwilio();
