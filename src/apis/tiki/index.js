const axios = require("axios");
const { tikiDiscountCodeBaseApiUrl } = require("../../utils/constants");

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

module.exports = {
    getDiscountCodeWithDetectFieldId,
    getDiscountCodePlatformShippingOrTopCoupons,
    getDiscountCodeByCategory
};