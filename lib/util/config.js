// normalize is used to normalize the test color
// useIciba is used to find out wheather require 'http' or 'https'

exports.config = {
  normalize: false,// normalize text color in terminal
  useIciba: true,// decide whether to use iciba
  isSent: false,// is translation src a sentence
  say: false,// using say command
  dbOpts: Object.create(null),// include db instance, created -- is db been created
  recordConfig: {
    limit: 6
  }
};