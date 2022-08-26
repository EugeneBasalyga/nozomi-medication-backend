const {generateUUID} = require('../../../../shared/utils/utils');
const ApiError = require('../../../../shared/exceptions/ApiError');

class SessionService {
  constructor(repository) {
    this.repository = repository;
  }

  async findSessionByAccessToken(accessToken) {
    const session = await this.repository.session.findByAccessToken(accessToken);
    if (!session) {
      return null;
    }
    return session;
  }

  async createSession(sessionVO) {
    const sessionTO = {
      ...sessionVO,
      id: sessionVO.id ?? generateUUID(),
    };

    const createdSessionTO = await this.repository.session.create(sessionTO);
    const createdSessionVO = {...createdSessionTO};

    return createdSessionVO;
  }

  async deleteSessionById(sessionId) {
    const currentSession = await this.repository.session.findById(sessionId);
    if (!currentSession) {
      throw ApiError.NotFound(`Session with id ${sessionId} not found`);
    }
    await this.repository.session.deleteById(sessionId);
  }
}

module.exports = SessionService;
