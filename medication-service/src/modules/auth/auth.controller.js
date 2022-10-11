const bcrypt = require('bcrypt');

const BaseController = require('../../../../shared/classes/BaseController');
const ApiError = require('../../../../shared/exceptions/ApiError');
const validationSchemas = require('../../validators/schemas');
const validate = require('../../../../shared/middleware/validationMiddleware');
const verifyAccessToken = require('../../middleware/verifyAccessToken');
const generateTokens = require('../../shared/generateTokens');

class AuthController extends BaseController {
  constructor(service) {
    super(service);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);

    this.router.post(
      '/login',
      validate([
        validationSchemas.login,
      ]),
      this.login,
    );

    this.router.post(
      '/logout',
      verifyAccessToken(service),
      this.logout,
    );

    this.router.post(
      '/register',
      validate([
        validationSchemas.registration,
      ]),
      this.register,
    );
  }

  async login(req, res, next) {
    const user = await this.service.user.findUserByEmail(req.body.email);
    if (!user) {
      return next(ApiError.BadRequest('', [{param: 'email', msg: 'Email address is incorrect'}]));
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return next(ApiError.BadRequest('', [{param: 'password', msg: 'Password is incorrect'}]));
    }

    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      } = generateTokens(user);

      const session = {
        userId: user.id,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      };
      await this.service.session.createSession(session);

      return res.status(200).json({accessToken, refreshToken, email: user.email});
    } catch (err) {
      return next(err);
    }
  }

  async logout(req, res, next) {
    const {session} = req;

    try {
      await this.service.session.deleteSessionById(session.id);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }

  async register(req, res, next) {
    const user = await this.service.user.findUserByEmail(req.body.email);
    if (user) {
      return next(ApiError.BadRequest('', [{param: 'email', msg: 'User with such email address already exists'}]));
    }

    try {
      const userTO = {...req.body};
      const salt = await bcrypt.genSalt(10);
      userTO.password = await bcrypt.hash(userTO.password, salt);
      const createdUser = await this.service.user.createUser(userTO);
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      } = generateTokens(createdUser);

      const session = {
        userId: createdUser.id,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      };
      await this.service.session.createSession(session);

      return res.status(200).json({accessToken, refreshToken, email: createdUser.email});
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = AuthController;
