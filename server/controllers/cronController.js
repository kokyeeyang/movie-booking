const { StatusCodes } = require("http-status-codes");
const MembershipPoints = require("../models/MembershipPoints");

const expireAllExpiredPoints = async(req, res) => {
    console.log("Cron job triggered: Expiring points");
    // need to trim! as there might be empty spaces 
    const CRON_API_SECRET = process.env.CRON_API_SECRET.trim();
    const authHeader = req.headers.authorization.trim();
    if(!authHeader || authHeader !== `Bearer ${CRON_API_SECRET}`){
        return res.status(401).json({message:"Unauthorized"});
    }   

    await MembershipPoints.updateMany(
        {"expiresAt": {$type: "string"}},
        [
            {$set: {expiresAt: {$toDate: "$expiresAt"}}}
        ]
    )
    const now = new Date();
    const result = await MembershipPoints.updateMany(
        {expiresAt: {$lt: now}},
        {$set: {points: 0}}
    );

    const expired = await MembershipPoints.find({ expiresAt: { $lt: now } });
    console.log("Expired documents:", expired);

    res.status(StatusCodes.OK).json({message: `${result.modifiedCount} records are turned to 0`});

}

module.exports = { expireAllExpiredPoints };