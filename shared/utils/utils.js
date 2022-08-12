const {v4: uuidv4, validate: uuidValidate} = require('uuid');

const generateUUID = () => uuidv4();
const isUUID = (id) => uuidValidate(id);

module.exports = {
  generateUUID,
  isUUID,
};
