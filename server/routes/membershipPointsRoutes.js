const ethers = require("ethers");
const MembershipPoints = require("../contracts/MembershipPoints.json");

const RPC_URL = process.env.ALCHEMY_API_URL || "http://localhost:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, MembershipPoints.abi, wallet);

const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  updateMembershipPoints,
  getUserPoints,
} = require("../controllers/membershipPointsController");

router.patch("/update-membership-points", authenticateUser, updateMembershipPoints);

router.get("/get-user-points", authenticateUser, getUserPoints);

router.post("/addPoints", async (req, res) => {
  console.log("POST /addPoints route hit");
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
    const tx = await contract.addPoints(amount);
    await tx.wait();
    res.json({ txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add points" });
  }
});

router.post("/redeemPoints", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
    const tx = await contract.redeemPoints(amount);
    await tx.wait();
    res.json({ txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to redeem points" });
  }
});

module.exports = router;
