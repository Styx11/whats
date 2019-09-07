const { Parser } = require('xml2js');

exports.format = async (data) => {
  const parser = new Parser();
  const { dict } = await parser.parseStringPromise(data);
  const {
    key,
    pos,
    sent,
    ps,
    acceptation
  } = dict;
  
  // 消除多余换行
  const spliter = (str) => {
    const pattern = /\r\n/g;
    return str.replace(pattern, '');
  };

  // 词义
  const meanings = Array.apply(null, {
    length: pos.length
  }).map((item, i) => {
    const acpt = spliter(acceptation[i]);
    return `${pos[i]} ${acpt}`;
  });

  // 例句
  const sents = sent.map(({ orig, trans }) => {
    return {
      orig: `${spliter(orig[0])}`,
      trans: `${spliter(trans[0])}`
    };
  });

  return {
    key,
    ps,
    meanings,
    sents
  };
};