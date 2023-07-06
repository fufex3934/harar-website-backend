require('dotenv').config();
  const jwt = require('jsonwebtoken');
  const  authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          return res.status(403).json({ message: 'Invalid token' });
        } else if (err instanceof jwt.TokenExpiredError) {
          return res.status(403).json({ message: 'Token expired' });
        }
      }
  
      req.user = decodedToken.userId; // Use the correct property name
      next();
    });
  };
module.exports = authenticateToken;