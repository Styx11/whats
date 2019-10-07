const { sha256 } = require('js-sha256');
const { URLSearchParams } = require('url');

exports.getSource = (word, from, to) => {
  const q = word;
  const to = to || 'auto';
  const from = from || 'auto';
  const signType = 'v3';
  const appKey = '011d6e12f75e5792';
  const base = 'https://openapi.youdao.com/api';
  const key = 'ro6v75hegl4iI45wqfWfGoY1KyT6yHiq';
  const salt = '735fa0aa-59c8-4f04-997e-8bca4fa649e3';// UUID
  const curtime = Math.round(new Date().getTime()/1000);// Unix 时间戳
  const str = appKey + q + salt + curtime + key;

  const sign = sha256(str);

  const params = new URLSearchParams({
    q,
    to,
    from,
    appKey,
    curtime,
    salt,
    sign,
    signType
  }).toString();
  const source = `${base}?${params}`;

  return source;
}