const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");
const { getDiscountCodeByShopIdAndCategory } = require("../apis/shopee");
const { shopeeImageUrl } = require("../utils/constants");
const {
    getDiscountCodeShopeeTitle,
    getDiscountCodeShopeeDescription
} = require("../utils/shopee");

const getDiscountCodesByCategoryFromEcommerce = async ({ query: { categoryId } }) => {
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Category not found!" };
        }

        const discountCodes = await getDiscountCodeByShopIdAndCategory(category.mainId);

        if (discountCodes.length > 0) {
            const discountCodesToSaveToDb = discountCodes.map(dc => new DiscountCode({
                ecommerce: "SHOPEE",
                expires: dc.end_time * 1000,
                code: dc.voucher_code,
                mainId: dc.promotionid,
                shopeeSignature: dc.signature,
                imageUrl: `${shopeeImageUrl}/${dc.icon_hash}`,
                title: getDiscountCodeShopeeTitle(dc),
                description: getDiscountCodeShopeeDescription(dc),
                shopId: dc.shop_id,
                categoryId: category._id,
            }));

            await DiscountCode.insertMany(discountCodesToSaveToDb);

            return { discountCodes };
        }
        else {
            return { error: `Discount codes for this category '${category.name}' is empty!` }
        }

    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getDiscountCodesByCategoryFromEcommerce
};