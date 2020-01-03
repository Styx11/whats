// formatQuery module is used to format argvs
// when user is translating sentence
// then query is a string, exclude argvs of commander
const is_chinese = require('is-chinese');

exports.formatQuery = () => {
  let query;
  let isSent = false;
  const argvStr = process.argv.slice(2).join(' ');

  // regexp matches like '-f en', '--from en' or '-n'
  // Note: it's user's mistake to write the commander parameters in
  // the middle of the sentence to be translated, and we cannot detect it
  const commanderReg = /(\-[a-zA-Z_]|\-\-[a-zA-Z_]+)\s*([\w\-])*/ig;

  query = argvStr
    .replace(commanderReg, '')
    .trim();

  const argvs = query.split(' ');
  if (argvs.length === 1) {// a single english word will be escaped to lower case
    query = query.toLocaleLowerCase();
  } else if (argvs.length > 1) {
    isSent = true;
  }

  const isChinese = is_chinese(query);
  if (isChinese && query.length > 4) {// 最高至四字词，其余均视为句子
    isSent = true;
  }

  if (query.length > 200) {
    throw new Error('超过单次查询最大长度（200）！')
  }

  return {
    isChinese,
    isSent,
    query
  };
};