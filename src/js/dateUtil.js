export const getDateStr = function (date) {
  date = date ? date : new Date();
  return `${date.getFullYear()}-` +
    `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-` +
    `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
}

export const getDDay = function (dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const dateDiff = (date.getTime() - today.getTime()) / 1000 / 60 / 60 / 24;
  return Math.floor(Math.abs(dateDiff));
}