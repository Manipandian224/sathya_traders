import express from 'express';
import { createOrder, createCashfreeSession, verifyCashfreePayment } from '../controllers/orderController.js';

const router = express.Router();

/**
 * @route POST /api/orders
 * @desc Create a new order and send WhatsApp notifications
 * @access Public
 */
router.post('/', createOrder);

/**
 * @route POST /api/orders/create-session
 * @desc Create a Cashfree order session
 */
router.post('/create-session', createCashfreeSession);

/**
 * @route POST /api/orders/verify
 * @desc Verify Cashfree payment
 */
router.post('/verify', verifyCashfreePayment);

export default router;
