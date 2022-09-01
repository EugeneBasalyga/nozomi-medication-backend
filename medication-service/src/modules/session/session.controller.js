const BaseController = require('../../../../shared/classes/BaseController');
const verifyAccessToken = require('../../middleware/verifyAccessToken');
const verifyRefreshToken = require('../../middleware/verifyRefreshToken');
const generateTokens = require('../../shared/generateTokens');

class SessionController extends BaseController {
  constructor(service) {
    super(service);

    this.getCurrentSession = this.getCurrentSession.bind(this);
    this.refreshToken = this.refreshToken.bind(this);

    this.router.get(
      '/current',
      verifyAccessToken(service),
      this.getCurrentSession,
    );

    this.router.post(
      '/refreshToken',
      verifyRefreshToken(service),
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
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      } = generateTokens(user);

      const updatedSession = {
        ...session,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      };
      await this.service.session.updateSession(updatedSession);
      return res.status(200).json({accessToken, refreshToken});
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = SessionController;
