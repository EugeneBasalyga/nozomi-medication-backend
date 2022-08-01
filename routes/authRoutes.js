const routes = require('express').Router();
const authController = require('../controllers/authController');
//routes
routes.post('/login', authController.login);
routes.get('/session/current', authController.currentSession);
module.exports = routes;