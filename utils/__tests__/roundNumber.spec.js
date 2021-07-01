const roundNumber = require('../roundNumber');

describe('roundNumber util', () => {
  const withoutDecimals = 10;
  const withDecimals = 2.5;
  const withBigDecimals = 0.699999;

  it('without decimals', () => {
    const result = roundNumber(withoutDecimals);

    expect(result).toEqual('10.00');
  });

  it('with decimals', () => {
    const result = roundNumber(withDecimals);

    expect(result).toEqual('2.50');
  });

  it('with big decimals', () => {
    const result = roundNumber(withBigDecimals);

    expect(result).toEqual('0.70');
  });
});
