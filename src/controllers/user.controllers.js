const UserServices = require("../services/user.services");
const statusCodes = require("../errors/statusCodes");

const registerAdminAccount = async (req, res) => {
    const { error, newUser, token } = await UserServices.registerAdminAccount(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ newUser, token });
};

const registerUserAccount = async (req, res) => {
    const { error, newUser, token } = await UserServices.registerUserAccount(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ newUser, token });
};

const login = async (req, res) => {
    const { error, user, token } = await UserServices.login(req.body);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ user, token });
};

const getUserInfo = async (req, res) => {
    const { error, user } = await UserServices.getUserInfo(req.user);
    if (error) {
        return res.status(error.statusCode).send({ error });
    }
    res.status(statusCodes.OK).send({ user });
};

const updateUser = async (req, res) => {
    const { error, user } = await UserServices.updateUser(req);
    if (error) {
        return res.status(error.statusCode).send({ error });
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