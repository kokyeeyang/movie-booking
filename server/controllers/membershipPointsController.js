const MembershipPoints = require("../models/MembershipPoints");
const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const updateMembershipPoints = async (req, res) => {
    let {userId, amountInCents, redemptionAmount} = req.body;

    /* possible for amountInCents to be empty, as this function also handles the case 
    of expiring points or usage of points */

    if(amountInCents && amountInCents > 0){
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

    if(redemptionAmount){
        // whatever points that the user wants to redeem
        let remainingToRedeem = redemptionAmount;

        const pointEntries = await MembershipPoints.find({
            userId: req.user.userId,
            expriesAt: {$gt: now},
            points: {$gt: 0}
        }).sort({earnedAt: 1});

        for(const entry of pointEntries){
            if(remainingToRedeem <= 0) break;

            // to ensure that we do not deduct more points than what is inside a particular entry
            const deduct = Math.min(entry.points, remainingToRedeem);
            entry.points -= deduct;
            remainingToRedeem -= deduct;

            await entry.save();
        }
    }

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
        const accessToken = req.cookies.accessToken;
        const user = jwt.verify(accessToken, process.env.JWT_SECRET);
        const userId = user.user.userId;
        const now = new Date();
        console.log(userId);

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