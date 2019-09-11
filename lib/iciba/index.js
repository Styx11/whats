const { getSource } = require('./source');
const { request } = require('./request');
const { format } = require('./format');
const { print } = require('./print');
const { URL } = require('url');

module.exports = async (word) => {
  let source = getSource(word);
  const { hostname } = new URL(source);
  const result = await request(source);
  const formattedData = await format(result);
  
  print(hostname, formattedData);
};