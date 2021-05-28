const statusCodes = require("../errors/statusCodes");

const errorHandler = () => (err, req, res, next) => {
  let {
    statusCode = 500,
    message = "Lỗi server!",
  } = err;

  switch (statusCode) {
    case statusCodes.BAD_REQUEST:
      message = message || "Bad Request";
      break;
    default:
      break;
  }

  return res.status(statusCode).send({
    message,
    statusCode,
  });
};

module.exports = errorHandler;
