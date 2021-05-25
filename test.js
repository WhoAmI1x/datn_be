const axios = require("axios");
const { shopeeProductSaleBaseApiUrl, shopeeCartBaseApi } = require("./src/utils/constants");
const randomString = require("./src/utils/randomString");

const saveProduct = async () => {
    const res = await axios({
        method: "POST",
        url: `${shopeeCartBaseApi}`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "x-api-source": "pc",
            "content-type": "application/json",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            cookie: `SPC_R_T_ID="t0C4Ext2krX6KoNddcdRc+CqNux1D+vPB5iT1PyFK8H1zpRNEkaaBaFhIYbkXcNMlgUeCTXnJi9lnWCfmT4WlTyqZYkZpPI0Az8CIx5MGmA="; SPC_IA=-1; SPC_EC="I2IodT16NSoQX3asdAwKpkz8YJPvARWaST76MItYYpQPCKmVIr67yW4LyKCxOKlffwPn6Lvrv7tnJc/abQu1JU7p/4NXDo5ctC7jsUswmWgZzR5DzkHieDEwEIvp1yzgXV/5116FOrGZUoTMlc0K4gMNrqFJXv/j2T1pQnS5CtSfxWtbtnigzmE47HQHUlKT"; SPC_T_ID="t0C4Ext2krX6KoNddcdRc+CqNux1D+vPB5iT1PyFK8H1zpRNEkaaBaFhIYbkXcNMlgUeCTXnJi9lnWCfmT4WlTyqZYkZpPI0Az8CIx5MGmA="; SPC_SI=mall.N7V7e3z0bvWzuY1Z7k4NeKcnqZLxo231; SPC_R_T_IV="kBuEbG6h4inf/PluThEGwQ=="; SPC_U=168998947; SPC_T_IV="kBuEbG6h4inf/PluThEGwQ=="; SPC_CLIENTID=OVJ3WnpTUk9MV3h4bnhcqfltdvhgwzok`
        },
        data: {
            checkout: true,
            client_source: 1,
            source: "{'refer_urls':[]}",
            update_checkout_only: false,
            donot_add_quantity: false,
            quantity: 1,
            itemid: 597556914,
            modelid: 16881431179,
            shopid: 9413963
        }
    });

    return res.data;
};

saveProduct().catch(e => console.log("Errorxxxxx: ", e))


