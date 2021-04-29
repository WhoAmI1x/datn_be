const ScheduleServices = require("../services/schedule.services");
const statusCodes = require("../errors/statusCodes");

const getSchedules = async (req, res) => {
    const { error, schedules } = await ScheduleServices.getSchedules();
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ schedules });
};

module.exports = {
    getSchedules
};