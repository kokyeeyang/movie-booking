const MembershipPoints = require("../models/MembershipPoints");
const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const updateMembershipPoints = async (req, res) => {
    let {userId, amountInCents} = req.body;

    /* possible for amountInCents to be empty, as this function also handles the case 
    of expiring points or usage of points */

    if(amountInCents){
        const points = amountInCents;
        const earnedAt = new Date();
        const expiresAt = new Date(earnedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

        await MembershipPoints.create({
            userId: userId, 
            points,
            earnedAt,
            expiresAt
        });
    }

    const now = new Date();
    await MembershipPoints.updateMany(
        {userId: req.user.userId, expiresAt: {$lt: now}},
        {$set: {points: 0}}
    );

    const validPoints = await MembershipPoints.aggregate([
        {$match: {userId: mongoose.Types.ObjectId(req.user.userId), expiresAt: {$gt: now}}},
        {$group: {
            _id: null,
            total: {$sum: "$points"}
        }}
    ])

    const totalPoints = validPoints[0]?.total || 0;
    const tier = totalPoints >= 1000000 ? "Gold" : totalPoints >= 50001 ? "Silver" : "Bronze";

    // tier needs to be in {} to satisfy mongodb's expected format
    let updateUser = await User.findByIdAndUpdate(
        userId,
        {tier}
    );

    console.log(updateUser);
    res.status(200).json({totalPoints, tier})

}

const getUserPoints = async (req, res) => {
    try {
        const {userId} = req.params;
        const now = new Date();

        const result = await MembershipPoints.aggregate([
            {$match: {
                userId: mongoose.Types.ObjectId(userId),
                expiresAt: {$gt: now}
            }},
            {
                $group: {
                    _id: null,
                    totalPoints: {$sum: "$points"}
                }
            }
        ]);

        const totalPoints = result[0]?.totalPoints || 0;

        res.status(200).json({userId, totalPoints});
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message})
    }
}

module.exports = { updateMembershipPoints, getUserPoints };