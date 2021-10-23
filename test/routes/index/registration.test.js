const request = require('supertest')
const app = require('../../../app')
const { sampleUser, sampleInvalidUser, resetTestDB } = require('../../../utils')

describe('Test the Registration route', () => {
  test('It should respond to the GET method', () => {
    return request(app)
      .get('/registration')
      .then((response) => {
        expect(response.text).toBeDefined()
        expect(response.text.includes('<title>Sign up</title>')).toBeTruthy()
      })
  })
})

describe('POST /registration', function () {
  beforeAll(() => { return resetTestDB() })

  it('Should create a new user', async () => {
    await request(app)
      .post('/registration')
      .send({
        email: sampleUser.email,
        username: sampleUser.username,
        password: sampleUser.password
      })
      .expect(302)
      .expect('Location', /\/settings$/)
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
    expect(response.text.includes('<title>Sign up</title>')).toBeTruthy()
  })
})
