const { request } = require('../shared/request');
const support = require('../util/support.json');
const { getSource } = require('./source');
const { format } = require('./format');
const { print } = require('./print');
const ora = require('ora');

module.exports = async (word, from, to) => {
  const all = support.all;
  const spinner = ora('搜索中...');
  const toLang = to ? all[to] : '中';
  const fromLang = from ? all[from] : '中';
  spinner.start();

  try {
    const source = getSource(word, from, to);
    const result = await request(source);
    const formattedResult = format(result, fromLang, toLang);

    spinner.stop();
    print(formattedResult);
  } catch (e) {
    spinner.fail(e.message || '或许是网络错误...');
  }
}