const {generateUUID} = require('../../../../shared/utils/utils');

class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  async findUserById(id) {
    const user = await this.repository.user.findById(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findUserByEmail(email) {
    const user = await this.repository.user.findByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(userVO) {
    const userTO = {
      ...userVO,
      id: userVO.id ?? generateUUID(),
    };

    const createdUserTO = await this.repository.user.create(userTO);
    const createdUserVO = {...createdUserTO};

    return createdUserVO;
  }
}

module.exports = UserService;
