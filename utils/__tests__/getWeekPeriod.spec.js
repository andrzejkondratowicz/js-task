const getWeekPeriod = require('../getWeekPeriod');

describe('getWeekPeriod util', () => {
  const currentDate = new Date();
  const firstTestDate = '2015-02-15';
  const secondTestDate = '2015-02-13';
  const thirdTestDate = '2014-02-13';

  it('with same date', () => {
    const firstResult = getWeekPeriod(currentDate);
    const secondResult = getWeekPeriod(currentDate);

    expect(firstResult).toEqual(secondResult);
  });

  it('with same week', () => {
    const firstResult = getWeekPeriod(firstTestDate);
    const secondResult = getWeekPeriod(secondTestDate);

    expect(firstResult).toEqual(secondResult);
  });

  it('with different years', () => {
    const firstResult = getWeekPeriod(thirdTestDate);
    const secondResult = getWeekPeriod(secondTestDate);

    expect(firstResult).not.toEqual(secondResult);
  });
});
