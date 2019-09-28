const rawChalk = require('chalk');
const { normal } = require('../util/config');

// apply text normal config
const chalk = normal.normalize
  ? str => str
  : (str, color) => rawChalk[color](str);

// slice the orig str which out of cols in terminal
const cols = process.stdout.columns - 6;// including index str and spaces
const sliceOrigStr = (str, sliced) => {// sliced is a empty array
  let lastSpaceOfCol;
  const len = str.length;

  if (len <= cols) return sliced.push(str);

  // return index of space before out of col
  lastSpaceOfCol = str.lastIndexOf(' ', cols);
  const mainStr = str.slice(0, lastSpaceOfCol);
  const subStr = str.slice(lastSpaceOfCol + 1);
  sliced.push(mainStr);

  // orig may be a very long string
  // so we call it recursively
  // tail call
  return sliceOrigStr(subStr, sliced);
};

exports.print = (hostname, data) => {
  const {
    ps,
    key,
    sents,
    explains
  } = data;

  const log = (words) => {
    console.group();
    console.log(words);
    console.groupEnd();
  };

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
    log(`${chalk('-', 'dim')} ${chalk(exp, 'greenBright')}`)
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
    
    log(`   ${chalk(trans, 'cyan')}`);
  });

  log('');
};