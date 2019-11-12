const logAsTable = require('./logAsTable');
const ora = require('ora');
const {
  wordBasedSearch,
} = require('./handlers');
const { config } = require('../util/config');

module.exports = async () => {
  const { db, created } = config.dbOpts;
  const spinner = ora('请稍后...').start();

  try {

    if (!created) return spinner.warn('暂无查询结果');

    console.time('Time');

    const tuples = await wordBasedSearch(db);
    spinner.succeed('查询成功！');
    logAsTable(tuples);

    console.log('');
    console.timeEnd('Time');
    db.close();
    
  } catch (e) {
    spinner.stop('出错了！');
    db && db.close();
  }

};