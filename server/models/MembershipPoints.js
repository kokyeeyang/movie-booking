const mongoose = require('mongoose');

const MembershipPointsSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    points : {type: Number, default: 0, required: true},
    earnedAt: {type: Date, default: Date.now},
    expiresAt: {type: Date, required: true}
});

module.exports = mongoose.model('MembershipPoints', MembershipPointsSchema);