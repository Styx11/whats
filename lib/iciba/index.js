const { request } = require('./request');
const { format } = require('./format');

module.exports = async (word) => {
  let source = `http://dict-co.iciba.com/api/dictionary.php?key=7558F47B1AC36021E67286D3FEBEFEEF&w=${word}`;

  const result = await request(source);
  const formattedData = await format(result);
};