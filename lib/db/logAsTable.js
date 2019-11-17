const Table = require('tty-table');
const { recordConfig } = require('../util/config').config;

// this module logs search result as a formatted table
module.exports = rawTuples => {
  let rows = [];
  const limit = recordConfig.limit;
  const tuples = rawTuples.slice(0, limit);
  const keys = Object.keys(tuples[0]);
  const header = keys.map(k => {
    return {
      value: k
    };
  });

  for (let t of tuples) {
    const tuple = [];
    if (rows.length === limit) break;
    for (let k of keys) {
      tuple.push(t[k]);
    }
    rows.push(tuple);
  }

  const table = Table(header, rows, {
    truncate: '..'
  });

  console.log(table.render());
};