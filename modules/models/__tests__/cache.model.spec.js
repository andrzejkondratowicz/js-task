const CacheModel = require('../cache.model');

describe('BankSystem model', () => {
  let cache;
  const testUrl = '/test';
  const testValue = { value: 'test' };

  beforeEach(() => {
    cache = new CacheModel();
  });

  afterEach(() => {
    cache.removeCacheFile();
  });

  describe('.getCache', () => {
    it('should return undefined', async () => {
      const result = await cache.getCache(testUrl);

      expect(result).toBeUndefined();
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
