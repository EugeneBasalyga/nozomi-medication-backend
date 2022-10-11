const {checkSchema} = require('express-validator');
const ApiError = require('../../../shared/exceptions/ApiError');

const registrationSchema = checkSchema({
  email: {
    isEmail: true,
    normalizeEmail: true,
    in: ['body'],
    errorMessage: 'Email address is invalid',
  },
  password: {
    in: ['body'],
    custom: {
      options: (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
        if (!passwordRegex.test(value)) {
          throw ApiError.BadRequest('Password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters');
        }
        return true;
      },
    },
  },
  repeatPassword: {
    in: ['body'],
    custom: {
      options: (value, {req}) => {
        if (value !== req.body.password) {
          throw ApiError.BadRequest('Repeat password does not match with password');
        }
        return true;
      },
    },
  },
});

const loginSchema = checkSchema({
  email: {
    isEmail: true,
    normalizeEmail: true,
    in: ['body'],
    errorMessage: 'Email address is invalid',
  },
  password: {
    in: ['body'],
  },
});

const medicationSchema = checkSchema({
  id: {
    in: ['body'],
    isUUID: true,
    optional: true,
  },
  userId: {
    in: ['body'],
    isUUID: true,
    optional: true,
  },
  name: {
    in: ['body'],
    custom: {
      options: (value) => {
        if (value.length === 0) {
          throw ApiError.BadRequest('Medication name cannot be empty');
        }
        return true;
      },
    },
  },
  description: {
    in: ['body'],
    custom: {
      options: (value) => {
        if (value.length === 0) {
          throw ApiError.BadRequest('Medication description cannot be empty');
        }
        return true;
      },
    },
  },
  count: {
    in: ['body'],
    toInt: true,
    custom: {
      options: (value) => {
        if (value.length === 0) {
          throw ApiError.BadRequest('Medication count cannot be empty');
        }
        if (Number.isNaN(value) || value < 0) {
          throw ApiError.BadRequest('Medication count should be a numeric value not less than 0');
        }
        return true;
      },
    },
  },
  destinationCount: {
    in: ['body'],
    toInt: true,
    custom: {
      options: (value, {req}) => {
        if (value.length === 0) {
          throw ApiError.BadRequest('Medication destination count cannot be empty');
        }
        if (Number.isNaN(value) || value <= 0) {
          throw ApiError.BadRequest('Medication destination count should be a numeric value greater than 0');
        }
        const count = parseInt(req.body.count, 10);
        if (!Number.isNaN(count) && !Number.isNaN(value)) {
          if (value < count) {
            throw ApiError.BadRequest('Medication destination count should be not less than medication count');
          }
        }
        return true;
      },
    },
  },
  updatedAt: {
    in: ['body'],
    optional: true,
  },
});

module.exports = {
  registration: registrationSchema,
  login: loginSchema,
  medication: medicationSchema,
};
