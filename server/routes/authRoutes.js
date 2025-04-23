const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  signup,
  verifyEmail,
  login,
  logout,
} = require("../controllers/authController");

router.get("/admin-landing-page", authenticateUser, authorizePermissions("admin"));
router.post("/sign-up", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.delete("/logout", logout);

// Example middleware to protect the route
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach decoded user info
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
