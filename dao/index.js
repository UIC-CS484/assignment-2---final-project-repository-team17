const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

/*
* Creates connection to db depending on the environment {test or dev/production}
*/
async function connect () {
  let dbFile = 'app.sqlite'
  if (process.env.JEST_WORKER_ID !== undefined) {
    dbFile = 'test.sqlite'
    sqlite3.verbose()
  }
  const filepath = path.join(__dirname, dbFile)
  return open({
    filename: filepath,
    driver: sqlite3.Database
  })
}

/*
* Create tables required to run aoo
*/
async function createAppTables () {
  const db = await connect()
  const errors = []
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT NOT NULL PRIMARY KEY,
        hash BLOB NOT NULL,
        username TEXT UNIQUE
    );
      CREATE TABLE IF NOT EXISTS movielog (
        movieid TEXT NOT NULL,
        email TEXT NOT NULL,
        PRIMARY KEY(movieid, email)
    );`)
  } catch (error) {
    errors.push(error)
  } finally {
    db.close()
  }
  return errors
}

async function dropAppTables () {
  const db = await connect()
  const errors = []
  try {
    await db.exec(`
     DROP TABLE users;
     DROP TABLE movielog;`)
  } catch (error) {
    errors.push(error)
  } finally {
    db.close()
  }
  return errors
}

module.exports = {
  connect,
  createAppTables,
  dropAppTables
}
