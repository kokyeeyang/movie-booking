const express = require("express");
const router = express.Router();

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

module.exports = router;
