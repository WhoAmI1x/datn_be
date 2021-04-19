const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");
const Schedule = require("../models/Schedule");
const Product = require("../models/Product");
const { shopeeImageUrl } = require("../utils/constants");
const ProductBrief = require("../models/ProductBrief");
const {
    getDiscountCodeShopeeTitle,
    getDiscountCodeShopeeDescription,
    getProductUrl
} = require("../utils/shopee");
const {
    getDiscountCodeByShopIdAndCategory,
    getFlashSaleProductSchedules,
    getAllFlashSaleProductBrief,
    getAllFlashSaleProductByCategoryAndTime
} = require("../apis/shopee");

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

const getFlashSaleProductSchedulesFromEcommerce = async () => {
    try {
        await Schedule.remove({ ecommerce: "SHOPEE" });
        const schedules = await getFlashSaleProductSchedules();

        if (!schedules) {
            return { error: "Can not get schedules!" };
        }

        const schedulesSaveToDb = schedules.map(s => ({
            ecommerce: "SHOPEE",
            startTime: s.start_time * 1000,
            endTime: s.end_time * 1000,
            detectField: "promotionid",
            detectValue: s.promotionid,
            isActive: s.is_ongoing
        }));

        await Schedule.insertMany(schedulesSaveToDb);

        return { schedules: schedulesSaveToDb };
    } catch (e) {
        return { error: e };
    }
};

const getAllFlashSaleProductBriefFromEcommerce = async () => {
    try {
        let scheduleActive = await Schedule.findOne({ ecommerce: "SHOPEE", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });
        let allFlashSaleProductBrief = [];

        if (!scheduleActive) {
            await getFlashSaleProductSchedulesFromEcommerce();
            scheduleActive = await Schedule.findOne({ ecommerce: "SHOPEE", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });

            if (!activeSchedule) {
                return { allFlashSaleProductBrief, message: "Products is empty!" };
            }
        }

        allFlashSaleProductBrief = await getAllFlashSaleProductBrief({ [scheduleActive.detectField]: scheduleActive.detectValue });

        if (!allFlashSaleProductBrief) {
            return { error: "Can not get all sale product brief!" };
        }

        const allFlashSaleProductBriefToSaveDb = allFlashSaleProductBrief.map(pB => ({
            scheduleId: scheduleActive._id,
            saleCategoryId: pB.catid,
            mainId: pB.itemid
        }));

        await ProductBrief.insertMany(allFlashSaleProductBriefToSaveDb);

        return { allFlashSaleProductBrief: allFlashSaleProductBriefToSaveDb };
    } catch (e) {
        return { error: e };
    }
};

const getAllFlashSaleProductByCategoryFromEcommerce = async ({ query: { categoryId } }) => {
    try {
        // await Product.remove({});
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Category not found!" };
        }

        let activeSchedule = await Schedule.findOne({ ecommerce: "SHOPEE", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });
        let products = [];

        if (!activeSchedule) {
            await getFlashSaleProductSchedulesFromEcommerce();
            activeSchedule = await Schedule.findOne({ ecommerce: "SHOPEE", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });

            if (!activeSchedule) {
                return { products, message: "Products is empty!" };
            }
        }

        const allBriefProductByCategoryAndSchedule = await ProductBrief.find({ saleCategoryId: category.mainId });

        // products = await getAllFlashSaleProductByCategoryAndTime({
        //     categoryid: category.mainId,
        //     promotionid: activeSchedule.detectValue,
        //     limit: allBriefProductByCategoryAndSchedule.length,
        //     itemids: allBriefProductByCategoryAndSchedule.map(({ mainId }) => mainId)
        // });
        products = await getAllFlashSaleProductByCategoryAndTime({
            categoryid: 12,
            promotionid: 2012688153,
            limit: 12,
            itemids: [
                4465694174,
                1868031942,
                5472772047,
                6555726679,
                1189528148,
                3656293234,
                3567058934,
                9622758077,
                5154102119,
                6957493232,
                6083761196,
                8430765940
            ]
        });

        if (products.length > 0) {
            const productsFullInfoToSaveDb = products.map(pFInfo => ({
                mainId: pFInfo.itemid,
                imageUrls: pFInfo.image,
                name: pFInfo.promo_name,
                price: pFInfo.price / 100000,
                priceBeforeDiscount: pFInfo.price_before_discount / 100000,
                productUrl: `https://shopee.vn/${getProductUrl(pFInfo.name, pFInfo.shopid, pFInfo.itemid)}`,
                startTime: pFInfo.start_time * 1000,
                endTime: pFInfo.end_time * 1000,
                quantitySold: pFInfo.flash_sale_stock - pFInfo.stock,
                quantity: pFInfo.flash_sale_stock,
                quantityRemain: pFInfo.stock,
                categoryId: category._id,
                discountPercent: pFInfo.raw_discount,
                shopeeShopId: pFInfo.shopid,
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

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getFlashSaleProductSchedulesFromEcommerce,
    getAllFlashSaleProductBriefFromEcommerce,
    getAllFlashSaleProductByCategoryFromEcommerce
};