const axios = require("axios");
const randomString = require("../../utils/randomString");
const {
    shopeeGetShopIdBaseApiUrl,
    shopeeDiscountCodeBaseApiUrl,
    shopeeProductSaleBaseApiUrl
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
            referer: `https://shopee.vn/flash_sale?categoryId=${categoryid}`,
            cookie: `csrftoken=${csrftoken};`
        },
        data: {
            need_personalize: true,
            sort_soldout: true,
            with_dp_items: true,
            categoryid,
            promotionid,
            limit,
            itemids
        }
    });

    console.log("res.data: ", res.data);

    return res.data && res.data.data && res.data.data.items || [];
};

module.exports = {
    getDiscountCodeByShopIdAndCategory,
    getFlashSaleProductSchedules,
    getAllFlashSaleProductBrief,
    getAllFlashSaleProductByCategoryAndTime
};