const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");
const DiscountCode = require("../models/DiscountCode");
const Product = require("../models/Product");
const User = require("../models/User");
const TikiServices = require("./tiki.services");
const ShopeeServices = require("./shopee.services");
const { getUserInfo } = require("../apis/shopee");

const getDiscountCodesByCategory = async ({ query: { categoryId } }) => {
    try {
        const discountCodes = await DiscountCode.find({ categoryId, expires: { $gt: Date.now() } });

        return { discountCodes };
    } catch (e) {
        throw e;
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
        throw e;
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
                const { error, message } = await TikiServices.logInAccountEcommerce(user);

                if (error) {
                    throw error;
                }
            }

            const userLoggedIn = await User.findOne({ _id: user._id });

            const result = await TikiServices.saveDiscountCodeToAccountEcommerce({
                tikiRuleId: discountCode.tikiRuleId,
                code: discountCode.code,
                xAccessToken: userLoggedIn.tikiAccount.auth.token
            });

            if (result.error) {
                throw result.error;
            }

            user.discountCodeIds.push(discountCode._id);
            await user.save();

            return { message: result.message };
        }
        else {
            if (!user.shopeeAccount.username && !user.shopeeAccount.password) {
                throw new CustomError("Bạn chưa nhập tài khoản shopee!", statusCodes.BAD_REQUEST);
            }

            if (!user.shopeeAccount.auth ||
                user.shopeeAccount.auth && !user.shopeeAccount.auth.cookie) {
                const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

                if (error) {
                    throw error;
                }
            }
            else if (user.shopeeAccount.auth && user.shopeeAccount.auth.cookie) {
                const isCookieExpired = await getUserInfo({ cookie: user.shopeeAccount.auth.cookie });

                if (isCookieExpired) {
                    const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

                    if (error) {
                        throw error;
                    }
                }
            }

            const userLoggedIn = await User.findOne({ _id: user._id });

            const result = await ShopeeServices.saveDiscountCodeToAccountEcommerce({
                voucherCode: discountCode.code,
                voucherPromotionid: discountCode.mainId,
                signature: discountCode.shopeeSignature,
                csrfToken: userLoggedIn.shopeeAccount.auth.csrfToken,
                cookie: userLoggedIn.shopeeAccount.auth.cookie
            });

            if (result.error) {
                throw result.error;
            }

            user.discountCodeIds.push(discountCode._id);
            await user.save();

            return { message: result.message };
        }
    } catch (e) {
        return { error: e };
    }
};

const getDiscountCodeSaved = async ({ user }) => {
    try {
        // Check login
        if (!user.tikiAccount.username && !user.tikiAccount.password) {
            throw new CustomError("Bạn chưa nhập tài khoản tiki!", statusCodes.BAD_REQUEST);
        }

        if (!user.shopeeAccount.username && !user.shopeeAccount.password) {
            throw new CustomError("Bạn chưa nhập tài khoản shopee!", statusCodes.BAD_REQUEST);
        }

        if (!user.tikiAccount.auth ||
            user.tikiAccount.auth && !user.tikiAccount.auth.token ||
            user.tikiAccount.auth && user.tikiAccount.auth.token && user.tikiAccount.auth.expires_at <= Date.now()) {
            const { error, message } = await TikiServices.logInAccountEcommerce(user);

            if (error) {
                throw error;
            }
        }

        if (!user.shopeeAccount.auth ||
            user.shopeeAccount.auth && !user.shopeeAccount.auth.cookie) {
            const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

            if (error) {
                throw error;
            }
        }
        else if (user.shopeeAccount.auth && user.shopeeAccount.auth.cookie) {
            const isCookieExpired = await getUserInfo({ cookie: user.shopeeAccount.auth.cookie });

            if (isCookieExpired) {
                const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

                if (error) {
                    throw error;
                }
            }
        }

        const userLoggedIn = await User.findOne({ _id: user._id });

        // Clear old discount codes
        if (user.discountCodeIds.length > 0) {
            user.discountCodeIds = [];
        }

        // Get new discount codes from ecommerce
        const tikiDiscountCodes = await TikiServices.getCouponSavedFromEcommerce({ xAccessToken: userLoggedIn.tikiAccount.auth.token });
        const shopeeDiscountCodes = await ShopeeServices.getVoucherSavedFromEcommerce({
            csrfToken: userLoggedIn.shopeeAccount.auth.csrfToken,
            cookie: userLoggedIn.shopeeAccount.auth.cookie
        });

        user.discountCodeIds = [...tikiDiscountCodes.map(({ _id }) => _id), ...shopeeDiscountCodes.map(({ _id }) => _id)];
        await user.save();

        return { discountCodesSaved: [...tikiDiscountCodes, ...shopeeDiscountCodes] };
    } catch (e) {
        throw e;
    }
};

module.exports = {
    getDiscountCodesByCategory,
    deleteDiscountCodeById,
    saveDiscountCode,
    getDiscountCodeSaved
};