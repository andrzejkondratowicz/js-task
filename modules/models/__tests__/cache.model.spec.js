const fs = require('fs');
const CacheModel = require('../cache.model');

describe('BankSystem model', () => {
  const testFilename = 'testfile.json';
  const testUrl = '/test';
  const testValue = { value: 'test' };
  const cache = new CacheModel(testFilename);

  beforeEach(async () => {
    await cache.initFile();
  });

  afterEach(async () => {
    await cache.removeCacheFile();
  });

  describe('.constructor', () => {
    let testCache;

    afterAll(() => {
      testCache.removeCacheFile();
    });

    it('should create cache with default filename', () => {
      testCache = new CacheModel();

      expect(testCache.cacheFileName).toBeTruthy();
    });
  });

  describe('.initFile', () => {
    it('should read existing file', async () => {
      jest.spyOn(cache, 'updateCacheFile');

      await cache.initFile();

      expect(cache.updateCacheFile).not.toHaveBeenCalled();
    });

    it('should create new file', () => {
      jest.spyOn(cache, 'updateCacheFile');

      fs.unlink(testFilename, async () => {
        await cache.initFile();

        expect(cache.updateCacheFile).toHaveBeenCalled();
      });
    });
  });

  describe('.updateCacheFile', () => {
    it('should update cache file', async () => {
      await cache.updateCacheFile(testValue);

      fs.readFile(testFilename, 'utf-8', (err, data) => {
        expect(data).toEqual(JSON.stringify(testValue));
      });
    });
  });

  describe('.readCacheFile', () => {
    it('should read cache data', async () => {
      const cacheData = await cache.readCacheFile();

      expect(cacheData).toBeTruthy();
    });

    it('should reject promise if file does not exist', async () => {
      fs.unlink(testFilename, () => {
        expect(async () => {
          await cache.readCacheFile();
        }).rejects.toBeTruthy();
      });
    });
  });

  describe('.removeCacheFile', () => {
    it('should delete cache file', async () => {
      await cache.removeCacheFile();

      fs.readFile(testFilename, 'utf-8', (err) => {
        expect(err).toBeTruthy();
      });
    });
  });

  describe('.getCache', () => {
    it('should return undefined', async () => {
      const result = await cache.getCache(testUrl);

      expect(result).toBeUndefined();
    });

    it('should get right value', async () => {
      await cache.setCache('firstKey', 'value1');
      await cache.setCache(testUrl, testValue);
      await cache.setCache('secondKey', 'value2');

      const result = await cache.getCache(testUrl);

      expect(result).toEqual(testValue);
    });
  });

  describe('.setCache', () => {
    it('should set value', async () => {
      await cache.setCache(testUrl, testValue);

      const result = await cache.getCache(testUrl);

      expect(result).toEqual(testValue);
    });
  });
});
