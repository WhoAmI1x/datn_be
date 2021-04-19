const axios = require("axios");
const { shopeeProductSaleBaseApiUrl } = require("./src/utils/constants");
const randomString = require("./src/utils/randomString");

const getData = async () => {
    const res = await axios({
        method: "POST",
        url: `${shopeeProductSaleBaseApiUrl}/flash_sale_batch_get_items`,
        headers: {
            "x-csrftoken": "83HlapWZfULamjvQrSC1fLYXXen2GadV",
            referer: "https://shopee.vn/flash_sale?categoryId=3",
            cookie: "csrftoken=83HlapWZfULamjvQrSC1fLYXXen2GadV;"
        },
        data: {
            categoryid: 3,
            limit: 12,
            need_personalize: true,
            promotionid: 2012685028,
            sort_soldout: true,
            with_dp_items: true,
            itemids: [
                2920527527,
                2030085691,
                6476920570,
                5355340674,
                1421043736,
                9337075267,
                415546346,
                806072405,
                1865594286,
                4012847126,
                2033507166,
                512259224
            ]
        }
    });

    console.log(res.data)
}

getData().catch(e => console.log("LOL"));