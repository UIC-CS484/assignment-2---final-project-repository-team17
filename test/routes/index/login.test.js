const request = require('supertest')
const app = require('../../../app')
const { createUser } = require('../../../dao/users')
const { createAppTables } = require('../../../dao')
const path = require('path')
const fs = require('fs')
const { sampleUser } = require('../../../utils')
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
        email: 'validemail@email.com',
        password: 'incorrect Password'
      })
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.text.includes('<p>Incorrect username or password.</p>')).toBeTruthy()
      })
  })

  test('It should allow valid users to login logging in', async () => {
    try {
      createUser(sampleUser.email, sampleUser.password, sampleUser.username)
    } catch (error) {
      expect(error).not.toBeDefined()
    }

    expect(true).toBeTruthy()
    await request(app)
      .post('/login')
      .send({
        email: sampleUser.email,
        password: sampleUser.password
      })
      .then((res) => {
        expect(res.status).toBe(201)
        expect(res.text.includes('<title>Settings</title>')).toBeTruthy()
      })
  })
})
