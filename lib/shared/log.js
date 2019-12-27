// log module makes sure that every sentence indents two spaces
// when log sents in iciba, it won't overflow
const { config } = require('../util/config');

module.exports = str => {
  console.group();
  console.log(str);
  console.groupEnd();
  config.availRows--;
};