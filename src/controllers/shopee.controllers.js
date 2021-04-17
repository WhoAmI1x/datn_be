const ShopeeServices = require("../services/shopee.services");
const statusCodes = require("../errors/statusCodes");

const getDiscountCodesByCategoryFromEcommerce = async (req, res) => {
    const { error, discountCodes } = await ShopeeServices.getDiscountCodesByCategoryFromEcommerce(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ discountCodes });
};

const getFlashSaleProductSchedulesFromEcommerce = async (req, res) => {
    const { error, schedules } = await ShopeeServices.getTodaySaleProductSchedulesFromEcommerce();
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ schedules });
};

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getFlashSaleProductSchedulesFromEcommerce
};
