const HTTPClient = require('./httpClient');

const BACKEND_URL_ENDPOINT = 'https://private-00d723-paysera.apiary-proxy.com/';

class BackendAPIClient extends HTTPClient {
  constructor() {
    super(BACKEND_URL_ENDPOINT);
  }
}

module.exports = BackendAPIClient;
