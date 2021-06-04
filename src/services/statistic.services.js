const DiscountCode = require("../models/DiscountCode");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");

const getStatistic = async () => {
    try {
        const discountCodes = await DiscountCode.find({ expires: { $gt: Date.now() }, categoryId: { $exists: true } }).exec();
        const products = await Product.find({ endTime: { $gt: Date.now() }, categoryId: { $exists: true } }).exec();
        const users = await User.countDocuments({ role: "USER" });
        const categories = await Category.find({}).exec();

        const tikiDiscountCodesByCategories = [];
        const shopeeDiscountCodesByCategories = [];
        const tikiProductsByCategories = [];
        const shopeeProductsByCategories = [];

        categories.forEach(({ _id, name, ecommerce, type }) => {
            if (ecommerce === "TIKI" && type === "DISCOUNT_CODE") {
                tikiDiscountCodesByCategories.push({
                    categoryName: name,
                    discountCodeQuantity: discountCodes.filter(dc => dc.categoryId.toString() === _id.toString()).length
                });
            }
            else if (ecommerce === "SHOPEE" && type === "DISCOUNT_CODE") {
                shopeeDiscountCodesByCategories.push({
                    categoryName: name,
                    discountCodeQuantity: discountCodes.filter(dc => dc.categoryId.toString() === _id.toString()).length
                });
            }
            else if (ecommerce === "TIKI" && type === "PRODUCT") {
                tikiProductsByCategories.push({
                    categoryName: name,
                    productQuantity: products.filter(p => p.categoryId.toString() === _id.toString()).length
                });
            }
            else if (ecommerce === "SHOPEE" && type === "PRODUCT") {
                shopeeProductsByCategories.push({
                    categoryName: name,
                    productQuantity: products.filter(p => p.categoryId.toString() === _id.toString()).length
                });
            }
        });

        return {
            statistic: {
                statisticTotals: [
                    {
                        label: "Mã giảm giá",
                        quantity: discountCodes.filter(dc => dc.categoryId).length
                    },
                    {
                        label: "Sản phẩm",
                        quantity: products.length
                    },
                    {
                        label: "Người dùng",
                        quantity: users
                    }
                ],
                discountCodes: [
                    { ecommerce: "TIKI", discountCodesByCategories: tikiDiscountCodesByCategories },
                    { ecommerce: "SHOPEE", discountCodesByCategories: shopeeDiscountCodesByCategories }
                ],
                products: [
                    { ecommerce: "TIKI", productsByCategories: tikiProductsByCategories },
                    { ecommerce: "SHOPEE", productsByCategories: shopeeProductsByCategories }
                ]
            }
        };
    } catch (e) {
        return { error: e };
    }
};

module.exports = { getStatistic };