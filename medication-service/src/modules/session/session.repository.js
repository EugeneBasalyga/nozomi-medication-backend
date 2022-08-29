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
        'refreshToken',
        'accessTokenExpiresAt',
        'refreshTokenExpiresAt',
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

  async findByRefreshToken(refreshToken) {
    const resultTO = await this.entityRepository
      .findOne(this.tableName, this.columnNames, {refreshToken});

    return resultTO;
  }
}

module.exports = SessionRepository;
