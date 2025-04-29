const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getCurrentUser,
  changePassword,
  updateUserInfo,
} = require('../controllers/userController');

// router
//   .route('/')
//   .get(authenticateUser, authorizePermissions('admin'), getAllUsers);

router.route('/getCurrentUser').get(authenticateUser, getCurrentUser);
router.route('/updateUserInfo').patch(authenticateUser, updateUserInfo);
router.route('/change-password').patch(authenticateUser, changePassword);

module.exports = router;
