const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");

const getUserInfo = async ({ _id, email }) => {
    try {
        const user = await User.findById(_id);

        // console.log(user);

        return { user };
    } catch (e) {
        return { error: e };
    }
}

module.exports = {
    getUserInfo
};