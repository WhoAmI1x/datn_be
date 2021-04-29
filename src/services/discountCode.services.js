const DiscountCode = require("../models/DiscountCode");

const getDiscountCodesByCategory = async ({ query: { categoryId } }) => {
    try {
        const discountCodes = await DiscountCode.find({ categoryId, expires: { $gt: Date.now() } });

        return { discountCodes };
    } catch (e) {
        return { error: e };
    }
};

const deleteDiscountCodeById = async ({ query: { discountCodeId } }) => {
    try {
        const discountCodeDeleted = await DiscountCode.findOneAndDelete({ _id: discountCodeId });

        if (discountCodeDeleted) {
            const discountCodes = await DiscountCode.find({ categoryId: discountCodeDeleted.categoryId });
            return { discountCodes };
        }

        return { error: "Delete discount code failed!" };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getDiscountCodesByCategory,
    deleteDiscountCodeById
};