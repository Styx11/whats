const getChalk = require('../shared/getChalk');
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

const logSents = (key, sents, chalk) => {
  // 高亮目标词
  const markKeyWord = orig => {
    const pattern = new RegExp(`(${key})`, 'ig');
    return orig.replace(pattern, chalk('$1', 'yellow'));
  };

  // 例句
  sents && log('');
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
  logSents(key, sents, chalk);

  log('');
};

exports.chinesePrint = (icibaData, baiduData) => {
  const {
    key,
    sents
  } = icibaData;
  const chalk = getChalk();
  const notFound = baiduData.symbols.length === 0 && baiduData.word_means.length === 0;

  if (notFound) {
    baiduReservedPrint(baiduData);
  } else {
    baiduChinesePrint(baiduData);
  }

  logSents(key, sents, chalk);

  log('');
};
