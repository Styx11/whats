const ora = require('ora');
const iciba = require('./lib/iciba');
const youdao = require('./lib/youdao');
const { config } = require('./lib/util/config');
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
    config.useIciba = !!useIciba;
    if (useIciba) {
      iciba(word);
    } else {
      youdao(word, from, to);
    }
  } catch (e) {
    spinner.fail(e.message || '出现了一个错误...');
  }
};