const { getDateString, getDateStringAndTime } = require("./datetime");
const moneyFormat = require("./moneyFormat");

const getDiscountCodeShopeeTitle = dc => {
    if (dc.coin_percentage) {
        let title = `Hoàn ${dc.coin_percentage}% xu `;

        title += `Đơn tối thiểu ${moneyFormat(dc.min_spend / 100000)} `;

        if (dc.discount_cap !== 0) {
            title += `Giảm tối đa ${moneyFormat(dc.discount_cap / 100000)}`
        }

        return title;
    }
    else {
        let title = `Giảm `;

        if (dc.discount_percentage !== 0) {
            title += `${dc.discount_percentage}% `;
        }
        else if (dc.discount_value !== 0) {
            title += `${moneyFormat(dc.discount_value / 100000)} `;
        }

        title += `Đơn tối thiểu ${moneyFormat(dc.min_spend / 100000)} `

        if (dc.discount_cap !== 0) {
            title += `Giảm tối đa ${moneyFormat(dc.discount_cap / 100000)}`
        }

        return title;
    }
};

const getDiscountCodeShopeeDescription = dc => {
    let description = `${getDiscountCodeShopeeTitle(dc)}. Thời hạn đến ${getDateStringAndTime(dc.end_time * 1000)}. `;

    if (dc.product_limit) {
        description += `Áp dụng cho một số sản phẩm. `
    }
    else {
        description += `Áp dụng cho tất cả sản phẩm. `
    }

    description += `Mỗi tài khoản chỉ được sử dụng một lần duy nhất. Mã giảm giá phát hành bởi Người bán và sẽ không được hoàn lại với bất kỳ lý do nào.`;

    return description;
};

const getProductUrl = (name, shopid, itemid) => {
    return `[${name} i.${shopid}.${itemid}`.replace(/[[]/ig, "-")
        .replace(/]/ig, "-")
        .replace(/ /ig, "-")
        .replace(/%/ig, "")
        .replace(/,/ig, "-")
        .replace(/----/ig, "-")
        .replace(/---/ig, "-")
        .replace(/--/ig, "-")
        .replace(/\//ig, "-");
}

module.exports = {
    getDiscountCodeShopeeTitle,
    getDiscountCodeShopeeDescription,
    getProductUrl
};