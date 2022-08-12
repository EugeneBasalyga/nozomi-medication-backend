const {checkSchema} = require('express-validator');
const UserService = require('../modules/user/user.service');
const UserRepository = require('../modules/user/user.repository');

const registrationSchema = checkSchema({
  email: {
    isEmail: true,
    normalizeEmail: true,
    in: ['body'],
    custom: {
      options: async (value) => {
        const userService = new UserService({user: new UserRepository()});
        const user = await userService.findUserByEmail(value);
        if (user) {
          throw ('User with such email address already exists');
        }
        return true;
      },
    },
    errorMessage: 'Email address is invalid',
  },
  password: {
    in: ['body'],
    custom: {
      options: (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
        if (!passwordRegex.test(value)) {
          throw ('Password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters');
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
          throw ('Password and confirmation password do not match');
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
    custom: {
      options: async (value, {req}) => {
        const userService = new UserService({user: new UserRepository()});
        const user = await userService.findUserByEmail(value);
        if (!user) {
          throw ('Email address is incorrect');
        }
        req.user = user;
        return true;
      },
    },
    errorMessage: 'Email address is invalid',
  },
  password: {
    in: ['body'],
    custom: {
      options: async (value, {req}) => {
        const userService = new UserService({user: new UserRepository()});
        const user = await userService.findUserByEmail(req.body.email);
        if (user) {
          if (user.password !== value) {
            throw ('Password is incorrect');
          }
          return true;
        }
        return true;
      },
    },
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
          throw ('Medication name cannot be empty');
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
          throw ('Medication description cannot be empty');
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
          throw ('Medication count cannot be empty');
        }
        if (Number.isNaN(value) || value < 0) {
          throw ('Medication count should be a numeric value not less than 0');
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
          throw ('Medication destination count cannot be empty');
        }
        if (Number.isNaN(value) || value <= 0) {
          throw ('Medication destination count should be a numeric value greater than 0');
        }
        const count = parseInt(req.body.count, 10);
        if (!Number.isNaN(count) && !Number.isNaN(value)) {
          if (value <= count) {
            throw ('Medication destination count should be greater than medication count');
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
