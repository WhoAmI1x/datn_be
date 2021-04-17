const CategoryServices = require("../services/category.services");
const statusCodes = require("../errors/statusCodes");

const createCategory = async (req, res) => {
    const { error, category } = await CategoryServices.createCategory(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ category });
};

const getCategories = async (req, res) => {
    const { error, categories } = await CategoryServices.getCategories(req);
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
    createCategory,
    getCategories,
    getDiscountCodesByCategory
};