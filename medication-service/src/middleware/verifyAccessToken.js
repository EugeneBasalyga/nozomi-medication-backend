const jwt = require('jsonwebtoken');

const ApiError = require('../../../shared/exceptions/ApiError');
const UserService = require('../modules/user/user.service');
const UserRepository = require('../modules/user/user.repository');
const SessionService = require('../modules/session/session.service');
const SessionRepository = require('../modules/session/session.repository');
const config = require('../config/config');

const verifyToken = async (req, __res, next) => {
  if (!req.headers.authorization) {
    return next(ApiError.UnauthorizedError());
  }
  const userService = new UserService({user: new UserRepository()});
  const sessionService = new SessionService({session: new SessionRepository()});
  const accessToken = req.headers.authorization.split(' ')[1];
  const privateKey = config.privateAuthKey;
  try {
    jwt.verify(accessToken, privateKey);
    const session = await sessionService.findSessionByAccessToken(accessToken);
    if (!session) {
      return next(ApiError.UnauthorizedError());
    }
    const user = await userService.findUserById(session.userId);
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

module.exports = verifyToken;
