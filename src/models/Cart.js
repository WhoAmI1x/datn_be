const { Schema, model, models } = require("mongoose");

const cartSchema = new Schema({
    ecommerce: { type: String },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = models.Cart || model('Cart', cartSchema);
