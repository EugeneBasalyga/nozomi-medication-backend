const ApiError = require('../../../shared/exceptions/ApiError');

const verifyAccessToken = (services) => {
  // eslint-disable-next-line consistent-return
  return async (req, __res, next) => {
    if (!req.headers.authorization) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const session = await services.session.findSessionByAccessToken(accessToken);
      if (!session) {
        return next(ApiError.UnauthorizedError());
      }
      if (session.accessTokenExpiresAt < Date.now()) {
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

module.exports = verifyAccessToken;
