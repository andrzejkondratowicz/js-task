const operations = require('../../../constants/operations');
const userTypes = require('../../../constants/userTypes');
const roundNumber = require('../../../utils/roundNumber');
const calculateFee = require('../../../utils/calculateFee');
const UserModel = require('../user.model');
const BankSystemModel = require('../bankSystem.model');

const mockCashInFee = {
  percents: 0.03,
  max: { amount: 100 },
};
const mockCashOutNaturalFee = {
  percents: 0.05,
  week_limit: { amount: 10000 },
};
const mockCashOutJuridicalFee = {
  percents: 0.5,
  min: { amount: 30 },
};

const mockGetCashInFee = jest.fn(() => mockCashInFee);
const mockGetCashOutNaturalFee = jest.fn(() => mockCashOutNaturalFee);
const mockGetCashOutJuridicalFee = jest.fn(() => mockCashOutJuridicalFee);

jest.mock('../../services/commission.service', () => function CommisionService() {
  return {
    getCashInFee: mockGetCashInFee,
    getCashOutNaturalFee: mockGetCashOutNaturalFee,
    getCashOutJuridicalFee: mockGetCashOutJuridicalFee,
  };
});

describe('BankSystem model', () => {
  const bankSystem = new BankSystemModel();
  const mockOperations = [
    {
      user_id: 1,
      type: operations.CASH_IN_OPERATION,
      user_type: userTypes.NATURAL_TYPE,
      operation: { amount: 100 },
    },
    {
      user_id: 2,
      type: operations.CASH_IN_OPERATION,
      user_type: userTypes.NATURAL_TYPE,
      operation: { amount: 1000 },
    },
    {
      user_id: 1,
      type: operations.CASH_IN_OPERATION,
      user_type: userTypes.NATURAL_TYPE,
      operation: { amount: 300 },
    },
  ];

  beforeAll(() => {
    bankSystem.init();
  });

  describe('.init', () => {
    it('should call .getActualFees and save data', () => {
      jest.spyOn(bankSystem, 'getActualFees');

      bankSystem.init();

      expect(bankSystem.getActualFees).toHaveBeenCalled();
    });
  });

  describe('.getActualFees', () => {
    it('should call service methods', () => {
      bankSystem.getActualFees();

      expect(mockGetCashInFee).toHaveBeenCalled();
      expect(mockGetCashOutNaturalFee).toHaveBeenCalled();
      expect(mockGetCashOutJuridicalFee).toHaveBeenCalled();
    });
  });

  describe('.getOrCreateUserById', () => {
    it('should get instance of UserModel', () => {
      const result = bankSystem.getOrCreateUserById(mockOperations[0]);

      expect(result).toBeInstanceOf(UserModel);
    });
  });

  describe('.executeOperation', () => {
    it('should execute one operation', async () => {
      const result = await bankSystem.executeOperation(mockOperations[0]);

      expect(result).toEqual(roundNumber(
        calculateFee(mockOperations[0].operation.amount, mockCashInFee.percents),
      ));
    });
  });

  describe('.executeOperationsList', () => {
    it('should call console.log and executeOperation', async () => {
      jest.spyOn(console, 'log');
      jest.spyOn(bankSystem, 'executeOperation');

      await bankSystem.executeOperationsList(mockOperations);

      expect(console.log).toHaveBeenCalledTimes(mockOperations.length);
      expect(bankSystem.executeOperation).toHaveBeenCalledTimes(mockOperations.length);
    });
  });
});
