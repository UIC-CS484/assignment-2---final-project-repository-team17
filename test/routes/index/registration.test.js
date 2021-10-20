const request = require('supertest')
const app = require('../../../app')
const { createAppTables } = require('../../../dao')
const path = require('path')
const fs = require('fs')

describe('Test the Registration route', () => {
  test('It should response the GET method', () => {
    return request(app)
      .get('/registration')
      .expect(200)
  })
})

describe('POST /registration', function () {
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

  it('it should create new users', function (done) {
    request(app)
      .post('/registration')
      .send({ uname: 'us', email: 'abc@gmail.com', password: 'abcd' })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        return done()
      })
  })
})
