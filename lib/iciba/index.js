const { request } = require('./request');
let source = 'http://dict-co.iciba.com/api/dictionary.php?key=7558F47B1AC36021E67286D3FEBEFEEF&w=&{word}';

module.exports = async (word) => {
  const result = await request(source, word);
};