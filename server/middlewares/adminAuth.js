import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026';

export const adminAuth = (req, res, next) => {
  try {
    let token = req.header('Authorization') || req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. Admin credentials required.' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
    }

    req.admin = decoded;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session.' });
  }
};

export default adminAuth;
