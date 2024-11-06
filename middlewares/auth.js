const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token is available
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // Attach payload to request
      next(); // Move to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during authentication",
    });
  }
};
