class Cache {
  constructor() {
    this.cache = {};
  }

  getCache(url) {
    return this.cache[url];
  }

  setCache(url, data) {
    this.cache[url] = data;
  }
}

module.exports = Cache;
