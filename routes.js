const routes = require('express').Router();
const { login } = require('./controllers');
//routes
routes.post('/login', login);
module.exports = routes;