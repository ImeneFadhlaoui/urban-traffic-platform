const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Non authentifié — token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();  
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Accès interdit — rôle insuffisant' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };