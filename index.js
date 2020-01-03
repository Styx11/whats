const say = require('say');
const iciba = require('./src/iciba');
const youdao = require('./src/youdao');
const logSymbols = require('log-symbols');
const { config } = require('./lib/util/config');
const { checkLang } = require('./lib/util/checkLang');
const { formatQuery } = require('./lib/util/formatQuery');

module.exports = async (from, to) => {
  let useIciba;

  try {
    const {
      query,
      isSent,
      isChinese,
    } = formatQuery();
    config.isChinese = isChinese;

    useIciba = checkLang(from, to) && !isSent;
    config.useIciba = useIciba;
    if (useIciba) {
      await iciba(query);
    } else {
      await youdao(query, from, to);
    }
    if (config.say) say.speak(query);

  } catch (e) {
    const msg = e.message || '出现了一个错误...';
    console.error(logSymbols.error + ' ' + msg);
  }
};