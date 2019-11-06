const { request } = require('../shared/request');
const getTime = require('../util/getTime');
const is_chinese = require('is-chinese');
const { format } = require('./format');
const { print } = require('./print');
const sqlite3 = require('sqlite3');
const ora = require('ora');
const {
  getDefaultSource,
  getChineseSource,
  getSentSource,
} = require('./source');
const {
  tableCreated,
  insertDB,
  createDB,
} = require('../db/handlers');

module.exports = async (word) => {
  let db;
  let formattedData;
  const hostname = 'iciba.com';
  const sqlite = sqlite3.verbose();
  const isChinese = is_chinese(word);
  const spinner = ora('搜索中...').start();
  const defaultSource = getDefaultSource(word);
  const sentSource = getSentSource(word, isChinese);

  // iciba's default api doesn't have the translation for chinese to english
  // so we make another requset to get it.
  try {

    const created = await tableCreated();
    db = new sqlite.cached.Database('lib/db/.whats.sqlite');

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
    
    await (created || createDB(db));
    let semi;
    const k = formattedData.key;
    const e = formattedData.explains;
    await insertDB(db, {
      $word: (k && k[0]),
      $source: (isChinese ? '中' : '英'),
      $target: (isChinese ? '英' : '中'),
      $result: (e ? ((semi = e[0].indexOf('；')) > -1 ? e[0].slice(0, semi) : e[0]) : '无查询结果'),
      $time: getTime(),
      $host: 'iciba'
    });

    db.close();
    spinner.stop();
    print(hostname, formattedData);
    
  } catch (e) {
    const msg = e.message || '或许是网络错误...';
    spinner.fail(msg);
    db.close && db.close();
  }
};