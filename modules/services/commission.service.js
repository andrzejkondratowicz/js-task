const HTTPClient = require('../../client/HTTPClient');

// endpoints
const BACKEND_URL_ENDPOINT = 'https://private-00d723-paysera.apiary-proxy.com/';

const CASH_IN_ENDPOINT = '/cash-in';
const CASH_OUT_NATURAL_ENDPOINT = '/cash-out-natural';
const CASH_OUT_JURIDICAL_ENDPOINT = '/cash-out-juridical';

class CommisionService extends HTTPClient {
  constructor() {
    super(BACKEND_URL_ENDPOINT);
  }

  async getCashInFee() {
    const { data } = await this.client.get(CASH_IN_ENDPOINT);
    return data;
  }

  async getCashOutNaturalFee() {
    const { data } = await this.client.get(CASH_OUT_NATURAL_ENDPOINT);
    return data;
  }

  async getCashOutJuridicalFee() {
    const { data } = await this.client.get(CASH_OUT_JURIDICAL_ENDPOINT);
    return data;
  }
}

module.exports = CommisionService;
