import express from 'express';
import {
  getAllTransactions,
  processRefund,
  getAdminOverview,
  getAllUsers,
} from '../controllers/adminController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

router.get('/transactions', adminAuth, getAllTransactions);
router.post('/refund/:paymentId', adminAuth, processRefund);
router.get('/overview', adminAuth, getAdminOverview);
router.get('/users', adminAuth, getAllUsers);

export default router;
