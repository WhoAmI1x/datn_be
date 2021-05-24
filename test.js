const axios = require("axios");
const { shopeeProductSaleBaseApiUrl } = require("./src/utils/constants");
const randomString = require("./src/utils/randomString");

// const saveCoupon = async () => {
//     const res = await axios({
//         method: "POST",
//         url: "https://shopee.vn/api/v2/voucher_wallet/save_voucher",
//         headers: {
//             authority: "shopee.vn",
//             "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"`,
//             "sec-ch-ua-mobile": "?0",
//             "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
//             "x-api-source": "pc",
//             "accept": "application/json",
//             "x-shopee-language": "vi",
//             "x-requested-with": "XMLHttpRequest",
//             "if-none-match-": "55b03-3afcfec187396d194ed4f2b78f4d5b20",
//             "content-type": "application/json",
//             "x-csrftoken": "M0YRWNKB1EC2OpYZvx6eilvx2sW9Oqkw",
//             "origin": "https://shopee.vn",
//             "sec-fetch-site": "same-origin",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-dest": "empty",
//             "referer": "https://shopee.vn/",
//             "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,de;q=0.4,ko;q=0.3,und;q=0.2,it;q=0.1,zh-CN;q=0.1,zh-TW;q=0.1,zh;q=0.1,ru;q=0.1,la;q=0.1,pt;q=0.1,pl;q=0.1,es;q=0.1,ja;q=0.1",
//             "cookie": `SPC_IA=-1; SPC_F=AZWBj0CSABp4HGUl8fEHUsdLlgwq3lsl; REC_T_ID=a43a81a0-9f9a-11eb-a302-f898ef6c8291; _gcl_au=1.1.1609608322.1618677208; _fbp=fb.1.1618677208363.835021202; _hjid=859fe281-732b-40b2-8477-e467eac1d276; G_ENABLED_IDPS=google; SPC_CLIENTID=QVpXQmowQ1NBQnA0jyduagylozcflqwv; _med=affiliates; SPC_U=168998947; SPC_EC=qxnBFl1ex/7DxkgOYF0kXQMASGIAcZKFC/SU6j96QBUX8dBBgzXHgFI2NKRDzsHObQdlp9LB7eIZ6kfdtm26RrlldwxHJT8u4Pmq3kXX0d+n8J0DK11jA+AoF/kONWnsIw7edmgz0XAwJsGU2IxcfezyzqjDGuViObgtW1ohTzHaCQO40Iu4KE4A1/bCyJYG; csrftoken=M0YRWNKB1EC2OpYZvx6eilvx2sW9Oqkw; welcomePkgShown=true; _gid=GA1.2.1990241173.1621605819; SPC_SI=mall.VaV5D5G3ZmfQs9YcQM2KjvqfBXKhCszr; _hjAbsoluteSessionInProgress=0; _ga_M32T05RVZT=GS1.1.1621609624.23.1.1621609759.27; AMP_TOKEN=%24NOT_FOUND; _ga=GA1.2.1667541624.1618677209; SPC_R_T_ID="Umq5SLUG0mpLvVVF9t7tvQshgJD8aK6fRIvBJ98o0flYmg9ueKl4junt0lfCt5EJJj7eBWVKvxwnxGPeIkB8GyEwWlebL0iQ+97UPuc504s="; SPC_T_IV="oL3GohHqVaZHlI1EUj0Klw=="; SPC_R_T_IV="oL3GohHqVaZHlI1EUj0Klw=="; SPC_T_ID="Umq5SLUG0mpLvVVF9t7tvQshgJD8aK6fRIvBJ98o0flYmg9ueKl4junt0lfCt5EJJj7eBWVKvxwnxGPeIkB8GyEwWlebL0iQ+97UPuc504s="`,
//         },
//         data: {
//             voucher_code: "POLO15",
//             voucher_promotionid: 79772731,
//             signature: "59203b6954d8687f5ee3490b0f23faf9ee55840d1a3f2c9f72335130c2663b0b"
//         }
//     });

//     console.log("res.data:", res.data);
// }

// saveCoupon().catch(e => console.log(e.response.status))


const logInToGetAuthInfo = async () => {
    const csrfToken = randomString(32);

    const resInit = await axios({
        method: "GET",
        url: `https://shopee.vn/api/v2/authentication/login`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
            "x-api-source": "pc",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": `${csrfToken}`,
            referer: "https://shopee.vn/buyer/login",
            cookie: `csrftoken=${csrfToken}`
        },
    });

    console.log("resInit: ", resInit.headers["set-cookie"]);

    let cookies = resInit.headers["set-cookie"].map(cookie => cookie.split(";")[0]).join("; ");

    console.log("cookies: ", `csrftoken=${csrfToken}; ${cookies}`);

    const resMain = await axios({
        method: "POST",
        url: `https://shopee.vn/api/v2/authentication/login`,
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
            "x-api-source": "pc",
            "x-shopee-language": "vi",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": `${csrfToken}`,
            referer: "https://shopee.vn/buyer/login",
            cookie: `csrftoken=${csrfToken}; ${cookies}`
        },
        data: {
            username: "trantrunghuynh9x", // Tự điền nữa
            password: "f88343c897e31f4938e064dd4bdf1238d72f60f2de91d99f3197893e6c371718", // Tự điền nữa
            support_whats_app: true,
            support_ivs: true
        }
    });

    let cookies = resMain.headers["set-cookie"].map(cookie => cookie.split(";")[0]).join("; ");

    console.log("resMain: ", resMain.data);
    console.log("cookies: ", cookies);
};

logInToGetAuthInfo().catch(e => console.log("Error xxx: ", e))