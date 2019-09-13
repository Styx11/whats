const { URLSearchParams } = require('url');
const key = '7558F47B1AC36021E67286D3FEBEFEEF';
const base = 'http://dict-co.iciba.com/api/dictionary.php';

exports.getDefaultSource = (word) => {
  const w = word;

  const query = new URLSearchParams({
    w,
    key
  }).toString();

  const source = `${base}?${query}`;

  return source;
};

exports.getChineseSource = (word) => {
  const w = word;
  const type = 'json';

  const query = new URLSearchParams({
    w,
    key,
    type
  }).toString();

  const source = `${base}?${query}`;

  return source;
}