// this module contains operations of the database
const fs = require('fs');
const promisify = require('../util/promisify');

// can't find better way to check table
const tableCreated = async () => {
  let fd;
  const open = promisify(fs.open);
  const close = promisify(fs.close);

  try {
    fd = await open('./whats.sqlite', 'r');
    await close(fd);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  tableCreated,
};