const request = require('supertest')
const app = require('../../../app')
const { createAppTables } = require('../../../dao')
const { sampleUser, sampleInvalidUser } = require('../../../utils')
const path = require('path')
const fs = require('fs')

describe('Test the Registration route', () => {
  test('It should respond to the GET method', () => {
    return request(app)
      .get('/registration')
      .then((res) => {
        expect(res.text).toBeDefined()
        expect(res.text.includes('<title>Sign Up!</title>')).toBeTruthy()
      })
  }, 10000)
})

describe('POST /registration', function () {
  beforeAll(() => {
    const testDbPath = path.join(__dirname, '..', '..', '..', 'dao', 'test.sqlite')
    try {
      fs.unlinkSync(testDbPath)
    } catch (e) {
      console.error(e)
    }
    return createAppTables()
  })

  it('Should create a new user', async () => {
    const response = await request(app)
      .post('/registration')
      .send({
        email: sampleUser.email,
        username: sampleUser.username,
        password: sampleUser.password
      })

    expect(response.status).toBe(302)
    expect(response.headers.location).toBe('/settings')
  })

  it('it should reject invalid users from being created', async () => {
    const response = await request(app)
      .post('/registration')
      .send({
        email: sampleInvalidUser.email,
        username: sampleInvalidUser.username,
        password: sampleInvalidUser.password
      })

    expect(response.status).toBe(406)
    expect(response.text.includes('<title>Sign Up!</title>')).toBeTruthy()
  })
})
