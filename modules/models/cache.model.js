const fs = require('fs');

const DEFAUL_FILENAME = 'localCache.json';
const UTF8_ENCODE = 'utf-8';

class Cache {
  constructor(filename) {
    this.cacheFileName = filename || DEFAUL_FILENAME;

    this.initFile();
  }

  initFile() {
    return new Promise((res) => {
      fs.readFile(this.cacheFileName, async (err) => {
        if (err) await this.updateCacheFile({});

        res();
      });
    });
  }

  updateCacheFile(data) {
    return new Promise((res) => {
      fs.writeFile(this.cacheFileName, JSON.stringify(data), () => {
        res();
      });
    });
  }

  readCacheFile() {
    return new Promise((res, rej) => {
      fs.readFile(this.cacheFileName, UTF8_ENCODE, (err, data) => {
        if (err) return rej(new Error(err));

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
