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
    const { error, schedules } = await ShopeeServices.getFlashSaleProductSchedulesFromEcommerce();
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ schedules });
};

const getProductsByCategoryFromEcommerce = async (req, res) => {
    const { error, products, message } = await ShopeeServices.getProductsByCategoryFromEcommerce(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ products, message });
};

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getFlashSaleProductSchedulesFromEcommerce,
    getProductsByCategoryFromEcommerce
};
