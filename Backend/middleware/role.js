

// middleware/role.js
// Role-based access control middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const hasRole = roles.includes(req.user.userType);
    if (!hasRole) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
};

// Admin access middleware
const isAdmin = checkRole([1]);

// Manager access middleware
const isManager = checkRole([2]);

// Admin or Manager access middleware
const isAdminOrManager = checkRole([1, 2]);

module.exports = {
  checkRole,
  isAdmin,
  isManager,
  isAdminOrManager
};