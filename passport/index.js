const passport = require('passport')
const Strategy = require('passport-local')
const bcrypt = require('bcrypt')
const { getUser } = require('../dao/users')

/**
* Sets up passport to use local Strategy and serialize users
**/
function configureAuth () {
  passport.use(new Strategy(function (email, password, callback) {
    let error = null
    let user = false
    let message = { loginError: 'Incorrect username or password.' }
    getUser(email, (err, result) => {
      if (err || !result) {
        error = err
      } else if (bcrypt.compareSync(password, result.hash)) {
        user = {
          email: result.email,
          username: result.username
        }
        message = null
      }
      return callback(error, user, message)
    })
  }))

  passport.serializeUser(function (user, callback) {
    process.nextTick(function () {
      callback(null, { email: user.email, username: user.username })
    })
  })

  passport.deserializeUser(function (user, callback) {
    process.nextTick(function () {
      return callback(null, user)
    })
  })
}

module.exports = configureAuth
