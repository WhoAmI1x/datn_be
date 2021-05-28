const DiscountCodeServices = require("../services/discountCode.services");
const statusCodes = require("../errors/statusCodes");

const getDiscountCodesByCategory = async (req, res) => {
    const { error, discountCodes } = await DiscountCodeServices.getDiscountCodesByCategory(req);
    if (error) {
        throw error;
    }
    res.status(statusCodes.OK).send({ discountCodes });
};

const deleteDiscountCodeById = async (req, res) => {
    const { error, discountCodes } = await DiscountCodeServices.deleteDiscountCodeById(req);
    if (error) {
        throw error;
    }
    res.status(statusCodes.OK).send({ discountCodes });
};

const saveDiscountCode = async (req, res) => {
    const { error, message } = await DiscountCodeServices.saveDiscountCode({ ...req.query, user: req.user });
    if (error) {
        throw error;
    }
    res.status(statusCodes.OK).send({ message });
};

const getDiscountCodeSaved = async (req, res) => {
    const { error, discountCodesSaved } = await DiscountCodeServices.getDiscountCodeSaved(req);
    if (error) {
        throw error;
    }
    res.status(statusCodes.OK).send({ discountCodesSaved });
};

module.exports = {
    getDiscountCodesByCategory,
    deleteDiscountCodeById,
    saveDiscountCode,
    getDiscountCodeSaved
};