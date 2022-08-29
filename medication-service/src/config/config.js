/* eslint-disable global-require */
const path = require('path');

const {getEnvVariable} = require('../../../shared/utils/config');

require('dotenv').config({
  path: path.join(__dirname, process.env.MODE !== 'production'
    ? '../../.env'
    : '../../env.prod'),
});

const config = {
  port: getEnvVariable('PORT', {defaultValue: 8081}),
  db: {
    connectionString: getEnvVariable('DB_CONNECTION_STRING', {isRequired: true}),
  },
  integration: {
    integrationApiKey: getEnvVariable('INTEGRATION_API_KEY', {isRequired: true}),
    integrationUrl: getEnvVariable('INTEGRATION_URL', {isRequired: true}),
  },
  accessTokenPrivateKey: getEnvVariable('ACCESS_TOKEN_PRIVATE_KEY', {isRequired: true}),
  refreshTokenPrivateKey: getEnvVariable('REFRESH_TOKEN_PRIVATE_KEY', {isRequired: true}),
  accessTokenExpiresIn: getEnvVariable('ACCESS_TOKEN_EXPIRES_IN', {isRequired: true}),
  refreshTokenExpiresIn: getEnvVariable('REFRESH_TOKEN_EXPIRES_IN', {isRequired: true}),
};

module.exports = config;
