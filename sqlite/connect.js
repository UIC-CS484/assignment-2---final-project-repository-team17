const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
// produce verbose logs
sqlite3.verbose()

async function connect () {
  let dbFile = 'app.sqlite'
  if (process.env.JEST_WORKER_ID !== undefined) { dbFile = 'test.sqlite' }
  const filepath = path.join(__dirname, dbFile)
  return open({
    filename: filepath,
    driver: sqlite3.Database
  })
}

module.exports = {
  connect
}
