const {param} = require('express-validator');

module.exports = (name, isRequired = true, errorMessage = null) => {
  return isRequired
    ? param(name).isUUID().withMessage(errorMessage || `${name} param is required and must be UUID`)
    : param(name).optional().isUUID().withMessage(errorMessage || `${name} param must be UUID`);
};
