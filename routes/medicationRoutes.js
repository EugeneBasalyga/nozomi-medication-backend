const routes = require('express').Router();
const { verifyToken, medications } = require('../controllers/medicationController');
//routes
routes.use(verifyToken);
routes.get('/medications', medications);
module.exports = routes;