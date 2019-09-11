const { URLSearchParams } = require('url');

exports.getSource = (word) => {
  const w = word;
  const key = '7558F47B1AC36021E67286D3FEBEFEEF';
  const base = 'http://dict-co.iciba.com/api/dictionary.php';

  const query = new URLSearchParams({
    w,
    key
  }).toString();

  const source = `${base}?${query}`;

  return source;
};