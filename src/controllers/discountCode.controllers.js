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

const saveDiscountCode = async (req, res) => {
    const { error, message } = await DiscountCodeServices.saveDiscountCode({ ...req.query, user: req.user });
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ message });
};

module.exports = {
    getDiscountCodesByCategory,
    deleteDiscountCodeById,
    saveDiscountCode
};