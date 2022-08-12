const BaseRepository = require('../../../../shared/classes/BaseRepository');

class UserRepository extends BaseRepository {
  constructor(dbClient) {
    super(
      dbClient,
      'User',
      [
        'id',
        'email',
        'password',
        'createdAt',
        'updatedAt',
        'version',
      ],
    );
  }

  async findByEmail(email) {
    const resultTO = await this.entityRepository
      .findOne(this.tableName, this.columnNames, {email});

    return resultTO;
  }
}

module.exports = UserRepository;
