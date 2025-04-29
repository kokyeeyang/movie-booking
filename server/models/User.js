const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastname: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  verified: Date,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordTokenExpirationDate: {
    type: Date,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold'],
    default: 'Bronze'
  }
});
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
