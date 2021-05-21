const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");

const auth = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        const role = req.headers["user-role"];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new CustomError("Không tìm thấy người dùng!", statusCodes.NOT_FOUND);
        }

        if (role !== user.role) {
            throw new CustomError("Người dùng không hợp lệ!", statusCodes.FORBIDDEN);
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        return res.status(e.statusCode || statusCodes.UNAUTHORIZED).send({
            error: (e.message === "jwt expired" ? "Phiên làm việc đã hết hạn!" : e.message) || "Vui lòng xác thực!"
        });
    }
};

module.exports = auth;