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

// from zh to en
exports.chineseFormat = rawData => {
  const data = JSON.parse(rawData);
  const trans_result = data.trans_result[0] || {};

  const src = trans_result.src || '';// 翻译目标
  const dict = JSON.parse(trans_result.dict) || {};
  const word_result = dict.word_result || {};
  const simple_means = word_result.simple_means || {};

  const word_means = simple_means.word_means || [];// 后备翻译结果，防止symbols不存在
  const rawSymbols = simple_means.symbols || [];// 中文多音字对应各时态英文翻译
  // e.g:
  // 干[gān]
  //   名 shield; short for the ten Heavenly Stems; the edge of waters
  //   形 dry; waterless; empty; hollow ...
  // 干[gàn]
  //   名 trunk; main part; short for cadre ...
  const symbols = rawSymbols.map(rs => {
    const word_symbol = rs.word_symbol || '';
    const rawParts = rs.parts || [];
    const parts = rawParts.map(rp => {
      const means = rp.means.map(m => m.text || '');// simplified output
      return {
        part_name: rp.part_name,
        means
      };
    });
    return {
      word_symbol,
      parts
    };
  });
  // we may use next version
  // const zdict = word_result.zdict || {};// 详细中文释义
  // const syn_means = word_result.synthesize_means || {};// 汉英大字典

  // dst will be used when either symbols nor iciba result exist
  return {
    src,
    symbols,
    word_means
  };
};

// from sentence to zh or en
exports.sentenceFormat = rawData => {
  const data = JSON.parse(rawData);
  const trans_result = data.trans_result[0] || {};

  const src = trans_result.src || '';
  const dst = trans_result.dst || '';

  // some sentence may has dict, but for now we don't need it
  // we may use it in next version
  return {
    src,
    dst
  };
};