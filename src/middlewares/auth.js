const CustomError = require("../errors/CustomError");
const statusCodes = require("../errors/statusCodes");

const auth = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        const role = req.headers["user-role"];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.find({ _id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new CustomError("User not found!", statusCodes.NOT_FOUND);
        }

        if (role !== user.role) {
            throw new CustomError("User invalid!", statusCodes.FORBIDDEN);
        }

        req.user;
        req.token = token;
        next();
    } catch (e) {
        return res.status(statusCodes.UNAUTHORIZED).send({ error: "Please authenticate!" });
    }
};

module.exports = auth;