const { ExpectationFailed } = require("http-errors");
const request = require("supertest");
const app = require("../../../app");

describe("Test the Registration route", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/registration")
      .expect(200);
  });
});

describe('POST /registration', function() {
  it('Test the registration post', function(done) {
    request(app)
      .post('/registration')
      .send({ uname: "john green", email:"abc@gmail.com", password:"abcd" })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});

