const operations = require('../../../constants/operations');
const userTypes = require('../../../constants/userTypes');
const calculateFee = require('../../../utils/calculateFee');
const roundNumber = require('../../../utils/roundNumber');
const getWeekPeriod = require('../../../utils/getWeekPeriod');
const UserModel = require('../user.model');

const ZERO_FEE = 0;

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

jest.mock('../../commission/commission.service', () => ({
  getCashInFee: jest.fn(() => mockCashInFee),
  getCashOutNaturalFee: jest.fn(() => mockCashOutNaturalFee),
  getCashOutJuridicalFee: jest.fn(() => mockCashOutJuridicalFee),
}));

describe('User model', () => {
  let user;
  const cashInOperation = {
    type: operations.CASH_IN_OPERATION,
    user_type: userTypes.NATURAL_TYPE,
    operation: {
      amount: 5000,
    },
  };
  const cashOutNaturalOperation = {
    type: operations.CASH_OUT_OPERATION,
    user_type: userTypes.NATURAL_TYPE,
    date: new Date(),
    operation: {
      amount: 7000,
    },
  };
  const cashOutJuridicalOperation = {
    type: operations.CASH_OUT_OPERATION,
    user_type: userTypes.JURIDICAL_TYPE,
    operation: {
      amount: 300000,
    },
  };

  beforeEach(() => {
    user = new UserModel();
  });

  it('.getCurrentWeekLimit', () => {
    const result = user.getCurrentWeekLimit('001-002');

    expect(result).toEqual(0);
  });

  it('.updateWeekLimit', () => {
    const weekPeriod = '001-002';
    const limit = 100;

    user.updateWeekLimit(weekPeriod, limit);
    const result = user.getCurrentWeekLimit(weekPeriod);

    expect(result).toEqual(limit);
  });

  it('.makeOperation call cashIn', () => {
    jest.spyOn(user, 'cashIn');

    user.makeOperation(cashInOperation);

    expect(user.cashIn).toHaveBeenCalledTimes(1);
  });

  it('.makeOperation call cashOut', () => {
    jest.spyOn(user, 'cashOut');

    user.makeOperation(cashOutNaturalOperation);

    expect(user.cashOut).toHaveBeenCalledTimes(1);
  });

  it('.cashIn in limit', async () => {
    const result = await user.makeOperation(cashInOperation);

    expect(result).toEqual(roundNumber(
      calculateFee(
        cashInOperation.operation.amount,
        mockCashInFee.percents,
      ),
    ));
  });

  it('.cashIn out of limit', async () => {
    const result = await user.makeOperation({
      type: operations.CASH_IN_OPERATION,
      operation: {
        amount: 999999999999999,
      },
    });

    expect(result).toEqual(
      roundNumber(mockCashInFee.max.amount),
    );
  });

  it('.cashOut call cashOutForNatural', () => {
    jest.spyOn(user, 'cashOutForNatural');

    user.cashOut(cashOutNaturalOperation);

    expect(user.cashOutForNatural).toHaveBeenCalledTimes(1);
  });

  it('.cashOut call cashOutForJuridical', () => {
    jest.spyOn(user, 'cashOutForJuridical');

    user.cashOut(cashOutJuridicalOperation);

    expect(user.cashOutForJuridical).toHaveBeenCalledTimes(1);
  });

  it('.cashOutForNatural without fee', async () => {
    const result = await user.cashOutForNatural(
      cashOutNaturalOperation,
    );

    expect(result).toEqual(roundNumber(ZERO_FEE));
  });

  it('.cashOutForNatural with partial fee', async () => {
    await user.cashOutForNatural(
      cashOutNaturalOperation,
    );
    const result = await user.cashOutForNatural(
      cashOutNaturalOperation,
    );

    const weekPeriod = getWeekPeriod(cashOutNaturalOperation.date);
    const currentLimit = user.getCurrentWeekLimit(weekPeriod);

    expect(result).toEqual(roundNumber(
      calculateFee(
        currentLimit - mockCashOutNaturalFee.week_limit.amount,
        mockCashOutNaturalFee.percents,
      ),
    ));
  });

  it('.cashOutForNatural with full fee', async () => {
    await user.cashOutForNatural(
      cashOutNaturalOperation,
    );
    await user.cashOutForNatural(
      cashOutNaturalOperation,
    );
    const result = await user.cashOutForNatural(
      cashOutNaturalOperation,
    );

    expect(result).toEqual(roundNumber(
      calculateFee(
        cashOutNaturalOperation.operation.amount,
        mockCashOutNaturalFee.percents,
      ),
    ));
  });

  it('.cashOutForJuridical lower than minimum', async () => {
    const result = await user.cashOutForJuridical({
      type: operations.CASH_OUT_OPERATION,
      user_type: userTypes.JURIDICAL_TYPE,
      operation: {
        amount: 30,
      },
    });

    expect(result).toEqual(
      roundNumber(mockCashOutJuridicalFee.min.amount),
    );
  });

  it('.cashOutForJuridical more than minimum', async () => {
    const result = await user.cashOutForJuridical(cashOutJuridicalOperation);

    expect(result).toEqual(roundNumber(
      calculateFee(
        cashOutJuridicalOperation.operation.amount,
        mockCashOutJuridicalFee.percents,
      ),
    ));
  });
});
