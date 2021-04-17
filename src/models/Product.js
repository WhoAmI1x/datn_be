const { Schema, model, models } = require("mongoose");

const productSchema = new Schema({
    mainId: { type: String },
    imageUrls: [String],
    name: { type: String },
    price: { type: Number },
    priceBeforeDiscount: { type: Number },
    rateAverage: { type: Number },
    productUrl: { type: String },
    startTime: { type: Number },
    endTime: { type: Number },
    tikiMasterId: { type: Number },
    quantitySold: { type: Number },
    quantity: { type: Number },
    quantityRemain: { type: Number },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    discountPercent: { type: Number },
    productDetail: [Object],
    productDescription: { type: String },
    priceMax: { type: Number },
    priceMin: { type: Number },
    priceMaxBeforeDiscount: { type: Number },
    priceMinBeforeDiscount: { type: Number },
    shopeeShopId: { type: Number },
    shopeeModels: [Object]
});

module.exports = models.Product || model('Product', productSchema);
