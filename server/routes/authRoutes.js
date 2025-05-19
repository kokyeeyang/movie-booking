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
const User = require("../models/User");

const sendLoginNotification = async (userEmail) => {
  const message = {
    content: `User ${userEmail} just logged in.`
  }

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, message);
  } catch (error) {
    console.error(`Failed to send login notification: ${error.message}`);
  }
}
router.get("/admin-landing-page", authenticateUser, authorizePermissions("admin"));
router.post("/sign-up", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login, async(req, res) => {
  console.log('inside login route')
  const { email, password } = req.body;

  try {
    const user = await User.findOne({email});

    if(!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials'});
    }

    await sendLoginNotification(user.email);

    res.status(200).json({message: 'Login successful', token});
  } catch (error){
    res.status(500).json({ message: 'Server error'});
  }
});
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
