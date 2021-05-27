const Cart = require("../models/Cart");
const TikiServices = require("../services/tiki.services");
const ShopeeServices = require("../services/shopee.services");
const Product = require("../models/Product");
const User = require("../models/User");

const getCarts = async ({ user }) => {
    try {
        let tikiCart = await Cart.findOne({ userId: user._id, ecommerce: "TIKI" });
        let shopeeCart = await Cart.findOne({ userId: user._id, ecommerce: "SHOPEE" });

        // Init cart
        if (!tikiCart) {
            tikiCart = new Cart({
                userId: user._id,
                productIds: [],
                ecommerce: "TIKI"
            });
            await tikiCart.save();
        }

        if (!shopeeCart) {
            shopeeCart = new Cart({
                userId: user._id,
                productIds: [],
                ecommerce: "SHOPEE"
            });
            await shopeeCart.save();
        }

        // Check login
        if (!user.tikiAccount.username && !user.tikiAccount.password) {
            throw new CustomError("Bạn chưa nhập tài khoản tiki!", statusCodes.BAD_REQUEST);
        }

        // if (!user.shopeeAccount.username && !user.shopeeAccount.password) {
        //     throw new CustomError("Bạn chưa nhập tài khoản shopee!", statusCodes.BAD_REQUEST);
        // }

        if (!user.tikiAccount.auth ||
            user.tikiAccount.auth && !user.tikiAccount.auth.token ||
            user.tikiAccount.auth && user.tikiAccount.auth.token && user.tikiAccount.auth.expires_at <= Date.now()) {
            const { error, message } = await TikiServices.logInAccountEcommerce(user);

            if (error) {
                throw error;
            }
        }

        // if (!user.shopeeAccount.auth ||
        //     user.shopeeAccount.auth && !user.shopeeAccount.auth.cookie) {
        //     const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

        //     if (error) {
        //         throw error;
        //     }
        // }
        // else if (user.shopeeAccount.auth && user.shopeeAccount.auth.cookie) {
        //     const isCookieExpired = await getUserInfo({ cookie: user.shopeeAccount.auth.cookie });

        //     if (isCookieExpired) {
        //         const { error, message } = await ShopeeServices.logInAccountEcommerce(user);

        //         if (error) {
        //             throw error;
        //         }
        //     }
        // }

        const userLoggedIn = await User.findOne({ _id: user._id });

        // Clear old cart
        if (tikiCart.productIds.length > 0) {
            await Product.remove({ _id: { $in: tikiCart.productIds } });
        }

        // Get new products from carts
        const tikiCartProducts = await TikiServices.getProductFromCartEcommerce({ xAccessToken: userLoggedIn.tikiAccount.auth.token });
        tikiCart.productIds = tikiCartProducts.map(({ _id }) => _id);
        await tikiCart.save();

        tikiCart = await Cart.findOne({ userId: user._id, ecommerce: "TIKI" }).populate("productIds");
        shopeeCart = await Cart.findOne({ userId: user._id, ecommerce: "SHOPEE" });

        return { tikiCart };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    getCarts
};