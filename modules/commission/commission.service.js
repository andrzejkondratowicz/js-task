const BackendAPIClient = require('../../clients/backend');
const constants = require('./constants');

class CommisionService extends BackendAPIClient {
  async getCashInFee() {
    const { data } = await this.client.get(constants.CASH_IN_ENDPOINT);
    return data;
  }

  async getCashOutNaturalFee() {
    const { data } = await this.client.get(constants.CASH_OUT_NATURAL_ENDPOINT);
    return data;
  }

  async getCashOutJuridicalFee() {
    const { data } = await this.client.get(constants.CASH_OUT_JURIDICAL_ENDPOINT);
    return data;
  }
}

module.exports = new CommisionService();
