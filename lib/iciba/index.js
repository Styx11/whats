const { request } = require('../shared/request');
const { config } = require('../util/config');
const getTime = require('../util/getTime');
const ora = require('ora');

const { format } = require('./format');
const { defaultPrint } = require('./print');
const {
  getDefaultSource,
  getChineseSource,
} = require('./source');
const {
  insertDB,
  createDB,
} = require('../db/handlers');

module.exports = async query => {
  const isChinese = config.isChinese;
  const { db, created } = config.dbOpts;
  const spinner = ora('搜索中...').start();
  const defaultSource = getDefaultSource(query);
  const chineseSource = getChineseSource(query);
  const createWrapper = () => {
    return created
      ? Promise.resolve()
      : createDB(db);// returns promise
  };

  // iciba's default api doesn't have the translation for chinese to english
  // so we make another requset 'reqChinese' to get it.
  try {
    const reqDefault = request(defaultSource);
    const reqChinese = isChinese
      ? request(chineseSource)
      : Promise.resolve('');
    
    const promises = [
      reqDefault,
      reqChinese,
      createWrapper()
    ];
    const getResult = Promise.all(promises);
    const [rtDefault, rtChinese] = await getResult;
    const formattedData = await format(rtDefault, rtChinese);

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
    defaultPrint(formattedData);
    
  } catch (e) {
    const msg = e.message || '或许是网络错误...';
    spinner.fail(msg);
    db && db.close();
  }
};