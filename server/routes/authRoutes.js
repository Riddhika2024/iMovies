import express from 'express';
import {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getMe,
} from '../controllers/authController.js';
import fetchUser from '../middlewares/fetchUser.js';

const router = express.Router();

// User auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin auth
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// Token validation
router.get('/me', fetchUser, getMe);

// Logout
router.post('/logout', (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

export default router;
