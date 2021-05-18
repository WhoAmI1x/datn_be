const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");
const { compare } = require("bcrypt");
const CryptoJS = require("crypto-js");

const registerAdminAccount = async ({ body: { fullName, email, password } }) => {
    try {
        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new CustomError("Người dùng đã tồn tại! Vui lòng chọn email khác!", statusCodes.BAD_REQUEST);
        }

        if (!password) {
            throw new CustomError("Sai mật khẩu!", statusCodes.BAD_REQUEST);
        }

        const newUser = new User({ fullName, email, password, role: "ADMIN" });

        const token = await newUser.generateAuthToken();

        return { newUser, token };
    } catch (e) {
        return { error: e };
    }
};

const registerUserAccount = async ({ body: { fullName, email, password } }) => {
    try {
        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new CustomError("Người dùng đã tồn tại! Vui lòng chọn email khác!", statusCodes.BAD_REQUEST);
        }

        if (!password) {
            throw new CustomError("Sai mật khẩu!", statusCodes.BAD_REQUEST);
        }

        const newUser = new User({ fullName, email, password, role: "USER" });

        const token = await newUser.generateAuthToken();

        return { newUser, token };
    } catch (e) {
        return { error: e };
    }
};

const login = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomError("Không tìm thấy người dùng!", statusCodes.BAD_REQUEST);
        }

        const isMatchPassword = await compare(password, user.password);
        if (!isMatchPassword) {
            throw new CustomError("Sai mật khẩu!", statusCodes.BAD_REQUEST);
        }

        const token = await user.generateAuthToken();

        return { user, token };
    } catch (e) {
        return { error: e };
    }
}

const getUserInfo = async ({ _id }) => {
    try {
        const user = await User.findOne({ _id });

        return { user };
    } catch (e) {
        return { error: e };
    }
}

const updateUser = async ({ user, body: { tikiAccount, shopeeAccount } }) => {
    try {
        const userNeedToUpdate = await User.findOne({ _id: user._id });

        if (!userNeedToUpdate) {
            throw new CustomError("Không tìm thấy người dùng!", statusCodes.NOT_FOUND);
        }

        if (tikiAccount) {
            if (tikiAccount.password) {
                tikiAccount = {
                    ...tikiAccount,
                    password: CryptoJS.AES.encrypt(tikiAccount.password, process.env.SECRET_KEY).toString()
                };
            }
            userNeedToUpdate.tikiAccount = tikiAccount;
        } else {
            userNeedToUpdate.tikiAccount = {};
        }

        if (shopeeAccount) {
            if (shopeeAccount.password) {
                shopeeAccount = {
                    ...shopeeAccount,
                    password: CryptoJS.AES.encrypt(shopeeAccount.password, process.env.SECRET_KEY).toString()
                };
            }
            userNeedToUpdate.shopeeAccount = shopeeAccount;
        } else {
            userNeedToUpdate.shopeeAccount = {};
        }

        await userNeedToUpdate.save();

        return { user: userNeedToUpdate };
    } catch (e) {
        return { error: e };
    }
}

const logout = async ({ user, token }) => {
    try {
        const tokensAfterLogOut = user.tokens.filter(tk => tk.token !== token);
        user.tokens = tokensAfterLogOut;

        await user.save();

        return { message: "Đăng xuất thành công!" };
    } catch (e) {
        return { error: e };
    }
};

const getAllUser = async ({ query: { keyword } }) => {
    try {
        const allUser = await User.find(keyword ? { email: { "$regex": keyword, "$options": "i" } } : {});

        return { allUser };
    } catch (e) {
        return { error: e };
    }
};

const deleteUser = async ({ query: { userId } }) => {
    try {
        const userDeleted = await User.remove({ _id: userId });

        if (userDeleted.deletedCount === 1) {
            const allUser = await User.find({});
            return { allUser };
        }

        return { error: "Delete user failed!" };
    } catch (e) {
        return { error: e };
    }
};

module.exports = {
    registerAdminAccount,
    registerUserAccount,
    login,
    getUserInfo,
    updateUser,
    logout,
    getAllUser,
    deleteUser,
};