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
  const {
    query,
    isSent,
    isChinese,
  } = formatQuery();
  config.isChinese = isChinese;

  try {
    useIciba = checkLang(from, to) && !isSent;
    config.useIciba = useIciba;
    if (useIciba) {
      await iciba(query);
    } else {
      await youdao(query, from, to);
    }
    if (config.say) say.speak(query);

  } catch (e) {
    spinner = ora();
    spinner.fail(e.message || '出现了一个错误...');
  }
};