const TikiServices = require("../services/tiki.services");
const statusCodes = require("../errors/statusCodes");

const createDiscountCodeCategory = async (req, res) => {
    const { error } = await TikiServices.createDiscountCodeCategory(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({});
};

const getDiscountCodeCategory = async () => {
    const { error, categories } = await TikiServices.getDiscountCodeCategory();
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ categories });
};

module.exports = { createDiscountCodeCategory, getDiscountCodeCategory };