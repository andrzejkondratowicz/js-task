const operations = require('../../../constants/operations');
const userTypes = require('../../../constants/userTypes');
const calculateFee = require('../../../utils/calculateFee');
const roundNumber = require('../../../utils/roundNumber');
const getWeekPeriod = require('../../../utils/getWeekPeriod');
const UserModel = require('../user.model');

const ZERO_FEE = 0;

describe('User model', () => {
  let user;
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
  const mockActualFees = {
    cashInFee: mockCashInFee,
    cashOutNaturalFee: mockCashOutNaturalFee,
    cashOutJuridicalFee: mockCashOutJuridicalFee,
  };
  const cashInOperation = {
    action: {
      type: operations.CASH_IN_OPERATION,
      user_type: userTypes.NATURAL_TYPE,
      operation: {
        amount: 5000,
      },
    },
    actualFees: mockActualFees,
  };
  const cashOutNaturalOperation = {
    action: {
      type: operations.CASH_OUT_OPERATION,
      user_type: userTypes.NATURAL_TYPE,
      date: new Date(),
      operation: {
        amount: 7000,
      },
    },
    actualFees: mockActualFees,
  };
  const cashOutJuridicalOperation = {
    action: {
      type: operations.CASH_OUT_OPERATION,
      user_type: userTypes.JURIDICAL_TYPE,
      operation: {
        amount: 300000,
      },
    },
    actualFees: mockActualFees,
  };

  beforeEach(() => {
    user = new UserModel();
  });

  describe('.getCurrentWeekLimit', () => {
    it('should get current week limit', () => {
      const result = user.getCurrentWeekLimit('001-002');

      expect(result).toEqual(0);
    });
  });

  describe('.updateWeekLimit', () => {
    it('should update current week limit', () => {
      const weekPeriod = '001-002';
      const limit = 100;

      user.updateWeekLimit(weekPeriod, limit);
      const result = user.getCurrentWeekLimit(weekPeriod);

      expect(result).toEqual(limit);
    });
  });

  describe('.makeOperation', () => {
    it('should call .cashIn', () => {
      jest.spyOn(user, 'cashIn');

      user.makeOperation(cashInOperation);

      expect(user.cashIn).toHaveBeenCalledTimes(1);
    });

    it('should call .cashOut', () => {
      jest.spyOn(user, 'cashOut');

      user.makeOperation(cashOutNaturalOperation);

      expect(user.cashOut).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', () => {
      expect(() => (
        user.makeOperation({ action: { type: '' } })
      )).toThrow();
    });
  });

  describe('.cashIn', () => {
    it('should get value within limit', async () => {
      const result = await user.cashIn(cashInOperation);

      expect(result).toEqual(roundNumber(
        calculateFee(
          cashInOperation.action.operation.amount,
          mockCashInFee.percents,
        ),
      ));
    });

    it('should get max amount', async () => {
      const result = await user.cashIn({
        action: {
          operation: {
            amount: 999999999999999,
          },
        },
        actualFees: mockActualFees,
      });

      expect(result).toEqual(
        roundNumber(mockCashInFee.max.amount),
      );
    });
  });

  describe('.cashOut', () => {
    it('should call .cashOutForNatural', () => {
      jest.spyOn(user, 'cashOutForNatural');

      user.cashOut(cashOutNaturalOperation);

      expect(user.cashOutForNatural).toHaveBeenCalledTimes(1);
    });

    it('should call .cashOutForJuridical', () => {
      jest.spyOn(user, 'cashOutForJuridical');

      user.cashOut(cashOutJuridicalOperation);

      expect(user.cashOutForJuridical).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', () => {
      expect(() => (
        user.cashOut({ action: { user_type: '' } })
      )).toThrow();
    });
  });

  describe('.cashOutForNatural', () => {
    it('should get zero fee', async () => {
      const result = await user.cashOutForNatural(
        cashOutNaturalOperation,
      );

      expect(result).toEqual(roundNumber(ZERO_FEE));
    });

    it('should get fee for a part of amount', async () => {
      await user.cashOutForNatural(
        cashOutNaturalOperation,
      );
      const result = await user.cashOutForNatural(
        cashOutNaturalOperation,
      );

      const weekPeriod = getWeekPeriod(cashOutNaturalOperation.action.date);
      const currentLimit = user.getCurrentWeekLimit(weekPeriod);

      expect(result).toEqual(roundNumber(
        calculateFee(
          currentLimit - mockCashOutNaturalFee.week_limit.amount,
          mockCashOutNaturalFee.percents,
        ),
      ));
    });

    it('should get fee for a full amount', async () => {
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
          cashOutNaturalOperation.action.operation.amount,
          mockCashOutNaturalFee.percents,
        ),
      ));
    });
  });

  describe('.cashOutForJuridical', () => {
    it('should get min amount', async () => {
      const result = await user.cashOutForJuridical({
        action: {
          type: operations.CASH_OUT_OPERATION,
          user_type: userTypes.JURIDICAL_TYPE,
          operation: {
            amount: 30,
          },
        },
        actualFees: mockActualFees,
      });

      expect(result).toEqual(
        roundNumber(mockCashOutJuridicalFee.min.amount),
      );
    });

    it('should get value within limit', async () => {
      const result = await user.cashOutForJuridical(cashOutJuridicalOperation);

      expect(result).toEqual(roundNumber(
        calculateFee(
          cashOutJuridicalOperation.action.operation.amount,
          mockCashOutJuridicalFee.percents,
        ),
      ));
    });
  });
});
