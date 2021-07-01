const commissionService = require('../commission/commission.service');
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

  makeOperation(operation) {
    switch (operation.type) {
      case operations.CASH_IN_OPERATION:
        return this.cashIn(operation);
      case operations.CASH_OUT_OPERATION:
        return this.cashOut(operation);
      default:
        throw Error('Operation was not found!');
    }
  }

  cashOut(operation) {
    switch (operation.user_type) {
      case userTypes.NATURAL_TYPE:
        return this.cashOutForNatural(operation);
      case userTypes.JURIDICAL_TYPE:
        return this.cashOutForJuridical(operation);
      default:
        throw Error('User type is wrong!');
    }
  }

  async cashIn({ operation }) {
    const { percents, max } = await commissionService.getCashInFee();

    let result = calculateFee(operation.amount, percents);

    if (result > max.amount) {
      result = max.amount;
    }

    return roundNumber(result);
  }

  async cashOutForNatural({ date, operation }) {
    const { percents, week_limit: weekLimit } = await commissionService.getCashOutNaturalFee();

    const weekPeriod = getWeekPeriod(date);
    const currentWeekLimit = this.getCurrentWeekLimit(weekPeriod);

    let result = operation.amount;

    const newWeekLimit = currentWeekLimit + operation.amount;

    if (currentWeekLimit < weekLimit.amount) {
      const overLimit = newWeekLimit - weekLimit.amount;
      result = overLimit > 0 ? overLimit : 0;
    }

    this.updateWeekLimit(weekPeriod, newWeekLimit);

    return roundNumber(calculateFee(result, percents));
  }

  async cashOutForJuridical({ operation }) {
    const { percents, min } = await commissionService.getCashOutJuridicalFee();

    let result = calculateFee(operation.amount, percents);

    if (result < min.amount) {
      result = min.amount;
    }

    return roundNumber(result);
  }
}

module.exports = UserModel;
