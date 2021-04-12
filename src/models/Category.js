const { Schema, model, models } = require("mongoose");

const categorySchema = new Schema({
    ecommerce: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String },
    imageUrl: { type: String },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    discountCodeIds: [{ type: Schema.Types.ObjectId, ref: 'DiscountCode' }],
});

module.exports = models.Category || model('Category', categorySchema);
