const {types} = require('pg');

const {getStringValue, getWhereString, getValuesFromObject} = require('../utils/db');

// // NOTE: Is used to automatically convert BIGINT treated by postgres as a string to number
// //       !!! BIGINT with more than 15 digits will not be accurate as a number
types.setTypeParser(types.builtins.INT8, parseInt);

class EntityRepository {
  constructor(db) {
    if (EntityRepository.entity) {
      // eslint-disable-next-line no-constructor-return
      return EntityRepository.entity;
    }

    this.db = db;
    EntityRepository.entity = this;
  }

  async findAll(tableName, fields, whereParams, fieldsMapFn) {
    const where = getWhereString(tableName, whereParams);
    const selectFields = `"${fields.join('", "')}"`;

    const sql = `SELECT ${selectFields} FROM public."${tableName}"${where ? ` WHERE ${where}` : ''};`;
    const queryResult = await this.db.query(sql);

    let resultTO = queryResult.rows;
    if (fieldsMapFn) {
      resultTO = resultTO.map((org) => fieldsMapFn(org));
    }

    return resultTO;
  }

  async findOne(tableName, fields, whereParams, fieldsMapFn) {
    const where = getWhereString(tableName, whereParams);
    const selectFields = `"${fields.join('", "')}"`;

    const sql = `SELECT ${selectFields} FROM public."${tableName}"${where ? ` WHERE ${where}` : ''};`;
    const queryResult = await this.db.query(sql);

    let resultTO = queryResult.rows[0] || null;
    if (fieldsMapFn && resultTO) {
      resultTO = fieldsMapFn(resultTO);
    }

    return resultTO;
  }

  async create(tableName, entity) {
    const keys = `"${Object.keys(entity).join('", "')}"`;
    const values = getValuesFromObject(entity).join(', ');

    const sql = `INSERT INTO public."${tableName}" (${keys}) VALUES (${values});`;
    await this.db.query(sql);

    return entity;
  }

  async update(tableName, entity, whereParams) {
    const where = getWhereString(tableName, whereParams);
    const values = Object.keys(entity).map((key) => `"${key}" = ${getStringValue(entity[key])}`);

    const sql = `UPDATE public."${tableName}" SET ${values}${where ? ` WHERE ${where}` : ''};`;
    await this.db.query(sql);

    return entity;
  }

  async delete(tableName, whereParams) {
    const where = getWhereString(tableName, whereParams);

    const sql = `DELETE FROM public."${tableName}"${where ? ` WHERE ${where}` : ''};`;
    const result = await this.db.query(sql);

    return result;
  }

  query(...args) {
    return this.db.query(...args);
  }
}

module.exports = EntityRepository;
