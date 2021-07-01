const calculateFee = require('../calculateFee');

describe('calculateFee util', () => {
  const amount = 10;
  const percents = 2.5;
  const calculatedFee = 0.25;

  it('get percents', () => {
    const result = calculateFee(amount, percents);

    expect(result).toEqual(calculatedFee);
  });
});
