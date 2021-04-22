const axios = require("axios");
const randomString = require("../../utils/randomString");
const md5 = require("md5");
const {
    shopeeGetShopIdBaseApiUrl,
    shopeeDiscountCodeBaseApiUrl,
    shopeeProductSaleBaseApiUrl,
    shopeeProductDetailBaseApiUrl
} = require("../../utils/constants");

const getShopIds = async (categoryId) => {
    const response = await axios({
        method: "GET",
        url: `${shopeeGetShopIdBaseApiUrl}`,
        params: {
            by: "sales",
            limit: 50,
            match_id: categoryId,
            newest: 0,
            order: "desc",
            page_type: "search",
            version: 2
        }
    });

    const shopIds = response.data && response.data.items && response.data.items.map(({ shopid }) => shopid);
    const shopIdsDistinct = Array.from(new Set(shopIds));

    return shopIdsDistinct;
};

const getDiscountCodeByShopIdAndCategory = async (categoryId) => {
    const shopIdsDistinct = await getShopIds(categoryId);
    // const shopIdsDistinct = [228352686, 121634399];

    const getDiscountCodesOfShopsApis = shopIdsDistinct.map(shopid => axios({
        method: "GET",
        url: `${shopeeDiscountCodeBaseApiUrl}`,
        params: {
            shopid,
            with_claiming_status: false
        }
    }));

    const discountCodesOfShopsResponse = await Promise.all(getDiscountCodesOfShopsApis);
    let discountCodesOfShops = [];
    discountCodesOfShopsResponse.forEach(({ data: { data: { voucher_list } } }) => {
        discountCodesOfShops = [...discountCodesOfShops, ...voucher_list];
    });

    return discountCodesOfShops;
};

const getFlashSaleProductSchedules = async () => {
    const res = await axios({
        method: "GET",
        url: `${shopeeProductSaleBaseApiUrl}/get_all_sessions`,
    });

    return res.data && res.data.data && res.data.data.sessions;
};

const getAllFlashSaleProductBrief = async ({ promotionid }) => {
    const res = await axios({
        method: "GET",
        url: `${shopeeProductSaleBaseApiUrl}/get_all_itemids`,
        params: {
            need_personalize: true,
            sort_soldout: true,
            promotionid: promotionid
        }
    });

    return res.data && res.data.data && res.data.data.item_brief_list;
};

const getAllFlashSaleProductByCategoryAndTime = async ({ categoryid, promotionid, limit, itemids }) => {
    const csrftoken = randomString(32);

    const res = await axios({
        method: "POST",
        url: `${shopeeProductSaleBaseApiUrl}/flash_sale_batch_get_items`,
        headers: {
            "x-csrftoken": `${csrftoken}`,
            referer: `https://shopee.vn/flash_sale?categoryId=${categoryid}&promotionId=${promotionid}`,
            cookie: `csrftoken=${csrftoken};`
        },
        data: {
            need_personalize: true,
            sort_soldout: true,
            with_dp_items: true,
            categoryid: Number(categoryid),
            promotionid: Number(promotionid),
            limit: Number(limit),
            itemids
        }
    });

    return res.data && res.data.data && res.data.data.items || [];
};

const getProductsDetail = async ({ itemid, shopid }) => {
    const res = await axios({
        method: "GET",
        url: `${shopeeProductDetailBaseApiUrl}`,
        headers: {
            "if-none-match-": md5(`55b03${md5(`itemid=${itemid}&shopid=${shopid}`)}55b03`),
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36`,
        },
        params: {
            itemid,
            shopid
        }
    });

    return res.data && res.data.item;
};

module.exports = {
    getDiscountCodeByShopIdAndCategory,
    getFlashSaleProductSchedules,
    getAllFlashSaleProductBrief,
    getAllFlashSaleProductByCategoryAndTime,
    getProductsDetail
};