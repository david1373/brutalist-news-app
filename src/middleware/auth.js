import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const apiKey = req.header('X-API-Key');

    if (!token && !apiKey) {
      throw new Error('Authentication required');
    }

    let user;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findOne({ _id: decoded.id, active: true });
    } else {
      user = await User.findOne({ apiKey, active: true });
    }

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Authentication failed',
        details: error.message
      }
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          required: roles,
          current: req.user.role
        }
      });
    }
    next();
  }
};