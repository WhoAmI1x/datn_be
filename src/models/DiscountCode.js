const { Schema, model, models } = require("mongoose");

const discountCodeSchema = new Schema({
    ecommerce: {
        type: String
    },
    expires: Number,
    code: {
        type: String
    },
    mainId: Number,
    tikiRuleId: Number,
    shopeeSignature: {
        type: String
    },
    imageUrl: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    shopId: {
        type: Number
    },
    userIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    markTime: { type: Number }
});

module.exports = models.DiscountCode || model('DiscountCode', discountCodeSchema);
