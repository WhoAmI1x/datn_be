const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");
const { getDiscountCodeApiUrlFromBrowser } = require("../utils/getApiUrlFromBrowser");
const {
    getDiscountCodeWithDetectFieldId,
    getDiscountCodePlatformShippingOrTopCoupons,
    getDiscountCodeByCategory
} = require("../apis/tiki");

const getDiscountCodesByCategoryFromEcommerce = async ({ query: { categoryId } }) => {
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Category not found!" };
        }

        let discountCodes = null;

        // Mã chớp nhoáng | Giành cho khách hàng mới
        if (category.detectField === "id") {
            const url = await getDiscountCodeApiUrlFromBrowser({ key: category.detectField, value: category.detectValue });
            if (!url) {
                return { error: `Discount codes of ${category.name} not found!` };
            }

            discountCodes = await getDiscountCodeWithDetectFieldId(url);
        }
        else if (category.detectField === "categories") {
            discountCodes = await getDiscountCodeByCategory({ key: category.detectField, value: category.detectValue });
        }
        // Miễn phí ship | Từ nhà bán
        else {
            discountCodes = await getDiscountCodePlatformShippingOrTopCoupons(category.detectValue);
        }

        if (discountCodes) {
            const discountCodesToSaveToDb = discountCodes.map(dc => new DiscountCode({
                ecommerce: "TIKI",
                expires: dc.expired_at * 1000,
                code: dc.coupon_code,
                mainId: dc.coupon_id,
                tikiRuleId: dc.rule_id,
                imageUrl: dc.icon_url,
                title: dc.short_title,
                description: dc.long_description,
                shopId: dc.seller_id,
                categoryId: category._id,
            }));

            await DiscountCode.insertMany(discountCodesToSaveToDb);

            return { discountCodes };
        } else {
            return { error: `Discount codes for this category '${category.name}' is empty!` }
        }
    } catch (e) {
        return { error: e };
    }
};


module.exports = {
    getDiscountCodesByCategoryFromEcommerce
};