const Product = require("../models/Product");
const Category = require("../models/Category");
const { getProductDetailFromEcommerce } = require("./tiki.services")

const getDetailProduct = async ({ query: { productId } }) => {
    try {
        let productFullInfo = await Product.findOne({ _id: productId });
        const category = await Category.findOne({ _id: productFullInfo.categoryId });

        if (!productFullInfo) {
            return { error: "Product not found!" };
        }

        if (category.ecommerce === "TIKI") {
            if (productFullInfo.productDetail.length <= 0) {
                productFullInfo = await getProductDetailFromEcommerce(productFullInfo);
            }
        } else {
            return { error: "Shopee is not complete!" };
        }

        return { productFullInfo };
    } catch (e) {
        return { error: e };
    }
};


module.exports = {
    getDetailProduct
};