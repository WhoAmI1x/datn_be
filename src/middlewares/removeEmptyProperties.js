const omitEmpty = require("omit-empty");

const removeEmptyProperties = () => (req, res, next) => {
  req.body = omitEmpty(req.body);
  req.query = omitEmpty(req.query);
  req.params = omitEmpty(req.params);
  next();
};

module.exports = removeEmptyProperties;
