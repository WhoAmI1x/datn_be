const CategoryServices = require("../services/category.services");
const statusCodes = require("../errors/statusCodes");

const createDiscountCodeCategory = async (req, res) => {
    const { error, category } = await CategoryServices.createDiscountCodeCategory(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ category });
};

const getDiscountCodeCategories = async (req, res) => {
    const { error, categories } = await CategoryServices.getDiscountCodeCategories(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ categories });
};

const getDiscountCodesByCategory = async (req, res) => {
    const { error, discountCodes } = await CategoryServices.getDiscountCodesByCategory(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ discountCodes });
};

module.exports = {
    createDiscountCodeCategory,
    getDiscountCodeCategories,
    getDiscountCodesByCategory
};