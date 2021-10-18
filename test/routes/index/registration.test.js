const request = require('supertest')
const app = require('../../../app')
const { createAppTables } = require('../../../dao')
const { sampleUser, sampleInvalidUser } = require('../../../utils')
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

  it('it should create new users', async (done) => {
    return request(app)
      .post('/registration')
      .send({ ...sampleUser })
      // 201 Created
      .expect(201)
      .then((err, res) => {
        expect(err).not.toBeDefined()
        expect(res.text.contains('<title>Settings</title>')).toBeTruthy()
      })
  })

  it('it should reject invalid users from being created', async (done) => {
    return request(app)
      .post('/registration')
      .send({ ...sampleInvalidUser })
      // 406 Not Acceptable
      .expect(406)
  })
})
