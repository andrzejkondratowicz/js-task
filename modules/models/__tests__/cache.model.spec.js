const CacheModel = require('../cache.model');

describe('BankSystem model', () => {
  let cache;
  const testUrl = '/test';
  const testValue = { value: 'test' };

  beforeEach(() => {
    cache = new CacheModel();
  });

  describe('.getCache', () => {
    it('should return undefined', () => {
      const result = cache.getCache(testUrl);

      expect(result).toBeUndefined();
    });
  });

  describe('.setCache', () => {
    it('should set value', () => {
      cache.setCache(testUrl, testValue);

      const result = cache.getCache(testUrl);

      expect(result).toEqual(testValue);
    });
  });
});
