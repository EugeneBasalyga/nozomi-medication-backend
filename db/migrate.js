/* eslint-disable global-require */
const path = require('path');
const {migrate} = require('postgres-migrations');

const {getEnvVariable} = require('../shared/utils/config');

require('dotenv').config({
  path: path.join(__dirname, process.env.MODE !== 'production'
    ? '.env'
    : 'env.prod'),
});

const config = {
  username: getEnvVariable('DB_USERNAME', {isRequired: true}),
  password: getEnvVariable('DB_PASSWORD', {isRequired: true}),
  host: getEnvVariable('DB_HOST', {isRequired: true}),
  port: getEnvVariable('DB_PORT', {isRequired: true}),
  database: getEnvVariable('DB_DATABASE', {isRequired: true}),
  defaultDatabase: getEnvVariable('DB_DEFAULT_DATABASE', {isRequired: true}),
};

migrate({
  database: config.database,
  user: config.username,
  password: config.password,
  host: config.host,
  port: Number(config.port),
  ensureDatabaseExists: true,
  defaultDatabase: config.defaultDatabase,
}, path.join(__dirname, './migrations'));
