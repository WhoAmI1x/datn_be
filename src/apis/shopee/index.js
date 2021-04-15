const axios = require("axios");
const {
    shopeeGetShopIdBaseApiUrl,
    shopeeDiscountCodeBaseApiUrl
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

module.exports = {
    getDiscountCodeByShopIdAndCategory
};