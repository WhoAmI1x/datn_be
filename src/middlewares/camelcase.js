const camelcaseKeys = require("camelcase-keys");

const camelcase = () => (req, res, next) => {
  req.body = camelcaseKeys(req.body, { deep: true });
  req.query = camelcaseKeys(req.query);
  req.params = camelcaseKeys(req.params);
  next();
};

module.exports = camelcase;
