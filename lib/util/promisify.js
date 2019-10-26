// takes a function following the common error-first callback style, 
// i.e. taking an (err, value) => ... callback as the last argument,
// returns a version that returns promises.

module.exports = (orig) => {
  return (...args) => {
    const p = new Promise((res, rej) => {
      orig(...args, (err, result) => {
        if (err) {
          return rej(err);
        }
        return res(result);
      });
    });
    return p;
  }
};