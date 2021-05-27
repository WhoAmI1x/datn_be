const CartServices = require("../services/cart.services");
const statusCodes = require("../errors/statusCodes");

const getCarts = async (req, res) => {
    const { error, carts } = await CartServices.getCarts(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ carts });
};

module.exports = {
    getCarts,
};