const { normal } = require('../util/config');
const rawChalk = require('chalk');

exports.print = (hostname, data) => {
  const {
    ps,
    key,
    sents,
    explains
  } = data;

  const log = (words) => {
    console.log(words);
  };

  // apply text normal config
  const chalk = normal.normalize
    ? str => str
    : (str, color) => rawChalk[color](str);

  // 读音 / 音标
  const fmtPs = (p, cty) => {
    const psWord = `${cty || ''}[ ${p} ]`;
    return chalk(psWord, 'redBright');
  };
  const psWords = ps && !!ps[0]
    ? ps.length > 1
      ? `${fmtPs(ps[0], '英')}  ${fmtPs(ps[1], '美')}`
      : `${fmtPs(ps[0])}`
    : '';

  // api主机名
  const hostWords = chalk(`~  ${hostname}`, 'dim');

  // 首行
  log('\r');
  const keyWords = ` ${key}  ${psWords}  ${hostWords}`;
  log(keyWords);

  // 词义
  log('\r');
  explains && explains.forEach(exp => {
    log(` ${chalk('-', 'dim')} ${chalk(exp, 'greenBright')}`)
  });

  // 标注目标词
  const markKeyWord = (orig) => {
    const pattern = new RegExp(`(${key})`, 'ig');
    return orig.replace(pattern, chalk('$1', 'yellow'));
  }

  // 例句
  log('\r');
  sents && sents.forEach(({ orig, trans }, i) => {
    let index = chalk(`${i + 1}.`, 'dim');
    log(` ${index} ${markKeyWord(orig)}`);
    log(`    ${chalk(trans, 'cyan')}`);
  });

  log('\r');
};