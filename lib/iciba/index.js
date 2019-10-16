const { request } = require('../shared/request');
const is_chinese = require('is-chinese');
const { format } = require('./format');
const { print } = require('./print');
const ora = require('ora');
const {
  getDefaultSource,
  getChineseSource,
  getSentSource,
} = require('./source');

module.exports = async (word) => {
  let formattedData;
  const hostname = 'iciba.com';
  const isChinese = is_chinese(word);
  const spinner = ora('搜索中...').start();
  const defaultSource = getDefaultSource(word);
  const sentSource = getSentSource(word, isChinese);

  // iciba's default api doesn't have the translation for chinese to english
  // so we make another requset to get it.
  try {

    // iciba may not have translation of sentence
    // so we try to get it every case
    if (isChinese) {
      let chineseSource = getChineseSource(word);

      const reqSent = request(sentSource);
      const reqDefault = request(defaultSource);
      const reqChinese = request(chineseSource);
      const getResult = Promise.all([reqDefault, reqSent, reqChinese]);
      const [rtDefault, rtSent, rtChinese] = await getResult;

      formattedData = await format(rtDefault, rtSent, rtChinese);
    } else {
      const reqSent = request(sentSource);
      const reqDefault = await request(defaultSource);
      const getResult = Promise.all([reqDefault, reqSent]);
      const [rtDefault, rtSent] = await getResult;

      formattedData = await format(rtDefault, rtSent);
    }
    
    spinner.stop();
    print(hostname, formattedData);
    
  } catch (e) {
    const msg = e.message || '或许是网络错误...';
    spinner.fail(msg);
  }
};