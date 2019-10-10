// log module makes sure that every sentence indents two spaces

module.exports = str => {
  console.group();
  console.log(str);
  console.groupEnd();
};