const chalk = require('chalk');

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

  // 音标
  const fmtPs = (cty, p) => {
    const psWord = `${cty || ''}[ ${p} ]`;
    return chalk.redBright(psWord);
  };
  const psWords = ps.length > 1
    ? `${fmtPs('英', ps[0])}  ${fmtPs('美', ps[1])}`
    : fmtPs(ps[0]);

  // api主机名
  const hostWords = chalk.dim(`~  ${hostname}`);

  // 首行
  log('\r');
  const keyWords = ` ${key}  ${psWords}  ${hostWords}`;
  log(keyWords);

  // 词义
  log('\r');
  explains.forEach(exp => {
    log(` ${chalk.dim('-')} ${chalk.greenBright(exp)}`)
  });

  // 标注目标词
  const markKeyWord = (orig) => {
    const pattern = new RegExp(`(${key})`, 'ig');
    return orig.replace(pattern, chalk.yellow('$1'));
  }

  // 例句
  log('\r');
  sents.forEach(({ orig, trans }, i) => {
    let indexWords = chalk.dim(`${i + 1}.`);
    log(` ${indexWords} ${markKeyWord(orig)}`);
    log(`    ${chalk.cyan(trans)}`);
  });

  log('\r');
};