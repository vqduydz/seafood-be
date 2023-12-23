import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../models';

dotenv.config();
const User = db.User;
// Middleware for verifying JWT token
export const verifyToken = (req, res, next) => {
  // Lấy giá trị của tiêu đề Authorization
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ errorMessage: 'Access Denied 1' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ errorMessage: 'Invalid Token' });
    }

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(401).json({ errorMessage: 'Access Denied' });
    }

    req.user = decoded;
    next();
  });
};

// Middleware for checking role of user
export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ errorMessage: 'You do not have permission to perform this action' });
  };
};
