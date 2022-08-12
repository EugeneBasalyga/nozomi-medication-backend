const handleStringQuotes = (value) => {
  if (typeof value === 'string' || value instanceof String) {
    // eslint-disable-next-line quotes
    return value.replace(/'/g, "''");
  }

  return value;
};

const getStringValue = (value) => {
  if (typeof value === 'string' || value instanceof String) {
    // eslint-disable-next-line quotes
    const result = value.replace(/'/g, "''");
    return `'${result}'`;
  }

  if (value === null || value === undefined) {
    return 'NULL';
  }

  return value;
};

const removeNulls = (obj) => {
  if (obj) {
    Object.keys(obj).forEach((propName) => {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName]; // eslint-disable-line no-param-reassign
      }
    });
  }

  return obj;
};

const getWhereString = (tableName, obj) => {
  if (!obj) {
    return '';
  }

  const result = Object.keys(obj).map((key) => {
    if (obj[key] === undefined) {
      throw new Error(`Undefined is not supported in where clause (in ${key})`);
    }

    if (obj[key] === null) {
      return `"${tableName}"."${key}" IS NULL`;
    }

    return `"${tableName}"."${key}" = ${getStringValue(obj[key])}`;
  }).join(' AND ');

  return result;
};

const getValuesFromObject = (obj) => {
  if (!obj) {
    return [];
  }

  const values = Object.values(obj).map((object) => getStringValue(object));
  return values;
};

module.exports = {
  getStringValue,
  removeNulls,
  handleStringQuotes,
  getWhereString,
  getValuesFromObject,
};
