const PersonalDiscountCodeServices = require("../services/personalDiscountCode.services");
const statusCodes = require("../errors/statusCodes");

const createPersonalDiscountCode = async (req, res) => {
    const { error, personalDiscountCodes } = await PersonalDiscountCodeServices.createPersonalDiscountCode(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ personalDiscountCodes });
};

const getPersonalDiscountCodes = async (req, res) => {
    const { error, personalDiscountCodes } = await PersonalDiscountCodeServices.getPersonalDiscountCodes(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ personalDiscountCodes });
};

const deletePersonalDiscountCode = async (req, res) => {
    const { error, personalDiscountCodes } = await PersonalDiscountCodeServices.deletePersonalDiscountCode(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ personalDiscountCodes });
};

const updatePersonalDiscountCode = async (req, res) => {
    const { error, personalDiscountCodes } = await PersonalDiscountCodeServices.updatePersonalDiscountCode(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ personalDiscountCodes });
};

module.exports = {
    createPersonalDiscountCode,
    getPersonalDiscountCodes,
    deletePersonalDiscountCode,
    updatePersonalDiscountCode,
};