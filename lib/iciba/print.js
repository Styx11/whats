const { config } = require('../util/config');
const log = require('../shared/log');
const {
  sliceOrigStr,
  sliceTransStr
} = require('../shared/slice');

const {
  defaultPrint: baiduDefaultPrint,
  chinesePrint: baiduChinesePrint,
  reservedPrint: baiduReservedPrint,
} = require('../baidu/print');

const logSents = (key, sents) => {
  const chalk = config.chalk;
  
  // 高亮目标词
  // since chalk will change string's length inside,
  // so we call it everytime instead of initing at first
  const markKeyWord = orig => {
    const pattern = new RegExp(`(${key})`, 'ig');
    return orig.replace(pattern, chalk('$1', 'yellow'));
  };

  // 例句
  let index = 1;
  sents && log('');
  sents && sents.forEach(({ orig, trans }) => {
    let idx = chalk(`${index}.`, 'dim');
    let firstLine = true;
    const slicedOrig = [];
    const slicedTrans = [];
    sliceOrigStr(orig, slicedOrig);
    sliceTransStr(trans, slicedTrans);

    // sents logging shouldn't overflow in terminal
    // we will pass the sent that cost too many rows which will be overflowed
    // if there are enough rows to log next sent, we'll still log it, like 1, 2, 5(index is 3)
    const sumRows = slicedOrig.length + slicedTrans.length;
    if (sumRows > config.availRows) {
      return;
    }

    index++;
    slicedOrig.forEach(s => {
      firstLine
        ? log(`${idx} ${markKeyWord(s)}`)
        : log(`   ${markKeyWord(s)}`);
      firstLine = false;
    });
    slicedTrans.forEach(t => {
      log(`   ${chalk(t, 'cyan')}`);
    });
  });
};

exports.defaultPrint = (icibaData, baiduData) => {
  const {
    ps,
    key,
    sents,
    explains
  } = icibaData;
  const notFound = !sents && !explains;

  // apply text normal config
  const chalk = config.chalk;

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
  const hostStr = `~  iciba.com`;
  const hostWords = chalk(hostStr, 'dim');

  // 首行
  notFound || log('');
  const query = key && key[0];
  const keyWords = `${query}${psWords ? '  ' : ''}${psWords}  ${hostWords}`;
  notFound || log(keyWords);

  // 词义
  explains && log('');
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
 
  if (notFound) {
    baiduReservedPrint(baiduData);
  }

  // 各时态释义
  baiduDefaultPrint(baiduData);

  // 例句
  logSents(key, sents);

  log('');
};

exports.chinesePrint = (icibaData, baiduData) => {
  const {
    key,
    sents
  } = icibaData;
  const notFound = baiduData.symbols.length === 0 && baiduData.word_means.length === 0;

  if (notFound) {
    baiduReservedPrint(baiduData);
  } else {
    baiduChinesePrint(baiduData);
  }

  logSents(key, sents);

  log('');
};
