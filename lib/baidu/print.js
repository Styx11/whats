// the print module of baidu now only print part of the trans result
const log = require('../shared/log');
const getChalk = require('../shared/getChalk');

// default printer of en to zh
// tense1: mean1; mean2
// tense2: mean1l mean2...
exports.defaultPrint = data => {
  const { exchanges } = data;
  const chalk = getChalk();

  const exc1 = exchanges.slice(0, 3);
  const exc2 = exchanges.slice(3);

  const row1 = exc1.map(e => {
    const exchange = e.exchange.join(', ');
    return `${e.tense}: ${chalk(exchange, 'cyan')}`;
  });
  const row2 = exc2.map(e => {
    const exchange = e.exchange.join(', ');
    return `${e.tense}: ${chalk(exchange, 'cyan')}`;
  });

  // e.g:
  // 第三人称单数: loves;  复数: loves;  现在分词: loving
  // 过去式: loved;  过去分词: loved
  exchanges.length > 0 && log('');
  row1.length > 0 && log(row1.join(';  '));
  row2.length > 0 && log(row2.join(';  '));
};