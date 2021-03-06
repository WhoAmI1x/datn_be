const Category = require("../models/Category");
const DiscountCode = require("../models/DiscountCode");
const Schedule = require("../models/Schedule");
const Product = require("../models/Product");
const { shopeeImageUrl } = require("../utils/constants");
const ProductBrief = require("../models/ProductBrief");
const CryptoJS = require("crypto-js");
const {
    getDiscountCodeShopeeTitle,
    getDiscountCodeShopeeDescription,
    getProductUrl
} = require("../utils/shopee");
const {
    getDiscountCodeByShopIdAndCategory,
    getFlashSaleProductSchedules,
    getAllFlashSaleProductBrief,
    getAllFlashSaleProductByCategoryAndTime,
    getProductsDetail,
    searchProductByKeyword,
    logInToGetAuthInfo,
    saveVoucher,
    saveProduct,
    getProductsFromCart,
    getVoucherSaved
} = require("../apis/shopee");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");

const getDiscountCodesByCategoryFromEcommerce = async ({ query: { categoryId } }) => {
    try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
            return { error: "Danh mục không tồn tại!" };
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

            await DiscountCode.remove({ categoryId });
            await DiscountCode.insertMany(discountCodesToSaveToDb);

            return { discountCodes: discountCodesToSaveToDb };
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
        await getAllFlashSaleProductBriefFromEcommerce(schedulesSaveToDb.find(({ isActive }) => isActive));

        return { schedules: schedulesSaveToDb };
    } catch (e) {
        return { error: e };
    }
};

