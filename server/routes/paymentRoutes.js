import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import fetchUser from '../middlewares/fetchUser.js';

const router = express.Router();

router.post('/create-order', fetchUser, createOrder);
router.post('/verify', fetchUser, verifyPayment);

export default router;
