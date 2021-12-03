const passport = require('passport')
const Strategy = require('passport-local')
const bcrypt = require('bcrypt')
const { getUser } = require('../dao/users')
const { getLogs, createLog } = require('../dao/auth')
const { maxLoginAttempts } = require('../config/config')
/**
* Sets up passport to use local Strategy and serialize users
**/
function configureAuth () {
  passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function (email, password, callback) {
    let error = null
    let user
    let message = { message: 'Incorrect username or password.' }
    const logs = await getLogs(email)

    if (logs && logs.length >= maxLoginAttempts) {
      message = { message: 'This account is unavailable for login.' }
      return callback(error, undefined, message)
    }

    getUser(email, async (err, result) => {
      if (err || !result) {
        error = err
        createLog(email, false, (err) => {
          if (err) { console.error(error) }
        })
        return callback(error, user, message)
      }
      if (bcrypt.compareSync(password, result.hash)) {
        user = {
          email: result.email,
          username: result.username
        }
        createLog(email, true, (err) => {
          if (err) { console.error(error) }
        })
      } else {
        console.error('bad pass')
        createLog(email, false, (err) => {
          if (err) { console.error(error) }
        })
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
