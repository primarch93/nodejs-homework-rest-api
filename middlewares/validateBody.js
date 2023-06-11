const HttpError = require("../helpers/HttpError");

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
    return next(new HttpError(400, error.message));
    } else {
      next();
    }
  };
};

module.exports = validateBody;