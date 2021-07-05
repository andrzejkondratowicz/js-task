const fs = require('fs');

const UTF8_ENCODE = 'utf-8';

class Cache {
  constructor() {
    this.cacheFileName = 'localCache.json';

    this.updateCacheFile({});
  }

  updateCacheFile(data) {
    return new Promise((res) => {
      fs.writeFile(this.cacheFileName, JSON.stringify(data), () => {
        res();
      });
    });
  }

  readCacheFile() {
    return new Promise((res) => {
      fs.readFile(this.cacheFileName, UTF8_ENCODE, (err, data) => {
        if (err) return console.log(err);

        return res(JSON.parse(data));
      });
    });
  }

  removeCacheFile() {
    return new Promise((res) => {
      fs.unlink(this.cacheFileName, () => {
        res();
      });
    });
  }

  async getCache(url) {
    const cacheData = await this.readCacheFile();

    return cacheData[url];
  }

  async setCache(url, data) {
    const cacheData = await this.readCacheFile();

    cacheData[url] = data;

    await this.updateCacheFile(cacheData);
  }
}

module.exports = Cache;
