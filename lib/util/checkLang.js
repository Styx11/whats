const { config } = require('./config');
const langSup = require('./support');

// the youdao api is NOT opening for free
// so we try to use the iciba api instead 
// when we're translating between en and zh

// returns a boolean representing whether to use the default API
exports.checkLang = (from, to) => {
  if (from && to && (from === to)) throw new Error('请输入有效的值');

  const isChinese = config.isChinese;

  // youdao support language
  const { normal, minor } = langSup;
  const zhSup = normal['zh-CHS'];

  // use iciba
  if (!from && !to) return true;
  if (isChinese && !(zhSup[to])) return true;
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