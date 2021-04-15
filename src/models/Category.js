const { Schema, model, models } = require("mongoose");

const categorySchema = new Schema({
    ecommerce: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    imageUrl: {
        type: String
    },
    mainId: {
        type: String
    },
    detectField: {
        type: String,
        required: true
    },
    detectValue: {
        type: String,
        required: true
    }
});

module.exports = models.Category || model('Category', categorySchema);
