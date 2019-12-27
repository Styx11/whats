// normalize is used to normalize the test color
// useIciba is used to find out wheather require 'http' or 'https'

exports.config = {
  isChinese: false,// is query Chinese
  useIciba: true,// decide whether to use iciba (request scheme http or https)
  say: false,// using say command
  chalk: Object.create(null),// chalk which normalized with -n command
  dbOpts: Object.create(null),// include db instance, created -- is db been created
  recordConfig: {
    limit: 6
  },
  availRows: process.stdout.rows - 3// available rows without overflow (for iciba sents log)
};