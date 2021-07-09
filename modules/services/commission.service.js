const endpoints = require('../../constants/endpoints');
const HTTPClient = require('../../client/HTTPClient');

class CommissionService extends HTTPClient {
  constructor() {
    super(endpoints.BACKEND_URL_ENDPOINT);
  }

  async getCashInFee() {
    const { data } = await this.client.get(endpoints.CASH_IN_ENDPOINT);
    return data;
  }

  async getCashOutNaturalFee() {
    const { data } = await this.client.get(endpoints.CASH_OUT_NATURAL_ENDPOINT);
    return data;
  }

  async getCashOutJuridicalFee() {
    const { data } = await this.client.get(endpoints.CASH_OUT_JURIDICAL_ENDPOINT);
    return data;
  }
}

module.exports = CommissionService;
