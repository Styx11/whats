// normalize is used to normalize the test color
// useIciba is used to find out wheather require 'http' or 'https'

exports.config = {
  normalize: false,
  useIciba: true,
  say: false,
  dbOpts: Object.create(null),
  recordConfig: {
    limit: 6
  }
};