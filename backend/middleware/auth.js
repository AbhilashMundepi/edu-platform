const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Middleware to check if user is academy
const isAcademy = (req, res, next) => {
  if (req.user.userType !== 'academy') {
    return res.status(403).json({ error: 'Access denied. Academy users only.' });
  }
  next();
};

// Middleware to check if user is student
const isStudent = (req, res, next) => {
  if (req.user.userType !== 'student') {
    return res.status(403).json({ error: 'Access denied. Student users only.' });
  }
  next();
};

module.exports = { auth, isAcademy, isStudent };
