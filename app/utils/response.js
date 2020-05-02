'use strict';

const toInt = str => {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
};
const toObj = data => JSON.parse(JSON.stringify(data));
const SuccessRes = data => ({ status: true, resdata: data });
const ErrorRes = msg => ({ status: false, message: msg });

module.exports = {
  toInt,
  toObj,
  SuccessRes,
  ErrorRes,
};

