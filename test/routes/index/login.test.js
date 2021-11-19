const request = require('supertest')
const app = require('../../../app')
const { createUser } = require('../../../dao/users')
const { sampleUser, resetTestDB } = require('../../../utils')
describe('Test the login route', () => {
  beforeAll(() => { return resetTestDB() })
  afterAll(() => {return resetTestDB() })

  test('It should display the login page on get requests', () => {
    return request(app)
      .get('/login')
      .expect(200)
  })

  test('It should reject invalid users from logging in', async () => {
    return request(app)
      .post('/login').send({
        email: 'validemail@email.com',
        password: 'incorrect Password'
      })
      .expect(302)
      .expect('Location', /\/login$/)
  })

  test('It should allow valid users to login logging in', async () => {
    try {
      await createUser(sampleUser.email, sampleUser.password, sampleUser.username)
    } catch (error) {
      expect(error).not.toBeDefined()
    }
    return request(app)
      .post('/login')
      .send({
        email: sampleUser.email,
        password: sampleUser.password
      })
      .expect(302)
      .expect('Location', /\/settings$/)
  })
})
