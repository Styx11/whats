// the print module of baidu now only print part of the trans result
const log = require('../shared/log');
const getChalk = require('../shared/getChalk');
const {
  sliceOrigStr,
  sliceTransStr
} = require('../shared/slice');

// default printer of en to zh
// tense1: mean1; mean2
// tense2: mean1l mean2...
exports.defaultPrint = data => {
  const { exchanges } = data;
  const chalk = getChalk();

  const exc1 = exchanges.slice(0, 3);
  const exc2 = exchanges.slice(3);

  // filter makes sure that empty exchange [] won't be print
  const row1 = exc1.map(e => {
    if (e.exchange.length === 0) return;
    const exchange = e.exchange.join(', ');
    return `${e.tense}: ${chalk(exchange, 'cyan')}`;
  }).filter(r => !!r);

  const row2 = exc2.map(e => {
    if (e.exchange.length === 0) return;
    const exchange = e.exchange.join(', ');
    return `${e.tense}: ${chalk(exchange, 'cyan')}`;
  }).filter(r => !!r);

  // e.g:
  // 第三人称单数: loves;  复数: loves;  现在分词: loving
  // 过去式: loved;  过去分词: loved
  exchanges.length > 0 && log('');
  row1.length > 0 && log(chalk('-', 'dim') + ' ' + row1.join(';  '));
  row2.length > 0 && log(chalk('-', 'dim') + ' ' + row2.join(';  '));
};

// print word means in different symbols
// word [symbol1]  ~  fanyi.baidu
// ...
// word [symbol2]
// ...
exports.chinesePrint = data => {
  const {
    src,
    symbols,
    word_means
  } = data;
  const chalk = getChalk();

  const hostWords = chalk('~  fanyi.baidu.com', 'dim');
  const logParts = parts => {
    // 动  mean1; mean2; mean3...
    // 名  mean1; mean2...
    log('');
    parts.forEach(part => {
      const sliced = [];
      const n = part.part_name;
      const m = part.means.join('; ');

      // means maybe too long
      sliceOrigStr(m, sliced);
      sliced.forEach((s, i) => {
        i === 0
          ? log(chalk(n, 'dim') + '  ' + chalk(s, 'greenBright'))
          : log('    ' + chalk(s, 'greenBright'));
      });
      
    });
  };


  if (symbols.length === 0 && word_means.length !== 0) {
    log('');
    log(src + '  ' + hostWords);

    log('');
    word_means.forEach(w => {
      const mean = chalk('-', 'dim') + ' ' + chalk(w, 'greenBright');
      log(mean);
    });
    return;
  }
 
  // 爱  [ ài ]  ~  fanyi.baidu.com
  // 动  love; like; be fond of; be keen on
  // 名  love; affection
  let firstLine = true;
  symbols.forEach(symbol => {
    log('');
    const s = `[ ${symbol.word_symbol} ]`;
    const words = src + '  ' + chalk(s, 'redBright') + (firstLine ? ('  ' + hostWords) : '');
    log(words);
    logParts(symbol.parts);
    firstLine = false;
  });
};

// now we only need sentence trans result as backup resource
// so we juse print dst
exports.sentencePrint = (data, isChinese) => {
  const { dst } = data;
  const chalk = getChalk();

  const sliced = [];
  isChinese
    ? sliceTransStr(dst, sliced)
    : sliceOrigStr(dst, sliced);

  sliced.length > 0 && log('');
  sliced.forEach((s, i) => {
    i === 0
      ? log(chalk('-', 'dim') + ' ' + chalk(s, 'greenBright'))
      : log('  ' + chalk(s, 'greenBright'));
  });
};
