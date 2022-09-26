const ApiError = require('../../../shared/exceptions/ApiError');

const verifyRefreshToken = (services) => {
  // eslint-disable-next-line consistent-return
  return async (req, __res, next) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
      return next(ApiError.UnauthorizedError());
    }
    try {
      const session = await services.session.findSessionByRefreshToken(refreshToken);
      if (!session) {
        return next(ApiError.UnauthorizedError());
      }
      if (session.refreshTokenExpiresAt < Date.now()) {
        return next(ApiError.UnauthorizedError());
      }
      const user = await services.user.findUserById(session.userId);
      if (!user) {
        return next(ApiError.UnauthorizedError());
      }
      req.session = session;
      req.user = user;
      next();
    } catch (err) {
      return next(ApiError.UnauthorizedError());
    }
  };
};

module.exports = verifyRefreshToken;
