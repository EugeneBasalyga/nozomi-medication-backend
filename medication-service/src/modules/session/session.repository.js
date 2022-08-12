const BaseRepository = require('../../../../shared/classes/BaseRepository');

class SessionRepository extends BaseRepository {
  constructor(dbClient) {
    super(
      dbClient,
      'Session',
      [
        'id',
        'userId',
        'accessToken',
        'createdAt',
        'updatedAt',
        'version',
      ],
    );
  }

  async findByAccessToken(accessToken) {
    const resultTO = await this.entityRepository
      .findOne(this.tableName, this.columnNames, {accessToken});

    return resultTO;
  }
}

module.exports = SessionRepository;
