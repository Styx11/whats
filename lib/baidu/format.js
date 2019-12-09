// format module of baidu formatting en to zh, zh to en and sentence translation result
// we use:
// en to zh's exchanges
// zh to en's explains and example sentence because it's more accurate
// from en to zh
exports.defaultFormat = rawData => {
  const data = JSON.parse(rawData);
  const trans_result = data.trans_result[0];// 总翻译结果
  const dict = JSON.parse(trans_result.dict);// 词典
  const word_result = dict.word_result || {};
  const simple_means = word_result.simple_means || {};
  const exchange = simple_means.exchange || {};// 各时态

  const tags = simple_means.tags.core || [];// core: [ '高考', 'CET4', '考研' ], 代替hostWords
  const dst = trans_result.dst || '';
  const {
    word_third,
    word_ing,
    word_done,
    word_pl,
    word_past,
  } = exchange;
  const third = {tense: '第三人称单数', exchange: (word_third || [])};
  const done = {tense: '过去分词', exchange: (word_done || [])};
  const past = {tense: '过去式', exchange: (word_past || [])};
  const ing = {tense: '现在分词', exchange: (word_ing || [])};
  const pl = {tense: '复数', exchange: (word_pl || [])};

  const exchanges = [
    third,
    pl,
    ing,
    past,
    done
  ];

  return {
    dst,
    tags,
    exchanges
  };
};
