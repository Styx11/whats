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

// this function insert a tuple into DB
// tuple = {
//   $word,
//   $source,
//   $target,
//   $result,
//   $time,
//   $host,
// }
const insertDB = (db, tuple, cb) => {

  db.serialize(() => {
    const insertSql = `
      INSERT
      INTO Whats
      VALUES ($word, $source, $target, $result, $time, $host);
    `;
    db.run(insertSql, tuple, cb);
  });

};

const wordBasedSearch = `
  SELECT Word, Count(*) Count, Source, Target, Result, Max(Time) Time
  FROM Whats
  GROUP BY Word, Source, Target, Result;
`;

module.exports = {
  createDB,
  insertDB,
  tableCreated,
  wordBasedSearch
};