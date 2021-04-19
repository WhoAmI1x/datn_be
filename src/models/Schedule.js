const { Schema, model, models } = require("mongoose");

const scheduleSchema = new Schema({
    ecommerce: { type: String, required: true },
    startTime: { type: Number },
    endTime: { type: Number },
    detectField: { type: String },
    detectValue: { type: String },
    isActive: { type: Boolean }
});

module.exports = models.Schedule || model('Schedule', scheduleSchema);
