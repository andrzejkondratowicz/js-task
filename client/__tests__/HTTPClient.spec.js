const HTTPClient = require('../HTTPClient');

describe('HTTPClient', () => {
  const httpClient = new HTTPClient();
  const testData = 'test';
  let fakeRequestData = {
    method: 'get',
    url: '/test',
  };
  const fakeResponseData = {
    config: {
      method: 'get',
      url: '/test',
    },
  };

  describe('.addCaching', () => {
    beforeEach(() => {
      httpClient.addCaching();
      httpClient.cache.getCache = jest.fn(() => testData);
      httpClient.cache.setCache = jest.fn();

      fakeRequestData = {
        method: 'get',
        url: '/test',
      };
    });

    it('should add caching to client', () => {
      expect(httpClient.cacheable).toBe(true);
      expect(httpClient.cache).not.toBeNull();
      expect(httpClient.client.interceptors.request.handlers[0].fulfilled).toBeTruthy();
      expect(httpClient.client.interceptors.response.handlers[0].fulfilled).toBeTruthy();
    });

    it('should return cached data', async () => {
      const requestHandler = httpClient.client.interceptors.request.handlers[0].fulfilled;
      const request = await requestHandler(fakeRequestData);
      const requestData = await request.adapter();

      expect(httpClient.cache.getCache).toHaveBeenCalled();
      expect(requestData.isCached).toBe(true);
      expect(requestData.data).toEqual(testData);
    });

    it('should not modify adapter if data not found', async () => {
      httpClient.cache.getCache = jest.fn(() => undefined);

      const requestHandler = httpClient.client.interceptors.request.handlers[0].fulfilled;
      const request = await requestHandler(fakeRequestData);

      expect(httpClient.cache.getCache).toHaveBeenCalled();
      expect(request.adapter).toBe(undefined);
    });

    it('should skip cached data', async () => {
      httpClient.cacheable = false;

      const requestHandler = httpClient.client.interceptors.request.handlers[0].fulfilled;
      await requestHandler(fakeRequestData);

      expect(httpClient.cache.getCache).not.toHaveBeenCalled();
    });

    it('should add data to cache', async () => {
      const responseHandler = httpClient.client.interceptors.response.handlers[0].fulfilled;
      await responseHandler(fakeResponseData);

      expect(httpClient.cache.setCache).toHaveBeenCalled();
    });

    it('should not add data to cache', async () => {
      const responseHandler = httpClient.client.interceptors.response.handlers[0].fulfilled;
      await responseHandler({ ...fakeResponseData, isCached: true });

      expect(httpClient.cache.setCache).not.toHaveBeenCalled();
    });
  });

  describe('.disableCaching', () => {
    it('should set cacheable flag to false', () => {
      httpClient.disableCaching();

      expect(httpClient.cacheable).toBe(false);
    });
  });
});
