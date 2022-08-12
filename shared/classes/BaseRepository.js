const EntityRepository = require('./EntityRepository');

class BaseRepository {
  constructor(dbClient, tableName, columnNames) {
    this.entityRepository = new EntityRepository(dbClient);

    this.dbClient = dbClient;
    this.tableName = tableName;
    this.columnNames = columnNames;
  }

  static transformTOtoEntity(transferObj, columnNames = []) {
    const entity = {};
    columnNames.forEach((columnName) => {
      entity[columnName] = transferObj[columnName] ?? null;
    });

    return entity;
  }

  async findAll() {
    const resultTO = await this.entityRepository
      .findAll(this.tableName, this.columnNames);

    return resultTO;
  }

  async findById(id) {
    const resultTO = await this.entityRepository
      .findOne(this.tableName, this.columnNames, {id});

    return resultTO;
  }

  async create(transferObj) {
    const now = Date.now();
    const entity = {
      ...BaseRepository.transformTOtoEntity(transferObj, this.columnNames),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    await this.entityRepository.create(this.tableName, entity);
    return entity;
  }

  async update(transferObj) {
    const updatedEntity = {
      ...BaseRepository.transformTOtoEntity(transferObj, this.columnNames),
      updatedAt: Date.now(),
    };

    const {id, ...data} = updatedEntity;
    await this.entityRepository.update(this.tableName, data, {id});

    return updatedEntity;
  }

  async deleteById(id) {
    const queryResult = await this.entityRepository.delete(this.tableName, {id});
    const resultTO = queryResult.rows;

    return resultTO;
  }
}

module.exports = BaseRepository;
