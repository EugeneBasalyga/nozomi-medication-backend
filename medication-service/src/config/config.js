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
  privateAuthKey: getEnvVariable('PRIVATE_AUTH_KEY', {isRequired: true}),
};

module.exports = config;
