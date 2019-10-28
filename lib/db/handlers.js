// this module contains operations of the database
const fs = require('fs');
const promisify = require('../util/promisify');

// can't find better way to check table
const tableCreated = async () => {
  let fd;
  const open = promisify(fs.open);
  const close = promisify(fs.close);

  try {
    fd = await open('./.whats.sqlite', 'r');
    await close(fd);
    return true;
  } catch (e) {
    return false;
  }
};

// create the database
// under the premise that it's firstly creating
const createDB = (db, cb) => {
  
  db.serialize(() => {
    const createSql = `CREATE TABLE Whats (
      Word TEXT NOT NULL,
      Source TEXT NOT NULL,
      Target TEXT NOT NULL,
      Result TEXT,
      Time DATE NOT NULL UNIQUE,
      Host TEXT NOT NULL,
      Primary key (word, time)
    );`;
    db.run(createSql, cb);
  });

};

module.exports = {
  createDB,
  tableCreated,
};