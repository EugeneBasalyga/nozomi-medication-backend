const routes = require('express').Router();
const { login, currentSession, medications } = require('./controllers');
//routes
routes.post('/auth/login', login);
routes.get('/auth/session/current', currentSession);
routes.get('/medications', medications);
module.exports = routes;