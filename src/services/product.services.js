const Product = require("../models/Product");
const Category = require("../models/Category");
const TikiServices = require("./tiki.services");
const ShopeeServices = require("./shopee.services");

const getDetailProduct = async ({ query: { productId } }) => {
    try {
        let productFullInfo = await Product.findOne({ _id: productId });
        const category = await Category.findOne({ _id: productFullInfo.categoryId });

        if (!productFullInfo) {
            return { error: "Product not found!" };
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
        const products = await Product.find({ categoryId, endTime: { $gt: Date.now() } });

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

module.exports = {
    getDetailProduct,
    getProductsByCategory,
    deleteProduct
};