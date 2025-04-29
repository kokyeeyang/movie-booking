const express = require("express");
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions
} = require("../middleware/authentication");

const { updateMembershipPoints, getUserPoints } = require("../controllers/membershipPointsController");

router.patch("/update-membership-points", authenticateUser, updateMembershipPoints);

router.get("/get-user-points", authenticateUser, getUserPoints);

module.exports = router;