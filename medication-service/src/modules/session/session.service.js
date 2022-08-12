const {generateUUID} = require('../../../../shared/utils/utils');

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
}

module.exports = SessionService;
