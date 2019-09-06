const http = require('http');
let source = 'http://dict-co.iciba.com/api/dictionary.php?key=7558F47B1AC36021E67286D3FEBEFEEF&w=&{word}';

exports.request = (word) => {
  source = source.replace(/\&\{word\}/, word);
  
  // 请求结果Promise
  const rt = new Promise((resolve, reject) => {
    let result;
    const pattern = /undefined/;
    const request = http.get(source, res => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        res.resume();
        reject();
      }
      res.setEncoding('utf8');
      res.on('data', data => {
        result += data;
      });
      res.on('end', () => {
        result = result.split(pattern).join('');
        resolve(result);
      });
    });
    request.on('error', e => console.error(e));
  });

  return rt;
};