import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026';

export const fetchUser = (req, res, next) => {
  try {
    // Get token from header: "Bearer <token>" or "x-auth-token"
    let token = req.header('Authorization') || req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, username, role }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export default fetchUser;
