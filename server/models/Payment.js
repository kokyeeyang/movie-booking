const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Success", "Failed", "Refunded"] },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model("Payment", PaymentSchema);
