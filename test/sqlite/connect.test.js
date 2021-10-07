const { connect } = require('../../sqlite/connect')
const path = require('path')
const fs = require('fs')
const testDbPath = path.join(__dirname, '..', '..', 'sqlite', 'test.sqlite')

fs.unlinkSync(testDbPath)
test('db connection resolves without error', async () => {
  let error = false
  try {
    const db = await connect()
    db.close()
  } catch (e) {
    error = true
  }
  expect(error).toBeFalsy()
})

test('db allows table creation', async () => {
  const db = await connect()
  let error = false
  try {
    await db.exec('CREATE TABLE tbl (col TEXT)')
    db.close()
  } catch (e) {
    error = true
  }
  expect(error).toBeFalsy()
})

test('db allows table writes', async () => {
  const db = await connect()
  let error = false
  try {
    await db.exec('INSERT INTO tbl VALUES ("test")')
    db.close()
  } catch (e) {
    error = true
  }
  expect(error).toBeFalsy()
})

test('db allows table reads', async () => {
  const db = await connect()
  let error = false
  let result = null
  try {
    result = await db.all('SELECT * FROM tbl')
    console.table(result)
    db.close()
  } catch (e) {
    error = true
  }
  expect(error).toBeFalsy()
  expect(result.length).toBe(1)
  expect(result[0].col).toBe('test')
})