const getAllFlashSaleProductBriefFromEcommerce = async (scheduleActive) => {
    try {
        let allFlashSaleProductBrief = [];

        allFlashSaleProductBrief = await getAllFlashSaleProductBrief({ [scheduleActive.detectField]: scheduleActive.detectValue });

        if (!allFlashSaleProductBrief) {
            return { error: "Can not get all sale product brief!" };
        }

        const allFlashSaleProductBriefToSaveDb = allFlashSaleProductBrief.map(pB => ({
            scheduleId: scheduleActive._id,
            saleCategoryId: pB.catid,
            mainId: pB.itemid
        }));

        await ProductBrief.remove({});
        await ProductBrief.insertMany(allFlashSaleProductBriefToSaveDb);

        return { allFlashSaleProductBrief: allFlashSaleProductBriefToSaveDb };
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

        let activeSchedule = await Schedule.findOne({ ecommerce: "SHOPEE", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });
        let products = [];

        if (!activeSchedule) {
            await getFlashSaleProductSchedulesFromEcommerce();
            activeSchedule = await Schedule.findOne({ ecommerce: "SHOPEE", startTime: { $lt: Date.now() }, endTime: { $gt: Date.now() } });

            if (!activeSchedule) {
                return { products, message: "Products is empty!" };
            }
        }

        const allBriefProductByCategoryAndSchedule = await ProductBrief.find({ saleCategoryId: category.detectValue });

        products = await getAllFlashSaleProductByCategoryAndTime({
            categoryid: category.detectValue,
            promotionid: activeSchedule.detectValue,
            limit: allBriefProductByCategoryAndSchedule.length,
            itemids: allBriefProductByCategoryAndSchedule.map(({ mainId }) => mainId)
        });

        if (products.length > 0) {
            const productsFullInfoToSaveDb = products.map(pFInfo => ({
                mainId: pFInfo.itemid,
                imageUrls: [`${shopeeImageUrl}/${pFInfo.image}`],
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

const getProductDetailFromEcommerce = async ({ _id, mainId, shopeeShopId }) => {
    try {
        const productFullInfoFromEcommerce = await getProductsDetail({ itemid: mainId, shopid: shopeeShopId });
        const productFullInfo = await Product.findOneAndUpdate(
            { _id },
            {
                $set: {
                    productDetail: productFullInfoFromEcommerce.attributes.map(({ name, value }) => ({ name, value })),
                    productDescription: productFullInfoFromEcommerce.description,
                    rateAverage: productFullInfoFromEcommerce.item_rating.rating_star,
                    priceMax: productFullInfoFromEcommerce.price_max / 100000,
                    priceMin: productFullInfoFromEcommerce.price_min / 100000,
                    priceMaxBeforeDiscount: productFullInfoFromEcommerce.price_max_before_discount / 100000,
                    priceMinBeforeDiscount: productFullInfoFromEcommerce.price_min_before_discount / 100000,
                    shopeeModels: productFullInfoFromEcommerce.models.map(({ name, modelid, price, price_before_discount }) => ({ name, modelid, price: price / 100000, priceBeforeDiscount: price_before_discount / 100000, discountPercent: Math.round((price_before_discount - price) * 100 / price_before_discount) })),
                    imageUrls: [...productFullInfoFromEcommerce.images.map(image => `${shopeeImageUrl}/${image}`)],
                    addOnDealId: productFullInfoFromEcommerce.add_on_deal_info && productFullInfoFromEcommerce.add_on_deal_info.add_on_deal_id
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
                mainId: pMapped.itemid,
                imageUrls: [`${shopeeImageUrl}/${pMapped.item_basic.image}`],
                name: pMapped.item_basic.name,
                price: pMapped.item_basic.price / 100000,
                priceBeforeDiscount: pMapped.item_basic.price_before_discount / 100000,
                productUrl: `https://shopee.vn/${getProductUrl(pMapped.item_basic.name, pMapped.shopid, pMapped.itemid)}`,
                quantitySold: pMapped.item_basic.historical_sold,
                quantity: pMapped.item_basic.stock,
                quantityRemain: pMapped.item_basic.stock - pMapped.item_basic.sold,
                discountPercent: pMapped.item_basic.show_discount,
                shopeeShopId: pMapped.shopid,
                ecommerce: "SHOPEE",
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

const logInAccountEcommerce = async (user) => {
    try {
        const { cookie, csrfToken } = await logInToGetAuthInfo({
            username: user.shopeeAccount.username,
            password: CryptoJS.AES.decrypt(user.shopeeAccount.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8),
        });

        if (cookie && csrfToken) {
            user.shopeeAccount.auth = { cookie, csrfToken };

            await user.save();

            return { message: "OK" };
        } else {
            throw new CustomError("Đăng nhập sàn shopee thất bại!", statusCodes.UNAUTHORIZED);
        }
    } catch (e) {
        return { error: e };
    }
};

const saveDiscountCodeToAccountEcommerce = async ({ voucherCode, voucherPromotionid, signature, csrfToken, cookie }) => {
    try {
        const result = await saveVoucher({ voucherCode, voucherPromotionid, signature, csrfToken, cookie });

        if (!result.code) {
            return { message: "Lưu mã thành công!" };
        }

        throw new CustomError("Lưu mã thất bại!", statusCodes.EXPECTATION_FAILED);
    } catch (e) {
        return { error: e };
    }
};

const saveProductToAccountEcommerce = async ({ itemid, modelid, shopid, cookie }) => {
    try {
        const result = await saveProduct({ itemid, modelid, shopid, cookie });

        if (result.error) {
            throw new CustomError(result.error_msg || "Thêm vào giỏ hàng thất bại!", statusCodes.EXPECTATION_FAILED);
        }

        return { message: "Thêm vào giỏ hàng thành công!" };
    } catch (e) {
        throw e;
    }
};

const getProductFromCartEcommerce = async ({ cookie }) => {
    try {
        let shopeeCartProducts = await getProductsFromCart({ cookie });

        if (shopeeCartProducts.length > 0) {
            const markTime = Date.now();

            const productsMapped = shopeeCartProducts.map(pMapped => ({
                productUrl: `https://shopee.vn/${getProductUrl(pMapped.name, pMapped.shopid, pMapped.itemid)}`,
                imageUrls: [`${shopeeImageUrl}/${pMapped.image}`],
                name: pMapped.name,
                price: pMapped.price / 100000,
                priceBeforeDiscount: pMapped.price_before_discount / 100000,
                quantity: pMapped.quantity,
                discountPercent: Math.round((pMapped.price_before_discount - pMapped.price) * 100 / pMapped.price_before_discount),
                ecommerce: "SHOPEE",
                markTime
            }));

            await Product.insertMany(productsMapped);
            shopeeCartProducts = await Product.find({ markTime });
        }

        return shopeeCartProducts;
    } catch (e) {
        return { error: e };
    }
}

const getVoucherSavedFromEcommerce = async ({ cookie, csrfToken }) => {
    try {
        let shopeeVouchersSaved = await getVoucherSaved({ cookie, csrfToken });

        if (shopeeVouchersSaved.length > 0) {
            const markTime = Date.now();

            const vouchersMapped = shopeeVouchersSaved.map(vMapped => {
                return ({
                    ecommerce: "SHOPEE",
                    expires: vMapped.end_time * 1000,
                    code: vMapped.voucher_code,
                    imageUrl: vMapped.icon_hash ? `${shopeeImageUrl}/${vMapped.icon_hash}` : vMapped.reward_type === 2 ? "/images/free_ship.JPG" : "/images/voucher_shopee_image_default.png",
                    title: vMapped.title || getDiscountCodeShopeeTitle(vMapped),
                    mainId: vMapped.promotionid,
                    shopeeSignature: vMapped.signature,
                    description: vMapped.icon_text,
                    markTime
                })
            });

            await DiscountCode.insertMany(vouchersMapped);
            shopeeVouchersSaved = await DiscountCode.find({ markTime });
        }

        return shopeeVouchersSaved;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getDiscountCodesByCategoryFromEcommerce,
    getFlashSaleProductSchedulesFromEcommerce,
    getProductsByCategoryFromEcommerce,
    getProductDetailFromEcommerce,
    searchProductByKeywordFromEcommerce,
    logInAccountEcommerce,
    saveDiscountCodeToAccountEcommerce,
    saveProductToAccountEcommerce,
    getProductFromCartEcommerce,
    getVoucherSavedFromEcommerce
};