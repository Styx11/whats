const ora = require('ora');
const iciba = require('./lib/iciba');
const { checkVers } = require('./lib/util/checkVers');
const { checkLang } = require('./lib/util/checkLang');

module.exports = (from, to) => {
  let useIciba;
  const spinner = ora();
  const word = process.argv[2].toLocaleLowerCase();

  if (!checkVers()) {
    return spinner.warn('您的 Node.js 版本过低');
  }

  try {
    useIciba = checkLang(word, from, to);
    if (useIciba) {
      iciba(word);
    }
  } catch (e) {
    spinner.fail(e.message || '出现了一个错误...');
  }
};