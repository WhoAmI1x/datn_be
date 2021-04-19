const { Schema, model, models } = require("mongoose");

const productBriefSchema = new Schema({
    scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule" },
    saleCategoryId: { type: Number },
    mainId: { type: Number }
});

module.exports = models.ProductBrief || model('ProductBrief', productBriefSchema);
