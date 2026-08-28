const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      // User authentication check
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }
  
      // Role permission check
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. You do not have permission for this action.",
        });
      }
  
      next();
    };
  };
  
  export default authorizeRoles;