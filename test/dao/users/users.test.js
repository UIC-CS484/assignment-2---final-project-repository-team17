const { createAppTables } = require('../../../dao')
const { createUser, getUser, updateUser, deleteUser } = require('../../../dao/users')
const { sampleUser, getSampleUser } = require('../../../utils')
const bcrypt = require('bcrypt')

describe('DAO Users', function () {
  test('creates user table', async () => {
    const errors = await createAppTables()
    expect(errors).toStrictEqual([])
  })

  test('creates user', async () => {
    let error
    await createUser(sampleUser.email, sampleUser.password, sampleUser.username, (error) => {
      if (error) {
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
      expect(sampleUser.email).toBe(result.email)
      expect(sampleUser.username).toBe(result.username)
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
