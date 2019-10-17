const { Parser } = require('xml2js');

exports.format = async (rtDefault, rtSent, rtChinese = '') => {
  const parser = new Parser();
  const { dict } = await parser.parseStringPromise(rtDefault);
  const {
    key,
    pos,
    sent,
    acceptation
  } = dict;
  let { ps } = dict;
  let isSent = false;// if use baidu translation, it's sentence then

  // iciba may not have translation of sentence
  const {
    trans_result
  } = JSON.parse(rtSent);
  const sentTrans = trans_result && trans_result[0] && trans_result[0].dst;

  let parts, psChinese;

  if (rtChinese) {
    rtChinese = JSON.parse(rtChinese).symbols[0];
    parts = rtChinese.parts
    psChinese = rtChinese.word_symbol;
    ps = psChinese ? [psChinese] : '';
  }

  const notFound = !ps && !pos && !sent && !acceptation && !sentTrans;
  if (notFound) {
    throw new Error('未找到查询结果');
  }

  // 消除多余换行
  const spliter = (str) => {
    const pattern = /\r\n/g;
    return str.replace(pattern, '');
  };

  // 词义
  let explains;
  if (rtChinese) {
    explains = parts && parts[0].means.map(c => {
      return `${c.word_mean}`;
    });
  } else {
    explains = pos && pos[0] && Array.apply(null, {
      length: pos.length
    }).map((item, i) => {
      const acpt = spliter(acceptation[i]);
      return `${pos[i]} ${acpt}`;
    });
  }
  if (!explains) {
    isSent = true;
    explains = sentTrans && [sentTrans];
  }
  
  // 例句
  const sents = sent && sent.map(({ orig, trans }) => {
    return {
      orig: `${spliter(orig[0])}`,
      trans: `${spliter(trans[0])}`
    };
  });

  return {
    ps,
    key,
    sents,
    isSent,
    explains
  };
};