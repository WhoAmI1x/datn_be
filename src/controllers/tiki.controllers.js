const TikiServices = require("../services/tiki.services");
const statusCodes = require("../errors/statusCodes");

const getDiscountCodesByCategoryFromEcommerce = async (req, res) => {
    const { error, discountCodes, message } = await TikiServices.getDiscountCodesByCategoryFromEcommerce(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ discountCodes, message });
};

const getTodaySaleProductSchedulesFromEcommerce = async (req, res) => {
    const { error, schedules } = await TikiServices.getTodaySaleProductSchedulesFromEcommerce();
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ schedules });
};

const getProductsByCategoryFromEcommerce = async (req, res) => {
    const { error, products, message } = await TikiServices.getProductsByCategoryFromEcommerce(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ products, message });
};

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getTodaySaleProductSchedulesFromEcommerce,
    getProductsByCategoryFromEcommerce
};