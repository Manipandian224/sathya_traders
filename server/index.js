import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins for development, refine for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.send('Sathya Appalam API is live! Use /api/orders for order placement.');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📈 API Endpoint: http://localhost:${PORT}/api/orders\n`);
});
