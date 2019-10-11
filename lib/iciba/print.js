const getChalk = require('../shared/getChalk');
const log = require('../shared/log');
const {
  sliceOrigStr,
  sliceTransStr
} = require('../shared/slice');

exports.print = (hostname, data) => {
  const {
    ps,
    key,
    sents,
    explains
  } = data;

  // apply text normal config
  const chalk = getChalk();

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
  log('');
  const keyWords = `${key}  ${psWords}  ${hostWords}`;
  log(keyWords);

  // 词义
  log('');
  explains && explains.forEach(exp => {
    let firstLine = true;
    const slicedExp = [];
    sliceTransStr(exp, slicedExp);
    slicedExp.forEach(e => {
      firstLine
        ? log(`${chalk('-', 'dim')} ${chalk(e, 'greenBright')}`)
        : log(`  ${chalk(e, 'greenBright')}`);
      firstLine = false;
    });
  });

  // 高亮目标词
  const markKeyWord = (orig) => {
    const pattern = new RegExp(`(${key})`, 'ig');
    return orig.replace(pattern, chalk('$1', 'yellow'));
  }

  // 例句
  log('');
  sents && sents.forEach(({ orig, trans }, i) => {
    let index = chalk(`${i + 1}.`, 'dim');

    // since chalk will change string's length inside,
    // so we call it everytime instead of initing at first
    let firstLine = true;
    const slicedOrig = [];
    sliceOrigStr(orig, slicedOrig);
    slicedOrig.forEach(s => {
      firstLine
        ? log(`${index} ${markKeyWord(s)}`)
        : log(`   ${markKeyWord(s)}`);
      firstLine = false;
    });

    const slicedTrans = [];
    sliceTransStr(trans, slicedTrans);
    slicedTrans.forEach(t => {
      log(`   ${chalk(t, 'cyan')}`);
    });
  });

  log('');
};