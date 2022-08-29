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

  async findSessionByRefreshToken(refreshToken) {
    const session = await this.repository.session.findByRefreshToken(refreshToken);
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

  async updateSession(sessionVO) {
    const currentsessionTO = await this.repository.session
      .findById(sessionVO.id);
    if (!currentsessionTO) {
      throw ApiError.NotFound(`Session with id ${sessionVO.id} not found`);
    }

    const sessionTO = {
      ...currentsessionTO,
      accessToken: sessionVO.accessToken,
      refreshToken: sessionVO.refreshToken,
    };

    const updatedSessionTO = await this.repository.session.update(sessionTO);
    const updatedSessionVO = {...updatedSessionTO};

    return updatedSessionVO;
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
