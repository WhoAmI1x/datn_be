const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");
const { compare } = require("bcrypt");

const registerAdminAccount = async ({ body: { fullName, email, password } }) => {
    try {
        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new CustomError("User is exist! Please sign up with another email!", statusCodes.BAD_REQUEST);
        }

        if (!password) {
            throw new CustomError("Password invalid!", statusCodes.BAD_REQUEST);
        }

        const newUser = new User({ fullName, email, password, role: "ADMIN" });

        const token = await newUser.generateAuthToken();

        return { newUser, token };
    } catch (e) {
        return { error: e };
    }
};

const loginWithAdminRole = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomError("User not found!", statusCodes.BAD_REQUEST);
        }

        const isMatchPassword = await compare(password, user.password);
        if (!isMatchPassword) {
            throw new CustomError("Password invalid!", statusCodes.BAD_REQUEST);
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

const logout = async ({ user, token }) => {
    try {
        const tokensAfterLogOut = user.tokens.filter(tk => tk.token !== token);
        user.tokens = tokensAfterLogOut;

        await user.save();

        return { message: "Logout success!" };
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

const loginWithUserRole = async ({ }) => {
    try {

        return {};
    } catch (e) {
        return { error: e };
    }
}

module.exports = {
    registerAdminAccount,
    loginWithAdminRole,
    getUserInfo,
    logout,
    getAllUser,
    deleteUser,
    loginWithUserRole
};