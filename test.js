const axios = require("axios");

const getShopIds = async () => {
    const res = await axios({
        method: "GET",
        url: "https://shopee.vn/api/v4/search/search_items",
        params: {
            by: "sales",
            limit: 50,
            match_id: 84,
            newest: 0,
            order: "desc",
            page_type: "search",
            version: 2
        }
    });

    const shopIds = res.data && res.data.items && res.data.items.map(({ shopid }) => shopid);

    return Array.from(new Set(shopIds));
};

const getDiscountCodeByCategory = async () => {
    const shopIdsDistinct = [228352686, 121634399]; // Có voucher
    // const shopIdsDistinct = [121634399]; // Không có voucher

    const getBriefInfoOfShopsApis = shopIdsDistinct.map(shopid => axios({
        url: "https://shopee.vn/api/v2/voucher_wallet/get_shop_vouchers_by_shopid",
        params: {
            shopid,
            with_claiming_status: false
        }
    }));

    const briefInfoOfShopsResponse = await Promise.all(getBriefInfoOfShopsApis);
    let briefInfoOfShops = [];
    briefInfoOfShopsResponse.forEach(({ data: { data: { voucher_list } } }) => {
        briefInfoOfShops = [...briefInfoOfShops, ...voucher_list];
    });

    console.log(briefInfoOfShops);
};

getDiscountCodeByCategory().catch(e => console.log(e));

