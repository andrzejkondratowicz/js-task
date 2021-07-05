const UserModel = require('./user.model');
const CommisionService = require('../services/commission.service');

class BankSystemModel {
  constructor() {
    this.usersData = {};
    this.actualFees = {};

    this.commisionService = new CommisionService();
  }

  async init() {
    const actualFeesData = await this.getActualFees();
    this.actualFees = { ...actualFeesData };
  }

  async getActualFees() {
    const cashInFee = await this.commisionService.getCashInFee();
    const cashOutNaturalFee = await this.commisionService.getCashOutNaturalFee();
    const cashOutJuridicalFee = await this.commisionService.getCashOutJuridicalFee();

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
