const jwt = require('jsonwebtoken');

const BaseController = require('../../../../shared/classes/BaseController');
const verifyAccessToken = require('../../middleware/verifyAccessToken');
const verifyRefreshToken = require('../../middleware/verifyRefreshToken');
const config = require('../../config/config');

class SessionController extends BaseController {
  constructor(service) {
    super(service);

    this.getCurrentSession = this.getCurrentSession.bind(this);
    this.refreshToken = this.refreshToken.bind(this);

    this.router.get(
      '/current',
      verifyAccessToken,
      this.getCurrentSession,
    );

    this.router.post(
      '/refreshToken',
      verifyRefreshToken,
      this.refreshToken,
    );
  }

  async getCurrentSession(req, res, next) {
    try {
      return res.status(200).json({email: req.user.email});
    } catch (err) {
      return next(err);
    }
  }

  async refreshToken(req, res, next) {
    const {user, session} = req;

    try {
      const accessToken = jwt.sign(
        {email: user.email},
        config.accessTokenPrivateKey,
        {expiresIn: config.accessTokenExpiresIn},
      );
      const refreshToken = jwt.sign(
        {email: user.email},
        config.refreshTokenPrivateKey,
        {expiresIn: config.refreshTokenExpiresIn},
      );
      session.accessToken = accessToken;
      session.refreshToken = refreshToken;
      await this.service.session.updateSession(session);

      return res.status(200).json({accessToken, refreshToken});
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = SessionController;
