import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Replace with your deployed address

const ABI = [
  "function getPoints() view returns (uint256)",
  "function getTier() view returns (string)" // Optional: add more as needed
];

export async function getTotalUserPoints() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const points = await contract.getPoints();
  return points.toString(); // Convert BigInt to string
}