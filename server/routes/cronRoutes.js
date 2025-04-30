const express = require("express");
const router = express.Router();
const { expireAllExpiredPoints } = require("../controllers/cronController");

router.patch("/expire-all-expired-points", expireAllExpiredPoints);

module.exports = router;