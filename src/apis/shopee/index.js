const axios = require("axios");
const randomString = require("../../utils/randomString");
const md5 = require("md5");
const { SHA256, MD5 } = require("crypto-js");
const isPhoneNumber = require("../../utils/isPhoneNumber");
const {
    shopeeSearchBaseApiUrl,
    shopeeDiscountCodeBaseApiUrl,
    shopeeProductSaleBaseApiUrl,
    shopeeProductDetailBaseApiUrl,
    shopeeSaveDiscountCodeBaseApi,
    shopeeLogInBaseApi,
    shopeeGetUserInfoBaseApi,
    shopeeCartBaseApi,
    shopeeProductCartBaseApi,
    shopeeVoucherSavedBaseApi
} = require("../../utils/constants");

const getShopIds = async (categoryId) => {
    const response = await axios({
        method: "GET",
        url: `${shopeeSearchBaseApiUrl}`,
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

    itemids.length = 40;

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
            "if-none-match-": `55b03-${md5(`55b03${md5(`itemid=${itemid}&shopid=${shopid}`)}55b03`)}`,
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36`,
        },
        params: {
            itemid,
            shopid
        }
    });

    return res.data && res.data.item;
};

const searchProductByKeyword = async (keyword) => {
    const res = await axios({
        method: "GET",
        url: `${shopeeSearchBaseApiUrl}`,
        headers: {
            authority: "shopee.vn",
            "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"`,
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            "if-none-match-": md5(`55b03${md5(`keyword=${keyword}`)}55b03`),
            "sec-ch-ua-mobile": "?0",
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36`,
            "x-api-source": "pc",
            "accept": "*/*",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            referer: `https://shopee.vn/search?keyword=${keyword}`,
            "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,de;q=0.4,ko;q=0.3,und;q=0.2,it;q=0.1,zh-CN;q=0.1,zh-TW;q=0.1,zh;q=0.1,ru;q=0.1,la;q=0.1,pt;q=0.1,pl;q=0.1,es;q=0.1,ja;q=0.1",
        },
        params: {
            by: "relevancy",
            limit: "15",
            newest: 0,
            order: "desc",
            page_type: "search",
            scenario: "PAGE_GLOBAL_SEARCH",
            version: 2,
            keyword,
        }
    });

    return res.data && res.data.items || [];
};

const getUserInfo = async ({ cookie }) => {
    const res = await axios({
        method: "GET",
        url: `${shopeeGetUserInfoBaseApi}`,
        headers: {
            referer: "https://shopee.vn/user/account/profile",
            "x-api-source": "pc",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            cookie: `${cookie}`
        }
    });

    return res.data && res.data.error;
};

const logInToGetAuthInfo = async ({ username, password }) => {
    const csrfToken = randomString(32);
    const password_hashed = SHA256(MD5(password).toString().toLowerCase()).toString();

    const resInit = await axios({
        method: "GET",
        url: `${shopeeLogInBaseApi}`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
            "x-api-source": "pc",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": `${csrfToken}`,
            referer: "https://shopee.vn/buyer/login",
            cookie: `csrftoken=${csrfToken};`
        },
    });

    let cookie = resInit.headers["set-cookie"].map(cookie => cookie.split(";")[0]).join("; ");
    let dataLogIn = {
        password: password_hashed,
        support_whats_app: true,
        support_ivs: true
    };

    if (isPhoneNumber(`${username}`)) {
        dataLogIn = { ...dataLogIn, phone: `84${username.substr(1, username.length)}` };
    } else {
        dataLogIn = { ...dataLogIn, username };
    }

    const resMain = await axios({
        method: "POST",
        url: `${shopeeLogInBaseApi}`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "x-api-source": "pc",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": `${csrfToken}`,
            referer: "https://shopee.vn/buyer/login",
            cookie: `csrftoken=${csrfToken}; ${cookie}`
        },
        data: dataLogIn
    });

    cookie = resMain.headers["set-cookie"].map(cookie => cookie.split(";")[0]).join("; ");

    return { cookie, csrfToken };
};

