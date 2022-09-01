const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {email: user.email},
    config.accessTokenPrivateKey,
  );
  const accessTokenExpiresAt = Date.now() + parseInt(config.accessTokenExpiresIn, 10) * 1000;
  const refreshToken = jwt.sign(
    {email: user.email},
    config.refreshTokenPrivateKey,
  );
  const refreshTokenExpiresAt = Date.now() + parseInt(config.refreshTokenExpiresIn, 10) * 1000;
  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  };
};

module.exports = generateTokens;
