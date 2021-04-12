const { Schema, model, models } = require("mongoose");

const productSchema = new Schema({
    mainId: { type: String },
    imageUrls: [String],
    name: { type: String },
    price: Number,
    priceBeforeDiscount: Number,
    priceMax: Number,
    priceMin: Number,
    priceMaxBeforeDiscount: Number,
    priceMinBeforeDiscount: Number,
    colors: [Object],
    rateAverage: Number,
    quantitySold: Number,
    description: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = models.Product || model('Product', productSchema);
