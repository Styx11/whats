const { config } = require('../util/config');

exports.request = (source) => {
  const http = config.useIciba
    ? require('http')
    : require('https');
  
  // 请求结果Promise
  const rt = new Promise((resolve, reject) => {
    let result;
    const pattern = /undefined/;
    const req = http.get(source, res => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        res.resume();
        reject('请求错误');
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
    req.on('error', e => {
      if (e) {
        reject('或许是网络错误...')
      }
    });
    req.on('timeout', () => {
      req.abort();
      reject('请求超时');
    });
  });

  return rt;
};