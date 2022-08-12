const errorsConst = require('../constants/errors');

module.exports = class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, errorsConst.UNAUTHORIZED);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message) {
    return new ApiError(404, errorsConst.NOT_FOUND(message));
  }

  static InternalServerError(message) {
    return new ApiError(500, message);
  }
};
