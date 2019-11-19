// this module contains operations of the database
const fs = require('fs');

// can't find better way to check table exists
// To prevent file opening and closing problems, use readFile instead
const tableCreated = path => {
  const p = new Promise((res, rej) => {
    fs.readFile(path, (err, buf) => {
      if (err) {
        return rej(err);
      }
      res(buf.length > 0);
    });
  });
  return p;
};

// totally drop the db, because we need to know whether table were created next time
const dropDB = path => {
  const p = new Promise((res, rej) => {
    fs.writeFile(path, '', err => {
      if (err) {
        return rej(err);
      }
      res(true);
    });
  });
  return p;
};

// create the database
// under the premise that it's firstly creating
const createDB = db => {
  const createSql = `CREATE TABLE Whats (
    Word TEXT NOT NULL,
    Source TEXT NOT NULL,
    Target TEXT NOT NULL,
    Result TEXT,
    Time DATE NOT NULL UNIQUE,
    Host TEXT NOT NULL,
    Primary key (word, time)
  );`;
  const p = new Promise((res, rej) => {
    db.run(createSql, err => {
      if (err) {
        return rej(err);
      }
      return res();
    })
  });
  return p;
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
const insertDB = (db, tuple) => {
  const insertSql = `
    INSERT
    INTO Whats
    VALUES ($word, $source, $target, $result, $time, $host);
  `;
  const p = new Promise((res, rej) => {
    db.run(insertSql, tuple, err => {
      if (err) {
        return rej(err);
      }
      return res();
    });
  });
  return p;
};

// search db based on word
const wordBasedSearch = db => {
  const sql = `
    SELECT Word, Count(*) Count, Result, Source, Target, Max(Time) Time
    FROM Whats
    GROUP BY Word, Source, Target, Result
    ORDER BY Time DESC;
  `;
  const p = new Promise((res, rej) => {
    db.all(sql, (err, tuples) => {
      if (err) {
        return rej(err);
      }
      return res(tuples);
    });
  });
  return p;
};

module.exports = {
  dropDB,
  createDB,
  insertDB,
  tableCreated,
  wordBasedSearch,
};