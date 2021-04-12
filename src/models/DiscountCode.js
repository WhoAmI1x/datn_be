const { Schema, model, models } = require("mongoose");

const discountCodeSchema = new Schema({
    ecommerce: { type: String },
    expires: Number,
    code: { type: String },
    mainId: Number,
    tikiRuleId: Number,
    shopeeSignature: { type: String },
    imageUrl: { type: String },
    shortTitle: { type: String },
    description: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = models.DiscountCode || model('DiscountCode', discountCodeSchema);
