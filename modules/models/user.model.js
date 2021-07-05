const userTypes = require('../../constants/userTypes');
const operations = require('../../constants/operations');
const calculateFee = require('../../utils/calculateFee');
const roundNumber = require('../../utils/roundNumber');
const getWeekPeriod = require('../../utils/getWeekPeriod');

class UserModel {
  constructor() {
    this.weekLimits = {};
  }

  getCurrentWeekLimit(week) {
    return this.weekLimits[week] || 0;
  }

  updateWeekLimit(week, newLimit) {
    this.weekLimits[week] = newLimit;
  }

  makeOperation(payload) {
    const operationType = payload.action.type;

    if (operationType === operations.CASH_IN_OPERATION) {
      return this.cashIn(payload);
    }
    if (operationType === operations.CASH_OUT_OPERATION) {
      return this.cashOut(payload);
    }
    throw Error('Operation was not found!');
  }

  cashOut(payload) {
    const userType = payload.action.user_type;

    if (userType === userTypes.NATURAL_TYPE) {
      return this.cashOutForNatural(payload);
    }
    if (userType === userTypes.JURIDICAL_TYPE) {
      return this.cashOutForJuridical(payload);
    }
    throw Error('User type is wrong!');
  }

  cashIn({ actualFees, action }) {
    const { percents, max } = actualFees.cashInFee;

    let result = calculateFee(action.operation.amount, percents);

    if (result > max.amount) {
      result = max.amount;
    }

    return roundNumber(result);
  }

  cashOutForNatural({ actualFees, action }) {
    const { percents, week_limit: weekLimit } = actualFees.cashOutNaturalFee;

    const weekPeriod = getWeekPeriod(action.date);
    const currentWeekLimit = this.getCurrentWeekLimit(weekPeriod);

    let result = action.operation.amount;

    const newWeekLimit = currentWeekLimit + action.operation.amount;

    if (currentWeekLimit < weekLimit.amount) {
      const overLimit = newWeekLimit - weekLimit.amount;
      result = overLimit > 0 ? overLimit : 0;
    }

    this.updateWeekLimit(weekPeriod, newWeekLimit);

    return roundNumber(calculateFee(result, percents));
  }

  cashOutForJuridical({ actualFees, action }) {
    const { percents, min } = actualFees.cashOutJuridicalFee;

    let result = calculateFee(action.operation.amount, percents);

    if (result < min.amount) {
      result = min.amount;
    }

    return roundNumber(result);
  }
}

module.exports = UserModel;
