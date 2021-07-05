const axios = require('axios');
const CacheModel = require('../modules/models/cache.model');

const GET_REQUEST_METHOD = 'get';

class HTTPClient {
  constructor(baseURL = '') {
    this.client = axios.create({ baseURL });
    this.cacheable = false;
    this.cache = null;

    this.addCaching();
  }

  addCaching() {
    this.cacheable = true;
    this.cache = new CacheModel();

    this.client.interceptors.request.use((request) => {
      if (request.method === GET_REQUEST_METHOD && this.cacheable) {
        const cachedData = this.cache.getCache(request.url);

        if (cachedData) {
          request.adapter = () => Promise.resolve({
            isCached: true,
            data: cachedData,
            config: request,
          });
        }
      }

      return request;
    });

    this.client.interceptors.response.use((response) => {
      if (response.config.method === GET_REQUEST_METHOD
        && this.cacheable
        && !response.isCached
      ) {
        this.cache.setCache(response.config.url, response.data);
      }

      return response;
    });
  }

  disableCaching() {
    this.cacheable = false;
  }
}

module.exports = HTTPClient;
