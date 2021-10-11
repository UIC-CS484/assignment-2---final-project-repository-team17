const { connect } = require('../../dao')
const path = require('path')
const fs = require('fs')
const testDbPath = path.join(__dirname, '..', '..', 'dao', 'test.sqlite')

// try deleting file
try {
  fs.unlinkSync(testDbPath)
} catch (e) {
  console.error(e)
}

describe('sqlite', function () {
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
    } catch (e) {
      error = true
    } finally {
      db.close()
    }
    expect(error).toBeFalsy()
  })

  test('db allows table writes', async () => {
    const db = await connect()
    let error = false
    try {
      await db.exec('INSERT INTO tbl VALUES ("test")')
    } catch (e) {
      error = true
    } finally {
      db.close()
    }
    expect(error).toBeFalsy()
  })

  test('db allows table reads', async () => {
    const db = await connect()
    let error = false
    let result = null
    try {
      result = await db.all('SELECT * FROM tbl')
    } catch (e) {
      error = true
    } finally {
      db.close()
    }
    expect(error).toBeFalsy()
    expect(result.length > 0).toBeTruthy()
    expect(result[0].col).toBe('test')
  })
})
