const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { mongoose }  = require("mongoose");
const jwt = require("jsonwebtoken");

const getCurrentUser = async(req, res) => {
    try {
        // const user = await User.findById()
        const accessToken = req.cookies.accessToken;
        const loggedInUser = jwt.verify(accessToken, process.env.JWT_SECRET);

        console.log(loggedInUser);
    } catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getCurrentUser
};