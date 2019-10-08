exports.format = (data, from, to) => {
  data = JSON.parse(data);
  const {
    query,
    translation
  } = data;

  // 查询词
  const orig = query;

  // 翻译结果
  const trans = translation && translation[0];

  return {
    to,
    from,
    orig,
    trans
  };
};