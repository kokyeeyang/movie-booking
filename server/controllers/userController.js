const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { mongoose }  = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getCurrentUser = async(req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        const loggedInUser = jwt.verify(accessToken, process.env.JWT_SECRET);
        const userInfo = await User.findById(loggedInUser.user.userId);

        res.status(StatusCodes.OK).json({ userInfo });
    } catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;
        const accessToken = req.cookies.accessToken;
        const loggedInUser = jwt.verify(accessToken, process.env.JWT_SECRET);
        const userInfo = await User.findById(loggedInUser.user.userId);

        const isMatch = await bcrypt.compare(currentPassword, userInfo.password);

        if(!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Current password is incorrect" });
        }

        // the pre save hook in user model will take care of hashing the password
        userInfo.password = newPassword;

        await userInfo.save();

        res.status(StatusCodes.OK).json({ message: "Password changed successfully" });
    } catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}

const updateUserInfo = async (req, res) => {
    try {
      const accessToken = req.cookies.accessToken;
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  
      const allowedUpdates = ['email', 'firstname', 'lastname'];
      const updates = {};
  
      for (let key of allowedUpdates) {
        if (req.body[key]) updates[key] = req.body[key];
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        decoded.user.userId,
        updates,
        { new: true }
      );
  
      res.status(200).json({ message: 'User info updated', updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCurrentUser,
    changePassword,
    updateUserInfo,
};