const saveVoucher = async ({ voucherCode, voucherPromotionid, signature, csrfToken, cookie }) => {
    const dataSaveVoucher = {
        voucher_code: voucherCode,
        voucher_promotionid: voucherPromotionid,
        signature
    };

    const res = await axios({
        method: "POST",
        url: `${shopeeSaveDiscountCodeBaseApi}`,
        headers: {
            authority: "shopee.vn",
            "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"`,
            "sec-ch-ua-mobile": "?0",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "x-api-source": "pc",
            "accept": "application/json",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            "if-none-match-": `55b03-${md5(`55b03${md5(JSON.stringify(dataSaveVoucher))}55b03`)}`,
            "content-type": "application/json",
            "x-csrftoken": `${csrfToken}`,
            "origin": "https://shopee.vn",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "referer": "https://shopee.vn/",
            "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,de;q=0.4,ko;q=0.3,und;q=0.2,it;q=0.1,zh-CN;q=0.1,zh-TW;q=0.1,zh;q=0.1,ru;q=0.1,la;q=0.1,pt;q=0.1,pl;q=0.1,es;q=0.1,ja;q=0.1",
            "cookie": `csrftoken=${csrfToken}; ${cookie}`,
        },
        data: dataSaveVoucher
    });

    return res.data;
};

const saveProduct = async ({ itemid, modelid, shopid, cookie }) => {
    const res = await axios({
        method: "POST",
        url: `${shopeeCartBaseApi}`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "x-api-source": "pc",
            "content-type": "application/json",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            cookie: `${cookie}`
        },
        data: {
            checkout: true,
            client_source: 1,
            source: "{'refer_urls':[]}",
            update_checkout_only: false,
            donot_add_quantity: false,
            quantity: 1,
            itemid: Number(itemid),
            modelid: Number(modelid),
            shopid: Number(shopid)
        }
    });

    return res.data;
};

const getProductsFromCart = async ({ cookie }) => {
    const dataGetProduct = {
        pre_selected_item_list: []
    };

    const res = await axios({
        method: "POST",
        url: `${shopeeProductCartBaseApi}`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "x-api-source": "pc",
            "content-type": "application/json",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            referer: "https://shopee.vn/cart",
            "if-none-match-": `55b03-${md5(`55b03${md5(JSON.stringify(dataGetProduct))}55b03`)}`,
            cookie: `${cookie}`
        },
    });

    const shop_orders = res.data && res.data.data && res.data.data.shop_orders;

    if (shop_orders && shop_orders.length > 0) {
        return shop_orders.map(({ items }) => items[0]);
    }

    return [];
};

const getVoucherSaved = async ({ cookie, csrfToken }) => {
    const dataGetVoucher = {
        addition: [
            "voucher_microsite_link"
        ],
        cursor: "",
        limit: 50,
        version: 2,
        voucher_sort_flag: 1,
        voucher_status: 1
    };

    const res = await axios({
        method: "POST",
        url: `${shopeeVoucherSavedBaseApi}`,
        headers: {
            cookie: `csrftoken=${csrfToken}; ${cookie}`,
            "if-none-match-": `55b03-${md5(`55b03${md5(JSON.stringify(dataGetVoucher))}55b03`)}`,
            referer: "https://shopee.vn/user/voucher-wallet/",
            "x-api-source": "pc",
            "x-csrftoken": `${csrfToken}`,
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36`,

        },
        data: dataGetVoucher
    });

    return res.data && res.data.data && res.data.data.user_voucher_list || [];
}

module.exports = {
    getDiscountCodeByShopIdAndCategory,
    getFlashSaleProductSchedules,
    getAllFlashSaleProductBrief,
    getAllFlashSaleProductByCategoryAndTime,
    getProductsDetail,
    searchProductByKeyword,
    logInToGetAuthInfo,
    saveVoucher,
    getUserInfo,
    saveProduct,
    getProductsFromCart,
    getVoucherSaved
};