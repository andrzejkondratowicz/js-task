const endpoints = require('../../../constants/endpoints');
const CommissionService = require('../commission.service');

describe('CommissionService', () => {
  const commissionService = new CommissionService();
  const testData = { data: { percents: 0.03 } };
  const mockGet = jest.fn(() => testData);

  commissionService.client.get = mockGet;

  describe('.getCashInFee', () => {
    it('should get cash in fee data', async () => {
      const result = await commissionService.getCashInFee();

      expect(mockGet).toHaveBeenCalledWith(endpoints.CASH_IN_ENDPOINT);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(testData.data));
    });
  });

  describe('.getCashOutNaturalFee', () => {
    it('should get cash out for natural fee data', async () => {
      const result = await commissionService.getCashOutNaturalFee();

      expect(mockGet).toHaveBeenCalledWith(endpoints.CASH_OUT_NATURAL_ENDPOINT);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(testData.data));
    });
  });

  describe('.getCashOutJuridicalFee', () => {
    it('should get cash out for juridical fee data', async () => {
      const result = await commissionService.getCashOutJuridicalFee();

      expect(mockGet).toHaveBeenCalledWith(endpoints.CASH_OUT_JURIDICAL_ENDPOINT);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(testData.data));
    });
  });
});
