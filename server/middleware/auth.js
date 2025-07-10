const jwt = require('jsonwebtoken');

module.exports = {
  auth: async (req, res, next) => {
    try {
      // Allow public access to GET /api/posts
      if (req.method === 'GET' && req.path === '/api/posts') {
        return next();
      }
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        console.log('No token provided in request');
        return res.status(401).json({ message: 'No token provided' });
      }
      const decoded = jwt.verify(token, 'Wantam254');
      console.log('Decoded JWT:', decoded); // Debug JWT
      req.user = decoded.user; // Expecting { user: { id, name, role } }
      if (!req.user?.id) {
        throw new Error('Invalid token structure: missing user.id');
      }
      next();
    } catch (err) {
      console.error('Auth middleware error:', {
        message: err.message,
        stack: err.stack,
      });
      res.status(401).json({ message: 'Invalid token' });
    }
  },
  admin: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        console.log('No token provided in admin request');
        return res.status(401).json({ message: 'No token provided' });
      }
      const decoded = jwt.verify(token, 'Wantam254');
      console.log('Decoded JWT (admin):', decoded); // Debug JWT
      req.user = decoded.user; // Expecting { user: { id, name, role } }
      if (!req.user?.id) {
        throw new Error('Invalid token structure: missing user.id');
      }
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    } catch (err) {
      console.error('Admin middleware error:', {
        message: err.message,
        stack: err.stack,
      });
      res.status(401).json({ message: 'Invalid token' });
    }
  },
};