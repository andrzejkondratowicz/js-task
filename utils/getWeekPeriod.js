const LAST_DAY_NUMBER_IN_WEEK = 7;
const OFFSET_BETWEEN_FIRST_AND_LAST_DAYS = 6;
const SUNDAY_NUMBER_IN_WEEK = 0;

module.exports = (value) => {
  const date = new Date(value);

  const daysToEndOfWeek = date.getDay() !== SUNDAY_NUMBER_IN_WEEK
    ? (LAST_DAY_NUMBER_IN_WEEK - date.getDay())
    : SUNDAY_NUMBER_IN_WEEK;

  const weekEndDate = date.setDate(date.getDate() + daysToEndOfWeek);
  const weekStartDate = date.setDate(date.getDate() - OFFSET_BETWEEN_FIRST_AND_LAST_DAYS);

  return `${weekStartDate}-${weekEndDate}`;
};
