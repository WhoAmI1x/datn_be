const StatisticServices = require("../services/statistic.services");
const statusCodes = require("../errors/statusCodes");

const getStatistic = async (req, res) => {
    const { error, statistic } = await StatisticServices.getStatistic();
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ statistic });
};

module.exports = {
    getStatistic,
};