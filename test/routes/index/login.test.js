const {loginError} = require("http-errors");

const request = require("supertest");
const app = require("../../../app");

describe("Test the login route", () => {
  test("It should login the user as POST", () => {
    return request(app)
      .post("/login")
      .expect(200);
  });
});

describe("Test the login route", () => {
    test("It should login the user as GET", () => {
      return request(app)
        .get("/login")
        .expect(200);
    });
  });

describe('testing for invalid credentials', function(){
    it('Invalid Credentials.', async()=>{
      const res = await request(app).post('/login').send({username:'abcd',password:'1234'});
      expect(res.statusCode).toEqual(200);
    })
});