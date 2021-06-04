const { Schema, model, models } = require("mongoose");

const personalDiscountCodeSchema = new Schema({
    title: { type: String },
    imageUrls: [String],
    expires: { type: Number },
    description: { type: String },
    isUsed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = models.PersonalDiscountCode || model('PersonalDiscountCode', personalDiscountCodeSchema);
