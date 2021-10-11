const { connect, createAppTables } = require('../../../dao')
const { createUser, getUser, updateUser, deleteUser } = require('../../../dao/users')
const bcrypt = require('bcrypt')

const sampleUser = ({
  email: 'email@example.com',
  password: 'theMostSecurePasswordEverIsAlsoClearlyNotPlainText',
  username: null
})

/**
* queries database for a specified user or the dafault test users
* @param {String} email - user email address
**/
async function getSampleUser (email) {
  if (email === undefined) {
    email = 'email@example.com'
  }

  const db = await connect()
  let fails = false; let result
  const stmt = await db.prepare('SELECT * FROM users WHERE email = ?')
  try {
    await stmt.bind({ 1: sampleUser.email })
    result = await stmt.get()
    expect(result).toBeDefined()
  } catch (error) {
    fails = true
  } finally {
    stmt.finalize()
    db.close()
  }

  return ({
    fails,
    result
  })
}

describe('DAO Users', function () {
  test('creates user table', async () => {
    const errors = await createAppTables()
    expect(errors).toStrictEqual([])
  })

  test('creates user', async () => {
    let error
    await createUser(sampleUser.email, sampleUser.password, sampleUser.username, (error) => {
      if (error) {
        console.error(error)
        error = true
      } else {
        error = false
      }
    })
    expect(error).toBeFalsy()

    const { fails, result } = await getSampleUser()
    expect(fails).toBeFalsy()
    expect(result).toBeDefined()
  })

  test('fetch User infomation', async () => {
    await getUser(sampleUser.email, (error, result) => {
      expect(error).toBeUndefined()
      expect(result).toBeDefined()
      expect(sampleUser.email === result.email).toBeTruthy()
      expect(sampleUser.username === result.username).toBeTruthy()
    })
  })

  test('secure password storage', async () => {
    const { fails, result } = await getSampleUser()
    if (!fails) {
      await bcrypt.compare(sampleUser.password, result.hash).then(function (result) {
        expect(result).toBeTruthy()
      })
    }
  })

  test('updates user infomation', async () => {
    await updateUser(sampleUser.email, { username: 'malcolm22' }, (error) => {
      expect(error).toBeFalsy()
    })
    const { fails, result } = await getSampleUser()
    expect(fails).toBeFalsy()
    expect(result).toBeDefined()
    expect(result.username).toBe('malcolm22')
  })

  test('delete User infomation', async () => {
    await deleteUser(sampleUser.email)
    const { fails, result } = await getSampleUser()
    expect(fails).toBeFalsy()
    expect(result).toBeUndefined()
  })
})
