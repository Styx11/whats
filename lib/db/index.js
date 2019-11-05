const sqlite3 = require('sqlite3');
const logAsTable = require('./logAsTable');
const ora = require('ora');
const {
  createDB,
  tableCreated,
  wordBasedSearch,
} = require('./handlers');

module.exports = async () => {
  let db;
  const sqlite = sqlite3.verbose();
  const spinner = ora('请稍后...').start();

  try {

    const created = await tableCreated();
    db = new sqlite.cached.Database('lib/db/.whats.sqlite');
    await (created || createDB(db));

    if (created) {
      console.time('Time');
      const tuples = await wordBasedSearch(db);
      spinner.succeed('查询成功！');
      logAsTable(tuples);
      console.log('');
      console.timeEnd('Time');
    } else {
      spinner.warn('无查询结果');
    }

    db.close();
    
  } catch (e) {
    spinner.stop('出错了！');
    db.close && db.close();
  }

};