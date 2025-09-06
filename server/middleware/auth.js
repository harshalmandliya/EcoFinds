const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('🔑 Token received:', token.substring(0, 20) + '...');
    console.log('🔐 JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', decoded);
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      console.log('❌ User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log('✅ User found:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
