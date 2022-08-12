const fetch = require('node-fetch');

const config = require('../config/config');
const ApiError = require('../../../shared/exceptions/ApiError');

class Integration {
  static async getData() {
    const response = await fetch(`${config.integration.integrationUrl}/stuff`, {
      method: 'GET',
      headers: {
        'api-key': config.integration.integrationApiKey,
      },
    });

    if (!response.ok) {
      throw ApiError.BadRequest('Error getting stuff');
    }

    const result = await response.json();
    return result;
  }
}

module.exports = Integration;
