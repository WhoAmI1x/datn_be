const Product = require("../models/Product");
const Category = require("../models/Category");
const TikiServices = require("./tiki.services");
const ShopeeServices = require("./shopee.services");
const CustomError = require("../errors/CustomError");
const User = require("../models/User");
const { getUserInfo } = require("../apis/shopee");

const getDetailProduct = async ({ query: { productId } }) => {
    try {
        let productFullInfo = await Product.findOne({ _id: productId });
        const category = await Category.findOne({ _id: productFullInfo.categoryId });

        if (!productFullInfo) {
            return { error: "Không tìm thấy sản phẩm!" };
        }

        if (category.ecommerce === "TIKI") {
            if (productFullInfo.productDetail.length <= 0) {
                productFullInfo = await TikiServices.getProductDetailFromEcommerce(productFullInfo);
            }
        } else {
            if (productFullInfo.shopeeModels.length <= 0) {
                productFullInfo = await ShopeeServices.getProductDetailFromEcommerce(productFullInfo);
            }
        }

        return { productFullInfo };
    } catch (e) {
        return { error: e };
    }
};

const getProductsByCategory = async ({ query: { categoryId } }) => {
    try {
        // const products = await Product.find({ categoryId, endTime: { $gt: Date.now() } });
        const products = await Product.find({ categoryId });

        return { products };
    } catch (e) {
        return { error: e };
    }
};

const deleteProduct = async ({ query: { productId } }) => {
    try {
        const productDeleted = await Product.findOneAndDelete({ _id: productId });

        if (productDeleted) {
            const products = await Product.find({ categoryId: productDeleted.categoryId });
            return { products };
        }

        return { error: "Delete product failed!" };
    } catch (e) {
        return { error: e };
    }
};

const searchProduct = async ({ query: { keyword } }) => {
    try {
        const shopeeProducts = await ShopeeServices.searchProductByKeywordFromEcommerce(keyword);
        const tikiProducts = await TikiServices.searchProductByKeywordFromEcommerce(keyword);

        return { products: [...shopeeProducts, ...tikiProducts] }
    } catch (e) {
        return { error: e };
    }
};

const getDetailProductSearched = async ({ query: { productId } }) => {
    try {
        let productFullInfo = await Product.findOne({ _id: productId });

        if (!productFullInfo) {
            return { error: "Không tìm thấy sản phẩm!" };
        }

        if (productFullInfo.ecommerce === "TIKI") {
            if (productFullInfo.productDetail.length <= 0) {
                productFullInfo = await TikiServices.getProductDetailSearchedFromEcommerce(productFullInfo);
            }
        } else {
            if (productFullInfo.shopeeModels.length <= 0) {
                productFullInfo = await ShopeeServices.getProductDetailFromEcommerce(productFullInfo);
            }
        }

        return { productFullInfo };
    } catch (e) {
        return { error: e };
    }
};

const addProductToCart = async ({ user, productId, modelId }) => {
    try {
        const product = await Product.findOne({ _id: productId }).populate("categoryId");

        if (product.ecommerce === "TIKI" || product.categoryId.ecommerce === "TIKI") {
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

            const result = await TikiServices.saveProductToAccountEcommerce({
                productId: product.mainId,
                xAccessToken: userLoggedIn.tikiAccount.auth.token
            });

            if (result.error) {
                throw error;
            }

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
            // else if (user.shopeeAccount.auth && user.shopeeAccount.auth.cookie) {
            //     const isCookieExpired = await getUserInfo({ cookie: user.shopeeAccount.auth.cookie });

            //     if (isCookieExpired) {
            //         const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

            //         if (error) {
            //             throw error;
            //         }
            //     }
            // }

            const userLoggedIn = await User.findOne({ _id: user._id });

            const result = await ShopeeServices.saveProductToAccountEcommerce({
                itemid: product.mainId,
                modelid: modelId,
                shopid: product.shopeeShopId,
                cookie: userLoggedIn.shopeeAccount.auth.cookie
            });

            if (result.error) {
                throw error;
            }

            await user.save();

            return { message: result.message };
        }
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getDetailProduct,
    getProductsByCategory,
    deleteProduct,
    searchProduct,
    getDetailProductSearched,
    addProductToCart
};