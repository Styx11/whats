const ora = require('ora');
const say = require('say');
const iciba = require('./lib/iciba');
const youdao = require('./lib/youdao');
const { config } = require('./lib/util/config');
const { checkLang } = require('./lib/util/checkLang');
const { formatQuery } = require('./lib/util/formatQuery');

module.exports = async (from, to) => {
  let spinner;
  let useIciba;
  const word = formatQuery();

  try {

    useIciba = checkLang(word, from, to);
    config.useIciba = !!useIciba;
    if (useIciba) {
      await iciba(word);
    } else {
      await youdao(word, from, to);
    }
    if (config.say) say.speak(word);

  } catch (e) {
    spinner = ora();
    spinner.fail(e.message || '出现了一个错误...');
  }
};