const ProductServices = require("../services/product.services");
const statusCodes = require("../errors/statusCodes");

const getDetailProduct = async (req, res) => {
    const { error, productFullInfo } = await ProductServices.getDetailProduct(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ productFullInfo });
};

const getProductsByCategory = async (req, res) => {
    const { error, products } = await ProductServices.getProductsByCategory(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ products });
};

module.exports = {
    getDetailProduct,
    getProductsByCategory
};