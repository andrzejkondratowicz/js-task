const axios = require('axios');

class HTTPClient {
  constructor(baseURL = '') {
    this.client = axios.create({ baseURL });
  }
}

module.exports = HTTPClient;
