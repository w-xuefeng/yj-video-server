'use strict';

const SuccessRes = data => ({ status: true, resdata: data });
const ErrorRes = msg => ({ status: false, message: msg });

module.exports = {
  SuccessRes,
  ErrorRes,
};

