const UserServices = require("../services/user.services");
const statusCodes = require("../errors/statusCodes");

const registerAdminAccount = async (req, res) => {
    const { error, newUser, token } = await UserServices.registerAdminAccount(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ newUser, token });
};

const loginWithAdminRole = async (req, res) => {
    const { error, user } = await UserServices.loginWithAdminRole(req.user);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ user });
};

const loginWithUserRole = async (req, res) => {
    const { error, user } = await UserServices.loginWithUserRole(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ user });
};

module.exports = {
    registerAdminAccount,
    loginWithAdminRole,
    loginWithUserRole
};