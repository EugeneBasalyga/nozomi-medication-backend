const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/ApiError');

const validate = (validations, errorType = ApiError.BadRequest) => {
  return async (req, __res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return next(errorType('Invalid parameters provided', errors.array()));
  };
};

module.exports = validate;
