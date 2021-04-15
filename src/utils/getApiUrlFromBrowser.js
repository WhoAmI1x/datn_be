const puppeteer = require("puppeteer");

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const getDiscountCodeApiUrlFromBrowser = async ({ key, value }) => {
    const browser = await puppeteer.launch({});
    const [page] = await browser.pages();

    await page.goto("https://tiki.vn/khuyen-mai/ma-giam-gia");
    await page.setRequestInterception(true);

    let result = null;

    page.on("request", async request => {
        if (request.url().includes(`${key}=${value}`)) {
            result = request.url();
        }
    })

    await autoScroll(page);
    await browser.close();
    return result;
};

module.exports = { getDiscountCodeApiUrlFromBrowser };