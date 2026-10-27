import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// USER REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, and password.' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ success: false, message: 'Username must be between 3 and 20 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check existing
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase() ? 'Email is already registered.' : 'Username is taken.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'user',
    });

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: 'user',
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

// USER LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role || 'user',
    });

    return res.status(200).json({
      success: true,
      message: 'Welcome back!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ADMIN REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all admin credentials.' });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
    });

    const token = generateToken({
      id: newAdmin._id,
      email: newAdmin.email,
      username: newAdmin.username,
      role: 'admin',
    });

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully!',
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error registering admin.' });
  }
};

// ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter admin email and password.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      username: admin.username,
      role: 'admin',
    });

    return res.status(200).json({
      success: true,
      message: 'Admin access authorized.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error logging in as admin.' });
  }
};

// GET CURRENT USER / VALIDATE TOKEN
export const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      return res.json({ success: true, user: admin, role: 'admin' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user, role: user.role });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error verifying profile.' });
  }
};
