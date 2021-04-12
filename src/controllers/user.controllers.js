const UserServices = require("../services/user.services");
const statusCodes = require("../errors/statusCodes");

const getUserInfo = async (req, res) => {
    const { error, user } = await UserServices.getUserInfo(req.user);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ user });
};

module.exports = {
    getUserInfo,
};