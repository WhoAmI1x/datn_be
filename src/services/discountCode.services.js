const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");
const DiscountCode = require("../models/DiscountCode");
const Product = require("../models/Product");
const User = require("../models/User");
const {
    saveDiscountCodeToAccountEcommerce,
    logInAccountEcommerce,
    saveProductToAccountEcommerce
} = require("./tiki.services");

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

        return { error: "Xóa mã thất bại!" };
    } catch (e) {
        return { error: e };
    }
};

const saveDiscountCode = async ({ user, discountCodeId }) => {
    try {
        const discountCode = await DiscountCode.findOne({ _id: discountCodeId });

        if (discountCode.ecommerce === "TIKI") {
            if (!user.tikiAccount.username && !user.tikiAccount.password) {
                throw new CustomError("Bạn chưa nhập tài khoản tiki!", statusCodes.BAD_REQUEST);
            }

            if (!user.tikiAccount.auth ||
                user.tikiAccount.auth && !user.tikiAccount.auth.token ||
                user.tikiAccount.auth && user.tikiAccount.auth.token && user.tikiAccount.auth.expires_at <= Date.now()) {
                const { error, message } = await logInAccountEcommerce(user);

                if (error) {
                    throw error;
                }
            }

            const userLoggedIn = await User.findOne({ _id: user._id });

            const result = await saveDiscountCodeToAccountEcommerce({
                tikiRuleId: discountCode.tikiRuleId,
                code: discountCode.code,
                xAccessToken: userLoggedIn.tikiAccount.auth.token
            });

            if (result.error) {
                throw error;
            }

            user.discountCodeIds.push(discountCode._id);
            await user.save();

            return { message: result.message };
        } else {

        }
    } catch (e) {
        return { error: e };
    }
};

const addProductToCart = async ({ user, productId }) => {
    try {
        const product = await Product.findOne({ _id: productId });

        if (product.ecommerce === "TIKI") {
            if (!user.tikiAccount.username && !user.tikiAccount.password) {
                throw new CustomError("Bạn chưa nhập tài khoản tiki!", statusCodes.BAD_REQUEST);
            }

            if (!user.tikiAccount.auth ||
                user.tikiAccount.auth && !user.tikiAccount.auth.token ||
                user.tikiAccount.auth && user.tikiAccount.auth.token && user.tikiAccount.auth.expires_at <= Date.now()) {
                const { error, message } = await logInAccountEcommerce(user);

                if (error) {
                    throw error;
                }
            }

            const userLoggedIn = await User.findOne({ _id: user._id });

            const result = await saveProductToAccountEcommerce({
                productId: product.mainId,
                xAccessToken: userLoggedIn.tikiAccount.auth.token
            });

            if (result.error) {
                throw error;
            }

            return { message: result.message };
        } else {

        }
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getDiscountCodesByCategory,
    deleteDiscountCodeById,
    saveDiscountCode,
    addProductToCart
};