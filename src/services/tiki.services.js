const Category = require("../models/Category");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");

const createDiscountCodeCategory = async ({ file, body: { } }) => {
    try {
        const imageUrl = file.destination.replace("./src/assets", "") + `/${file.filename}`;

        console.log(imageUrl);

        const apiToGet = null;

        return { error: "xxxx" }
    } catch (e) {
        return { error: e };
    }
};

const getDiscountCodeCategory = async () => {
    try {
        // const apiToGet
        return { error: "Success" }
    } catch (e) {
        return { error: e };
    }
};

module.exports = { createDiscountCodeCategory, getDiscountCodeCategory };