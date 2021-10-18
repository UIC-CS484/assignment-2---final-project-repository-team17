const request = require('supertest')
const app = require('../../../app')
const { createUser } = require('../../../dao/users')
const { createAppTables } = require('../../../dao')
const path = require('path')
const fs = require('fs')

const sampleInvalidUser = {
  username: 'gibefdfdsfdsdf',
  password: 'password'
}

const sampleValidUser = {
  email: 'validUS@example.com',
  username: 'validUS',
  password: 'Hunter!@#!@%#@R#WDSasdsdd34'
}

describe('Test the login route', () => {
  beforeAll(() => {
    const testDbPath = path.join(__dirname, '..', '..', '..', 'dao', 'test.sqlite')
    console.log(testDbPath)
    try {
      fs.unlinkSync(testDbPath)
    } catch (e) {
      console.error(e)
    }
    return createAppTables().then(error => console.log(error))
  })

  test('It should login the user as GET', () => {
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
        expect(res.text.includes('Invalid Credentials')).toBeTruthy()
      })
  })

  test('It should allow valid users to login logging in', async () => {
    const error = false
    try {
      createUser(sampleValidUser.email, sampleValidUser.password, sampleValidUser.username)
    } catch (error) {
      console.error(error)
    }

    expect(true).toBeTruthy()
    await request(app)
      .post('/login')
      .send({
        username: sampleValidUser.username,
        password: sampleValidUser.password
      })
      .then((res) => {
        expect(res.text.includes('<title>Settings</title>')).toBeTruthy()
      })
    expect(error).toBeFalsy()
  })
})

describe('testing for invalid credentials', function () {
  it('Invalid Credentials.', async () => {
    const res = await request(app).post('/login').send({ username: 'abcd', password: '1234' })
    expect(res.statusCode).toEqual(200)
  })
})
