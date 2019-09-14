const { getDefaultSource, getChineseSource } = require('./source');
const { request } = require('./request');
const isChinese = require('is-chinese');
const { format } = require('./format');
const { print } = require('./print');

module.exports = async (word) => {
  let formattedData;
  const hostname = 'iciba.com';
  const defaultSource = getDefaultSource(word);

  // iciba's default api doesn't have the translation for chinese to english
  // so we make another requset to get it.
  if (isChinese(word)) {
    let chineseSource = getChineseSource(word);

    const reqDefault = request(defaultSource);
    const reqChinese = request(chineseSource);
    const getResult = Promise.all([reqDefault, reqChinese]);
    const [rtDefault, rtChinese] = await getResult;

    formattedData = await format(rtDefault, rtChinese);
  } else {
    const rtDefault = await request(defaultSource);
    formattedData = await format(rtDefault);
  }

  print(hostname, formattedData);
};