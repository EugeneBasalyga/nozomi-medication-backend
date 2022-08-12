const getEnvVariable = (name, options = {
  isRequired: false,
}) => {
  const {isRequired} = options || {};

  const value = process.env[name];
  if (!value && isRequired) {
    // eslint-disable-next-line no-console
    console.error(`ENV variable ${name} is required`);
    process.exit(1);
  }

  // eslint-disable-next-line no-prototype-builtins
  if (!value && options && options.hasOwnProperty('defaultValue')) {
    return options.defaultValue;
  }

  return value;
};

module.exports = {
  getEnvVariable,
};
