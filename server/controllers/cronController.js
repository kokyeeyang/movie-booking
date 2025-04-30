const { StatusCodes } = require("http-status-codes");
const MembershipPoints = require("../models/MembershipPoints");

const expireAllExpiredPoints = async(req, res) => {
    console.log("Cron job triggered: Expiring points");
    const CRON_SECRET = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;

    if(!authHeader || authHeader !== `Bearer ${CRON_SECRET}`){
        return res.status(401).json({message:"Unauthorized"});
    }

    const now = new Date();

    const result = await MembershipPoints.updateMany(
        {userId: req.user.userId, expiresAt: {$lt: now}},
        {$set: {points: 0}}
    );

    res.status(StatusCodes.OK).json({message: `${result.modifiedCount} points are expired`});

}

module.exports = { expireAllExpiredPoints };