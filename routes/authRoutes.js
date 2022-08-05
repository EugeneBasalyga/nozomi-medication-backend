const routes = require('express').Router();
const authController = require('../controllers/authController');
//routes
routes.post('/login', authController.login);
routes.post('/register', authController.register);
routes.get('/session/current', authController.currentSession);
module.exports = routes;