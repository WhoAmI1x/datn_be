const { Schema, model, models } = require("mongoose");

const scheduleSchema = new Schema({
    ecommerce: { type: String, required: true },
    startTime: { type: Number },
    endTime: { type: Number },
    detectField: { type: String, required: true },
    detectValue: { type: String, required: true },
    isActive: { type: Boolean }
});

module.exports = models.Schedule || model('Schedule', scheduleSchema);
