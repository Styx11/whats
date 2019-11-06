const { request } = require('../shared/request');
const support = require('../util/support.json');
const getTime = require('../util/getTime');
const { getSource } = require('./source');
const { format } = require('./format');
const { print } = require('./print');
const sqlite3 = require('sqlite3');
const ora = require('ora');
const {
  tableCreated,
  createDB,
  insertDB,
} = require('../db/handlers');

module.exports = async (word, from, to) => {
  let db;
  const all = support.all;
  const spinner = ora('搜索中...');
  const sqlite = sqlite3.verbose();
  const toLang = to ? all[to] : '中';
  const fromLang = from ? all[from] : '中';
  spinner.start();

  try {
    const created = await tableCreated();
    const source = getSource(word, from, to);
    const result = await request(source);
    const formattedResult = format(result, fromLang, toLang);

    const o = formattedResult.orig;
    const t = formattedResult.trans;
    db = sqlite.cached.Database('lib/db/.whats.sqlite');
    await (created || createDB(db));
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
    db.close && db.close();
    spinner.fail(e.message || '或许是网络错误...');
  }
}