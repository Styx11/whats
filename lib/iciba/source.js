const { URLSearchParams } = require('url');
const md5 = require('blueimp-md5');
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

// this module is used to get Chinese translation example
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

// this module is used to get sentence translation
exports.getSentSource = (query, isChinese) => {
  const q = query.toLocaleLowerCase();
  const appid = '20191014000341469';
  const key = '4GEOkedoeuLlSiwypAoD';
  const baidu = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
  const from = 'auto';
  const to = isChinese ? 'en' : 'zh';// to can't be auto
  const salt = '735fa0aa-59c8-4f04-997e-8bca4fa649e3';// UUID
  const str = appid + q + salt + key;

  const sign = md5(str);

  const search = new URLSearchParams({
    q,
    from,
    to,
    appid,
    salt,
    sign
  }).toString();

  const source = `${baidu}?${search}`;

  return source;
}