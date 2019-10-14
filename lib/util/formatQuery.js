// formatArgv module is used to format argv words
// when user is translating sentence
// query is a string, exclude argvs of commander

exports.formatQuery = () => {
  let query;
  const argvStr = process.argv.slice(2).join(' ');

  // regexp match like '-f en', '--from en' or '-n'
  const commanderReg = /(\-[a-zA-Z_]|\-\-[a-zA-Z_]+)\s*([\w\-])*/ig;

  query = argvStr
    .replace(commanderReg, '')
    .trim();

  const argvs = query.split(' ');
  if (argvs.length === 1) {
    query = query.toLocaleLowerCase();
  }
  
  return query;
};