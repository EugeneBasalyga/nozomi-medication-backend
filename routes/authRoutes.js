const routes = require('express').Router();
const { login, currentSession } = require('../controllers/authController');
//routes
routes.post('/login', login);
routes.get('/session/current', currentSession);
module.exports = routes;