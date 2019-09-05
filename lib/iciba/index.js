const { request } = require('./request');

module.exports = async (word) => {
  const result = await request(word);
  console.log(result);
};