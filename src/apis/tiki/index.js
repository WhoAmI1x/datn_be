const axios = require("axios");
const htmlToPlainText = require("../../utils/htmlToPlainText");
const {
    tikiDiscountCodeBaseApiUrl,
    tikiProductSaleBaseApiUrl,
    tikiSearchBaseApiUrl
} = require("../../utils/constants");

const getDiscountCodeWithDetectFieldId = async (url) => {
    const res = await axios({
        method: "GET",
        url
    });
    return res.data && res.data.data;
};

const getDiscountCodePlatformShippingOrTopCoupons = async (detectValue) => {
    const res = await axios({
        method: "GET",
        url: `${tikiDiscountCodeBaseApiUrl}/${detectValue}`
    });
    return res.data && res.data.coupons;
};

const getDiscountCodeByCategory = async ({ key, value }) => {
    const res = await axios({
        method: "GET",
        url: `${tikiDiscountCodeBaseApiUrl}?${key}=${value}`
    });
    return res.data && res.data.coupons[value];
};

const getTodaySaleProductSchedules = async () => {
    const res = await axios({
        method: "GET",
        url: `${tikiProductSaleBaseApiUrl}`,
        params: {
            page: 1
        }
    });

    return res.data && res.data.filters && res.data.filters.times;
};

const getProductsByCategoryAndTime = async ({ tag_id, time_id }) => {
    const res = await axios({
        method: "GET",
        url: `${tikiProductSaleBaseApiUrl}`,
        headers: {
            cookie: "_trackity=ea59ce1-eff6-8ed3-8606-abff92b0a1ac;"
        },
        params: {
            page: 1,
            tag_id,
            time_id
        }
    });

    const lastPage = res.data && res.data.paging && res.data.paging.last_page;
    let products = [];

    if (res.data && res.data.data && res.data.data.length > 0) {
        products = res.data.data;
    }

    const allApiToGetAllProductOfCategory = Array.from({ length: lastPage - 1 }, (_, i) => i + 2)
        .map(page => axios({
            method: "GET",
            url: `${tikiProductSaleBaseApiUrl}`,
            headers: {
                cookie: "_trackity=ea59ce1-eff6-8ed3-8606-abff92b0a1ac;"
            },
            params: {
                page,
                tag_id,
                time_id
            }
        }));

    const allApiToGetAllProductOfCategoryResponse = await Promise.all(allApiToGetAllProductOfCategory);
    allApiToGetAllProductOfCategoryResponse.forEach(({ data: { data } }) => {
        products = [...products, ...data];
    });

    return products;
};

const getProductsDetail = async ({ tikiMasterId, mainId }) => {
    const res = await axios({
        method: "GET",
        url: `${tikiSearchBaseApiUrl}/${tikiMasterId}`,
        params: {
            platform: "web",
            spid: mainId,
            include: "tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag,ranks,breadcrumbs,top_features,cta_desktop"
        }
    });

    let productDetail = [];
    const specifications = res.data.specifications
    if (specifications && specifications.length > 0) {
        for (let i = 0; i < specifications.length; i++) {
            const attributes = specifications[i].attributes.map(({ name, value }) => ({ name, value: htmlToPlainText(`${value}`) }));
            productDetail = [...productDetail, ...attributes];
        }
    }

    const configurable_options = res.data.configurable_options;
    const configurable_products = res.data.configurable_products;
    let productDetailExtend = [];

    if (configurable_options && configurable_products) {
        productDetailExtend = configurable_options.map(({ code, name }) => ({
            name,
            value: configurable_products.find(({ selected }) => selected)[code]
        }));
    }

    return ({
        productDetail: [...productDetail, ...productDetailExtend],
        productDescription: htmlToPlainText(res.data.description),
        images: [...res.data.images.map(({ base_url }) => base_url)],
    });
};

const searchProductByKeyword = async (keyword) => {
    const res = await axios({
        method: "GET",
        url: `${tikiSearchBaseApiUrl}`,
        params: {
            limit: "15",
            page: 1,
            q: keyword,
        }
    });

    return res.data && res.data.data || [];
};

const getProductsDetailSearched = async ({ tikiMasterId }) => {
    const res = await axios({
        method: "GET",
        url: `https://tiki.vn/api/v2/products/${tikiMasterId}?platform=web&spid=${tikiMasterId}&include=tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag,ranks,breadcrumbs,top_features,cta_desktop`,
    });

    let productDetail = [];
    const specifications = res.data.specifications
    if (specifications && specifications.length > 0) {
        for (let i = 0; i < specifications.length; i++) {
            const attributes = specifications[i].attributes.map(({ name, value }) => ({ name, value: htmlToPlainText(`${value}`) }));
            productDetail = [...productDetail, ...attributes];
        }
    }

    const configurable_options = res.data.configurable_options;
    const configurable_products = res.data.configurable_products;
    let productDetailExtend = [];

    if (configurable_options && configurable_products) {
        productDetailExtend = configurable_options.map(({ code, name }) => ({
            name,
            value: configurable_products.find(({ selected }) => selected)[code]
        }));
    }

    return ({
        productDetail: [...productDetail, ...productDetailExtend],
        productDescription: htmlToPlainText(res.data.description),
        images: [...res.data.images.map(({ base_url }) => base_url)],
        rateAverage: res.data.rating_average,
        quantitySold: res.data.quantity_sold && res.data.quantity_sold.value,
        mainId: res.data.url_path.split("=")[1]
    });
};

module.exports = {
    getDiscountCodeWithDetectFieldId,
    getDiscountCodePlatformShippingOrTopCoupons,
    getDiscountCodeByCategory,
    getTodaySaleProductSchedules,
    getProductsByCategoryAndTime,
    getProductsDetail,
    searchProductByKeyword,
    getProductsDetailSearched
};