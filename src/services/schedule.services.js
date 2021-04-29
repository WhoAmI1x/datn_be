const Schedule = require("../models/Schedule");

const getSchedules = async () => {
    try {
        const schedules = await Schedule.find({});

        return { schedules };
    } catch (e) {
        return { error: e };
    }
};


module.exports = {
    getSchedules
};