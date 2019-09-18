const isChinese = require('is-chinese');
const langSup = require('./support');

// the youdao api is NOT opening for free
// so when we're translating between en and zh
// we try to use the iciba api instead
exports.checkLang = (word, from, to) => {
  if (from && to && (from === to)) throw new Error('请输入有效的值');

  // youdao support language
  const { normal, minor } = langSup;
  const zhSup = normal['zh-CHS'];

  // use iciba
  if (!from && !to) return true;
  if (isChinese(word) && !(zhSup[to])) return true;
  if ((from === 'zh-CHS' || !from) && (to === 'en' || !to)) return true;
  if ((from === 'en' || !from) && (to === 'zh-CHS' || !to)) return true;

  // use youdao
  const normalFrom = from && normal[from];
  const minorFrom = from && minor[from];

  if (normalFrom && (!to || normalFrom[to])) {
    return false;
  } else if (minorFrom && (!to || minorFrom[to])) {
    return false;
  } else {
    throw new Error('源语言或目标语言不受支持');
  }
};