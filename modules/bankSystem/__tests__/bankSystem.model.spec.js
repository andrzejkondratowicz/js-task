const operations = require('../../../constants/operations');
const userTypes = require('../../../constants/userTypes');
const UserModel = require('../../user/user.model');
const BankSystemModel = require('../bankSystem.model');

jest.mock('../../commission/commission.service', () => ({
  getCashInFee: jest.fn(() => ({ percents: 0.5, max: { amount: 10 } })),
}));

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

  it('.getOrCreateUserById', () => {
    const result = bankSystem.getOrCreateUserById(mockOperations[0]);

    expect(result).toBeInstanceOf(UserModel);
  });

  it('.executeOperation', async () => {
    const result = await bankSystem.executeOperation(mockOperations[0]);

    expect(result).toEqual('0.50');
  });

  it('.executeOperationsList', async () => {
    jest.spyOn(console, 'log');
    jest.spyOn(bankSystem, 'executeOperation');

    await bankSystem.executeOperationsList(mockOperations);

    expect(console.log).toHaveBeenCalledTimes(mockOperations.length);
    expect(bankSystem.executeOperation).toHaveBeenCalledTimes(mockOperations.length);
  });
});
