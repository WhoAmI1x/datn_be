const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");

const createCategory = async ({ file, body: { ecommerce, name, type, mainId, detectField, detectValue } }) => {
    try {
        const imageUrl = file.destination.replace("./src/assets", "") + `/${file.filename}`;

        const newCategory = new Category({ ecommerce, type, name, imageUrl, mainId, detectField, detectValue });

        await newCategory.save();
        const categories = await Category.find({});
        return { categories };
    } catch (e) {
        return { error: e };
    }
};

const getCategories = async ({ query: { ecommerce, type, keyword } }) => {
    try {
        let filter = {};

        if (ecommerce) {
            filter = Object.assign(filter, { ecommerce });
        }
        if (type) {
            filter = Object.assign(filter, { type });
        }
        if (keyword) {
            filter = Object.assign(filter, { name: { "$regex": keyword, "$options": "i" } })
        }

        const categories = await Category.find(filter);

        if (categories.length <= 0) {
            return { categories: [] };
        }

        return { categories };
    } catch (e) {
        return { error: e };
    }
};

const deleteCategory = async ({ query: { categoryId } }) => {
    try {
        const categoryDeleted = await Category.remove({ _id: categoryId });

        if (categoryDeleted.deletedCount === 1) {
            const categories = await Category.find({});
            return { categories };
        }

        return { error: "Delete category failed!" };
    } catch (e) {
        return { error: e };
    }
};

const updateCategory = async ({ file, body, query: { categoryId } }) => {
    try {
        if (file) {
            const imageUrl = file.destination.replace("./src/assets", "") + `/${file.filename}`;
            body = Object.assign(body, { imageUrl });
        }

        Object.keys(body).forEach(key => body[key] === 'undefined' && delete body[key]);

        const categoryUpdated = await Category.findOneAndUpdate({ _id: categoryId }, { $set: body }, { rawResult: true });

        if (categoryUpdated.ok === 1) {
            const categories = await Category.find({});
            return { categories };
        }

        return { error: "Update category failed!" };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    createCategory,
    getCategories,
    deleteCategory,
    updateCategory,
};