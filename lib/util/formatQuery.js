// formatArgv module is used to format argv words
// when user is translating sentence
// then query is a string, exclude argvs of commander
const is_chinese = require('is-chinese');

exports.formatQuery = () => {
  let query;
  let isSent = false;
  const argvStr = process.argv.slice(2).join(' ');

  // regexp match like '-f en', '--from en' or '-n'
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
  if (isChinese && query.length >= 3) {// 最高至二字词，其余均视为句子
    isSent = true;
  }
  
  return {
    isSent,
    query
  };
};