import { ethers } from "ethers";
const MembershipPoints = require("../contracts/MembershipPoints.json");

const RPC_URL = process.env.REACT_APP_ALCHEMY_API_URL || "http://localhost:8545";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
console.log("Contract Address:", CONTRACT_ADDRESS);
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, MembershipPoints.abi, provider);

export const getUserPoints = async (userAddress) => {
  const points = await contract.getPoints(userAddress);
  return ethers.formatUnits(points, 0);
};

export const getMembershipTier = async (userAddress) => {
  const tier = await contract.getTier(userAddress);
  return tier;
};

// Call backend API for adding points
export const addPoints = async (amount) => {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/membershipPoints/addPoints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  });
  if (!response.ok) {
    throw new Error("Failed to add points");
  }
  const data = await response.json();
  return data.txHash;
};

// Call backend API for redeeming points
export const redeemPoints = async (amount) => {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/membershipPoints/redeemPoints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  });
  if (!response.ok) {
    throw new Error("Failed to redeem points");
  }
  const data = await response.json();
  return data.txHash;
};
