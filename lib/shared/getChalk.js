const rawChalk = require('chalk');
const { config } = require('../util/config');

// exported as an global function
module.exports = () => {
  const chalk = config.normalize
    ? str => str
    : (str, color) => rawChalk[color](str);
  return chalk;
};