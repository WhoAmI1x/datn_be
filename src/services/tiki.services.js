const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");
const Schedule = require("../models/Schedule");
const Product = require("../models/Product");
const { getDiscountCodeApiUrlFromBrowser } = require("../utils/getApiUrlFromBrowser");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");
const CryptoJS = require("crypto-js");
const {
    getDiscountCodeWithDetectFieldId,
    getDiscountCodePlatformShippingOrTopCoupons,
    getDiscountCodeByCategory,
    getTodaySaleProductSchedules,
    getProductsByCategoryAndTime,
    getProductsDetail,
    searchProductByKeyword,
    getProductsDetailSearched,
    logInToGetAuthInfo,
    saveCoupon,
    saveProduct
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
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Không tìm thấy danh mục!" };
        }

        let activeSchedule = await Schedule.findOne({ ecommerce: "TIKI", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });
        let products = [];

        if (!activeSchedule) {
            await getTodaySaleProductSchedulesFromEcommerce();
            activeSchedule = await Schedule.findOne({ ecommerce: "TIKI", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });

            if (!activeSchedule) {
                return { products, message: "Danh sách sản phẩm trống!" };
            }
        }

        products = await getProductsByCategoryAndTime({ tag_id: category.detectValue, time_id: activeSchedule.detectValue });

        if (products.length > 0) {
            const productsFullInfoToSaveDb = products.map(pFInfo => ({
                mainId: pFInfo.product.id,
                imageUrls: [pFInfo.product.thumbnail_url],
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

            await Product.remove({ categoryId });
            await Product.insertMany(productsFullInfoToSaveDb);
            products = await Product.find({ categoryId });

            return { products };
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
                    productDescription: productFullInfoFromEcommerce.productDescription,
                    imageUrls: productFullInfoFromEcommerce.images
                }
            },
            { new: true });

        return productFullInfo;
    } catch (e) {
        return { error: e };
    }
};

const searchProductByKeywordFromEcommerce = async (keyword) => {
    try {
        let products = await searchProductByKeyword(keyword);

        if (products.length > 0) {
            const markTime = Date.now();

            const productsMapped = products.map(pMapped => ({
                mainId: pMapped.id,
                imageUrls: [pMapped.thumbnail_url],
                name: pMapped.name,
                price: pMapped.price,
                priceBeforeDiscount: pMapped.list_price,
                rateAverage: pMapped.rating_average,
                productUrl: `https://tiki.vn/${pMapped.url_path}`,
                tikiMasterId: pMapped.id,
                quantity: pMapped.stock_item.qty,
                discountPercent: pMapped.discount_rate,
                ecommerce: "TIKI",
                markTime
            }));

            await Product.insertMany(productsMapped);
            products = await Product.find({ markTime });
            return products;
        } else {
            return { products: [], message: `Danh sách trống!` };
        }
    } catch (e) {
        return { error: e };
    }
}

const getProductDetailSearchedFromEcommerce = async ({ _id, tikiMasterId }) => {
    try {
        const productFullInfoFromEcommerce = await getProductsDetailSearched({ tikiMasterId });
        const productFullInfo = await Product.findOneAndUpdate(
            { _id },
            {
                $set: {
                    productDetail: productFullInfoFromEcommerce.productDetail,
                    productDescription: productFullInfoFromEcommerce.productDescription,
                    imageUrls: productFullInfoFromEcommerce.images,
                    rateAverage: productFullInfoFromEcommerce.rateAverage,
                    quantitySold: productFullInfoFromEcommerce.quantitySold,
                    mainId: productFullInfoFromEcommerce.mainId
                }
            },
            { new: true });

        return productFullInfo;
    } catch (e) {
        return { error: e };
    }
};

const logInAccountEcommerce = async (user) => {
    try {
        const { access_token, refresh_token, expires_at } = await logInToGetAuthInfo({
            username: user.tikiAccount.username,
            password: CryptoJS.AES.decrypt(user.tikiAccount.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8),
        });

        if (access_token && refresh_token && expires_at) {
            user.tikiAccount.auth = {
                token: access_token,
                refreshToken: refresh_token,
                expires_at: expires_at,
            }

            await user.save();

            return { message: "OK" };
        } else {
            throw new CustomError("Đăng nhập sàn tiki thất bại!", statusCodes.UNAUTHORIZED);
        }
    } catch (e) {
        return { error: e };
    }
};

const saveDiscountCodeToAccountEcommerce = async ({ tikiRuleId, code, xAccessToken }) => {
    try {
        const result = await saveCoupon({ tikiRuleId, code, xAccessToken });

        if (result.code === 0 && result.message === "OK") {
            return { message: result.message };
        }

        throw new CustomError("Lưu mã thất bại!", statusCodes.EXPECTATION_FAILED);
    } catch (e) {
        return { error: e };
    }
};

const saveProductToAccountEcommerce = async ({ productId, xAccessToken }) => {
    try {
        const result = await saveProduct({ productId, xAccessToken });

        if (result.error) {
            throw new CustomError("Thêm vào giỏ hàng thất bại!", statusCodes.EXPECTATION_FAILED);
        }

        return { message: "Thêm vào giỏ hàng thành công!" };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getTodaySaleProductSchedulesFromEcommerce,
    getProductsByCategoryFromEcommerce,
    getProductDetailFromEcommerce,
    searchProductByKeywordFromEcommerce,
    getProductDetailSearchedFromEcommerce,
    logInAccountEcommerce,
    saveDiscountCodeToAccountEcommerce,
    saveProductToAccountEcommerce
};