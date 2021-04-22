const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");

const registerAdminAccount = async ({ file, body: { fullName, email, password } }) => {
    try {
        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new CustomError("User is exist! Please sign up with another email!", statusCodes.BAD_REQUEST);
        }

        if (!password) {
            throw new CustomError("Password invalid!", statusCodes.BAD_REQUEST);
        }

        const avatarUrl = file.destination.replace("./src/assets", "") + `/${file.filename}`;
        const newUser = new User({ fullName, email, password, avatarUrl, role: "ADMIN" });

        const token = await newUser.generateAuthToken();

        return { newUser, token };
    } catch (e) {
        return { error: e };
    }
};

const loginWithAdminRole = async ({ _id, email }) => {
    try {

        return {};
    } catch (e) {
        return { error: e };
    }
}

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
    loginWithUserRole
};