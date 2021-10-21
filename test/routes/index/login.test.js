const request = require('supertest')
const app = require('../../../app')
const { createUser } = require('../../../dao/users')
const { createAppTables } = require('../../../dao')
const path = require('path')
const fs = require('fs')
const { sampleUser, sampleInvalidUser } = require('../../../utils')
describe('Test the login route', () => {
  beforeAll(() => {
    const testDbPath = path.join(__dirname, '..', '..', '..', 'dao', 'test.sqlite')
    try {
      fs.unlinkSync(testDbPath)
    } catch (e) {
      console.error(e)
    }
    return createAppTables().then(error => console.log(error))
  })

  test('It should display the login page on get requests', () => {
    return request(app)
      .get('/login')
      .expect(200)
  })

  test('It should reject invalid users from logging in', () => {
    expect(true).toBeTruthy()
    return request(app)
      .post('/login').send({
        username: sampleInvalidUser.username,
        password: sampleInvalidUser.password
      })
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.text.includes('Invalid Username or Password')).toBeTruthy()
      })
  })

  test('It should allow valid users to login logging in', async () => {
    try {
      createUser(sampleUser.email, sampleUser.password, sampleUser.username)
    } catch (error) {
      console.error(error)
    }

    expect(true).toBeTruthy()
    await request(app)
      .post('/login')
      .send({
        username: sampleUser.username,
        password: sampleUser.password
      })
      .then((res) => {
        expect(res.text.includes('<title>Settings</title>')).toBeTruthy()
      })
  })
})
