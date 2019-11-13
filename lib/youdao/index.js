const { request } = require('../shared/request');
const support = require('../util/support.json');
const { config } = require('../util/config');
const getTime = require('../util/getTime');
const { getSource } = require('./source');
const { format } = require('./format');
const { print } = require('./print');
const ora = require('ora');
const {
  createDB,
  insertDB,
} = require('../db/handlers');

module.exports = async (word, from, to) => {
  const all = support.all;
  const { db, created } = config.dbOpts;
  const spinner = ora('搜索中...').start();
  const toLang = to ? all[to] : '中';
  const fromLang = from ? all[from] : '中';
  const createWrapper = () => {
    return created
      ? Promise.resolve()
      : createDB(db);
  }

  try {
    const source = getSource(word, from, to);
    const getResult = Promise.all([request(source), createWrapper()]);
    const [result] = await getResult;
    const formattedResult = format(result, fromLang, toLang);

    const o = formattedResult.orig;
    const t = formattedResult.trans;
    await insertDB(db, {
      $word: (o && o),
      $source: fromLang,
      $target: toLang,
      $result: (t ? t : '无查询结果'),
      $time: getTime(),
      $host: 'youdao'
    });
    
    db.close();
    spinner.stop();
    print(formattedResult);
  } catch (e) {
    db && db.close();
    spinner.fail(e.message || '或许是网络错误...');
  }
}