const jwt = require('jsonwebtoken');

const BaseController = require('../../../../shared/classes/BaseController');
const validationSchemas = require('../../validators/schemas');
const validate = require('../../../../shared/middleware/validationMiddleware');
const verifyAccessToken = require('../../../../shared/middleware/verifyAccessToken');
const config = require('../../config/config');

class AuthController extends BaseController {
  constructor(service) {
    super(service);

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.getCurrentSession = this.getCurrentSession.bind(this);

    this.router.post(
      '/login',
      validate([
        validationSchemas.login,
      ]),
      this.login,
    );

    this.router.post(
      '/register',
      validate([
        validationSchemas.registration,
      ]),
      this.register,
    );

    this.router.get(
      '/session/current',
      verifyAccessToken,
      this.getCurrentSession,
    );
  }

  async login(req, res, next) {
    const {user} = req;

    try {
      const privateKey = config.privateAuthKey;
      const accessToken = jwt.sign({email: user.email}, privateKey, {expiresIn: '1h'});
      const session = {
        userId: user.id,
        accessToken,
      };
      await this.service.session.createSession(session);

      return res.status(200).json({accessToken, email: user.email});
    } catch (err) {
      return next(err);
    }
  }

  async register(req, res, next) {
    try {
      const user = await this.service.user.createUser(req.body);
      const privateKey = config.privateAuthKey;
      const accessToken = jwt.sign({email: user.email}, privateKey, {expiresIn: '1h'});
      const session = {
        userId: user.id,
        accessToken,
      };
      await this.service.session.createSession(session);

      return res.status(200).json({accessToken, email: user.email});
    } catch (err) {
      return next(err);
    }
  }

  async getCurrentSession(req, res, next) {
    try {
      return res.status(200).json({email: req.user.email});
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = AuthController;
