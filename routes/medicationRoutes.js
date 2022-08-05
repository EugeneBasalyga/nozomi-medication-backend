const routes = require('express').Router();
const medicationController = require('../controllers/medicationController');
const authController = require('../controllers/authController');
//routes
routes.use(authController.verifyToken);
routes.get('/medications', medicationController.getMedications);
routes.post('/medications', medicationController.postMedication);
routes.get('/medications/:id', medicationController.getMedication);
routes.put('/medications/:id', medicationController.putMedication);
routes.patch('/medications/:id', medicationController.patchMedication);
routes.delete('/medications/:id', medicationController.deleteMedication);
module.exports = routes;