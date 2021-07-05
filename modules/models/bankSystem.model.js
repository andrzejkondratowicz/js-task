const UserModel = require('./user.model');
const CommissionService = require('../services/commission.service');

class BankSystemModel {
  constructor() {
    this.usersData = {};
    this.actualFees = {};

    this.commissionService = new CommissionService();
  }

  async init() {
    const actualFeesData = await this.getActualFees();
    this.actualFees = actualFeesData;
  }

  async getActualFees() {
    const cashInFee = await this.commissionService.getCashInFee();
    const cashOutNaturalFee = await this.commissionService.getCashOutNaturalFee();
    const cashOutJuridicalFee = await this.commissionService.getCashOutJuridicalFee();

    return {
      cashInFee,
      cashOutNaturalFee,
      cashOutJuridicalFee,
    };
  }

  getOrCreateUserById(operation) {
    const userId = operation.user_id;

    if (!this.usersData[userId]) {
      this.usersData[userId] = new UserModel(operation);
    }

    return this.usersData[userId];
  }

  executeOperation(operation) {
    const user = this.getOrCreateUserById(operation);
    const result = user.makeOperation({
      action: operation,
      actualFees: this.actualFees,
    });

    return result;
  }

  executeOperationsList(operationsList) {
    operationsList.forEach((operation) => {
      const result = this.executeOperation(operation);
      console.log(result);
    });
  }
}

module.exports = BankSystemModel;
