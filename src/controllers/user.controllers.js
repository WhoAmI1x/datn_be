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
    const { error, user, token } = await UserServices.loginWithAdminRole(req.body);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ user, token });
};

const getUserInfo = async (req, res) => {
    const { error, user } = await UserServices.getUserInfo(req.user);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ user });
};

const logout = async (req, res) => {
    const { error, message } = await UserServices.logout(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ message });
};

const getAllUser = async (req, res) => {
    const { error, allUser } = await UserServices.getAllUser(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ allUser });
};

const deleteUser = async (req, res) => {
    const { error, allUser } = await UserServices.deleteUser(req);
    if (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ error });
    }
    res.status(statusCodes.OK).send({ allUser });
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
    getUserInfo,
    logout,
    getAllUser,
    deleteUser,
    loginWithUserRole,
};