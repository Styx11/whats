const log = require('../shared/log');
const { config } = require('../util/config');
const {
  sliceOrigStr,
  sliceTransStr,
} = require('../shared/slice');

exports.print = (data) => {
  const chalk = config.chalk;
  let {
    to,
    from,
    orig,
    trans
  } = data;

  log('');

  // 首行主机名
  const hostname = chalk('~ youdao.com ~', 'dim');
  log(hostname);

  log('');

  // 原文
  let firstLine = true;
  const slicedOrig = [];

  from = chalk(from, 'red');
  sliceOrigStr(orig, slicedOrig);
  slicedOrig.forEach(o => {
    o = chalk(o, 'cyan');
    firstLine
      ? log(`${from}  ${o}`)
      : log(`    ${o}`);// four spaces
    firstLine = false;
  });

  log('');

  // 翻译结果
  firstLine = true;
  const slicedTrans = [];

  to = chalk(to, 'red');
  sliceTransStr(trans, slicedTrans);
  slicedTrans.forEach(t => {
    t = chalk(t, 'cyan');
    firstLine
      ? log(`${to}  ${t}`)
      : log(`    ${t}`);
    firstLine = false;
  });

  log('');

  log(hostname);

  log('');

};