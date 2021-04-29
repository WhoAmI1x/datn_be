const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");
const Schedule = require("../models/Schedule");
const Product = require("../models/Product");
const { getDiscountCodeApiUrlFromBrowser } = require("../utils/getApiUrlFromBrowser");
const {
    getDiscountCodeWithDetectFieldId,
    getDiscountCodePlatformShippingOrTopCoupons,
    getDiscountCodeByCategory,
    getTodaySaleProductSchedules,
    getProductsByCategoryAndTime,
    getProductsDetail
} = require("../apis/tiki");

const getDiscountCodesByCategoryFromEcommerce = async ({ query: { categoryId } }) => {
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Category not found!" };
        }

        let discountCodes = null;

        // Mã chớp nhoáng | Giành cho khách hàng mới | Ưu đãi từ đối tác
        if (category.detectField === "id") {
            const url = await getDiscountCodeApiUrlFromBrowser({ key: category.detectField, value: category.detectValue });
            if (!url) {
                return { error: `Url get discount codes of ${category.name} not found!` };
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

            await DiscountCode.remove({ categoryId });
            await DiscountCode.insertMany(discountCodesToSaveToDb);

            return { discountCodes: discountCodesToSaveToDb };
        } else {
            return { discountCodes: [], message: `Discount codes for this category '${category.name}' is empty!` }
        }
    } catch (e) {
        return { error: e };
    }
};

const getTodaySaleProductSchedulesFromEcommerce = async () => {
    try {
        await Schedule.remove({ ecommerce: "TIKI" });
        const schedules = await getTodaySaleProductSchedules();

        if (!schedules) {
            return { error: "Can not get schedules!" };
        }

        const schedulesSaveToDb = schedules.values && schedules.values.map(s => ({
            ecommerce: "TIKI",
            startTime: (new Date(s.from_date)).getTime(),
            endTime: (new Date(s.to_date)).getTime(),
            detectField: schedules.query_name,
            detectValue: s.query_value,
            isActive: s.active
        }));

        await Schedule.insertMany(schedulesSaveToDb);

        return { schedules: schedulesSaveToDb };
    } catch (e) {
        return { error: e };
    }
};

const getProductsByCategoryFromEcommerce = async ({ query: { categoryId } }) => {
    try {
        // await Product.remove({});
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Category not found!" };
        }

        let activeSchedule = await Schedule.findOne({ ecommerce: "TIKI", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });
        let products = [];

        if (!activeSchedule) {
            await getTodaySaleProductSchedulesFromEcommerce();
            activeSchedule = await Schedule.findOne({ ecommerce: "TIKI", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });

            if (!activeSchedule) {
                return { products, message: "Products is empty!" };
            }
        }

        products = await getProductsByCategoryAndTime({ tag_id: category.detectValue, time_id: activeSchedule.detectValue });

        if (products.length > 0) {
            const productsFullInfoToSaveDb = products.map(pFInfo => ({
                mainId: pFInfo.product.id,
                imageUrls: pFInfo.product.thumbnail_url,
                name: pFInfo.product.name,
                price: pFInfo.product.price,
                priceBeforeDiscount: pFInfo.product.list_price,
                rateAverage: pFInfo.product.rating_average,
                productUrl: `https://tiki.vn/${pFInfo.product.url_path}`,
                startTime: pFInfo.special_from_date * 1000,
                endTime: pFInfo.special_to_date * 1000,
                tikiMasterId: pFInfo.product.master_id,
                quantitySold: pFInfo.progress.qty_ordered,
                quantity: pFInfo.progress.qty,
                quantityRemain: pFInfo.progress.qty_remain,
                categoryId: category._id,
                discountPercent: pFInfo.discount_percent,
            }));

            await Product.insertMany(productsFullInfoToSaveDb);

            return { products: productsFullInfoToSaveDb };
        } else {
            return { products: [], message: `Products are empty!` };
        }

    } catch (e) {
        return { error: e };
    }
};

const getProductDetailFromEcommerce = async ({ _id, tikiMasterId, mainId }) => {
    try {
        const productFullInfoFromEcommerce = await getProductsDetail({ tikiMasterId, mainId });
        const productFullInfo = await Product.findOneAndUpdate(
            { _id },
            {
                $set: {
                    productDetail: productFullInfoFromEcommerce.productDetail,
                    productDescription: productFullInfoFromEcommerce.productDescription
                }
            },
            { new: true });

        return productFullInfo;
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getTodaySaleProductSchedulesFromEcommerce,
    getProductsByCategoryFromEcommerce,
    getProductDetailFromEcommerce
};