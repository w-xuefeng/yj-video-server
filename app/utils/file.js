'use strict';
const path = require('path');
const fs = require('fs');

function delfilePath(url) {
  const realPath = path.resolve(__dirname, `..${url}`);
  if (fs.existsSync(realPath)) {
    fs.unlinkSync(realPath);
    return true;
  }
  return false;
}

module.exports = {
  delfilePath,
};
