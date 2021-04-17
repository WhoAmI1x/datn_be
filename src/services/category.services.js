const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");

const createCategory = async ({ file, body: { ecommerce, name, type, mainId, detectField, detectValue } }) => {
    try {
        const imageUrl = file.destination.replace("./src/assets", "") + `/${file.filename}`;

        const newCategory = new Category({ ecommerce, type, name, imageUrl, mainId, detectField, detectValue });

        await newCategory.save();

        return { category: newCategory };
    } catch (e) {
        return { error: e };
    }
};

const getCategories = async ({ query: { ecommerce, type } }) => {
    try {
        const categories = await Category.find({ ecommerce, type });

        if (categories.length <= 0) {
            return { categories: "Categories empty!" };
        }

        return { categories };
    } catch (e) {
        return { error: e };
    }
};

const getDiscountCodesByCategory = async ({ query: { categoryId } }) => {
    try {
        const discountCodes = await DiscountCode.find({ categoryId });

        return { discountCodes };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    createCategory,
    getCategories,
    getDiscountCodesByCategory
};