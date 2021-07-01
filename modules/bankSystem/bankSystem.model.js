const UserModel = require('../user/user.model');

class BankSystemModel {
  constructor() {
    this.usersData = {};
  }

  getOrCreateUserById(operation) {
    const userId = operation.user_id;

    if (!this.usersData[userId]) {
      this.usersData[userId] = new UserModel(operation);
    }

    return this.usersData[userId];
  }

  async executeOperation(operation) {
    const user = this.getOrCreateUserById(operation);
    const result = await user.makeOperation(operation);

    return result;
  }

  async executeOperationsList(operationsList) {
    for (const operation of operationsList) {
      const result = await this.executeOperation(operation);
      console.log(result);
    }
  }
}

module.exports = BankSystemModel;
