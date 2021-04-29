const DiscountCodeServices = require("../services/discountCode.services");
const statusCodes = require("../errors/statusCodes");

const getDiscountCodesByCategory = async (req, res) => {
    const { error, discountCodes } = await DiscountCodeServices.getDiscountCodesByCategory(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ discountCodes });
};

const deleteDiscountCodeById = async (req, res) => {
    const { error, discountCodes } = await DiscountCodeServices.deleteDiscountCodeById(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ discountCodes });
};



module.exports = {
    getDiscountCodesByCategory,
    deleteDiscountCodeById
};