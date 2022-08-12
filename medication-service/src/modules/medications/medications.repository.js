const BaseRepository = require('../../../../shared/classes/BaseRepository');

class MedicationRepository extends BaseRepository {
  constructor(dbClient) {
    super(
      dbClient,
      'Medication',
      [
        'id',
        'userId',
        'name',
        'description',
        'count',
        'destinationCount',
        'createdAt',
        'updatedAt',
        'version',
      ],
    );
  }

  async findAllByUserId(userId) {
    const resultTO = await this.entityRepository
      .findAll(this.tableName, this.columnNames, {userId});

    return resultTO;
  }

  async findByIdAndUserId(id, userId) {
    const resultTO = await this.entityRepository
      .findOne(this.tableName, this.columnNames, {id, userId});

    return resultTO;
  }
}

module.exports = MedicationRepository;
