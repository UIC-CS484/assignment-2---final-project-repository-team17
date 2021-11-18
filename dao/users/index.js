const { connect } = require('..')
const { validateEmail, validateUsername, validatePassword } = require('../../utils')

const bcrypt = require('bcrypt')
/**
 * Generates a table head
 * @param {String} email - user email address
 * @param {String} passwordHash - hashed user password
 * @param {String} username - (optional) username
 * @param {Function} callback - (optiona) call back: function signiture callback(Error error, Boolean status)
 */
async function createUser (email, password, username, callback) {
  let errors = {
    error: 'User Error'
  }

  if (!validateEmail(email)) {
    errors.emailError = 'Invalid email'
  }
  if (!validateUsername(username)) {
    errors.usernameError = 'Invalid username'
  }
  if (!validatePassword(password)) {
    errors.passwordError = 'This password is invalid. Passwords must meet criteria above'
  }

  if (Object.keys(errors).length <= 1) {
    const db = await connect()
    const passwordHash = await bcrypt.hash(password, 10)
    errors = undefined
    await db.run(`
      INSERT INTO users(email,hash,username)
      VALUES( :email, :hash, :username)`, {
      ':email': email,
      ':hash': passwordHash,
      ':username': username
    })
      .catch(err => { errors = err })
      .finally(() => db.close())
  }

  if (callback) {
    callback(errors)
  } else {
    if (errors) {
      throw errors
    }
  }
}

/**
 * returns user properties
 * @param {String} email - user email address
 * @param {Function} callback - (optiona) call back that returns results function signiture callback(Error error, Object user)
 */

async function getUser (email, callback) {
  let error, user

  try {
    if (validateEmail(email)) {
      user = await fetchUserFromDB(email)
    } else {
      error = Error({
        error: 'User Get error',
        message: 'Invalid email',
        data: {
          email
        }
      })
    }
  } catch (err) {
    error = err
  }
  if (callback) {
    callback(error, user)
  } else {
    if (error) { throw error } else { return user }
  }
}

/**
 * updates user properties
 * @param {String} email - user email address
 * @param {Object} updateObject - maping of properties and values to change about user {username:"malcolm22", email: "ml@example.com"}
 * @param {Function} callback - (optiona) call back: function signiture callback(Error error, Array values)
 */

async function updateUser (email, updateObject, callback) {
  if (typeof updateObject !== 'object') {
    throw new Error({
      error: 'User Update error',
      message: 'Invalid parameters',
      data: updateObject
    })
  }

  const validTypes = {
    email: validateEmail,
    username: validateUsername,
    password: validatePassword
  }

  Object.keys(updateObject).forEach((key, i) => {
    if (validTypes[key]) {
      validTypes[key](updateObject[key])
    } else {
      throw new Error({
        error: 'User Update error',
        message: 'Invalid parameters',
        data: updateObject
      })
    }
  })

  let fail = false; const results = []

  console.log(updateObject)
  if (updateObject.password) {
    updateObject.hash = await bcrypt.hash(updateObject.password, 10)
    delete updateObject.password
    results.push({
      key: 'password',
      error: undefined,
      value: 'hidden'
    })
  }
  console.log(updateObject)

  const db = await connect()
  Object.keys(updateObject).forEach(async (key, i) => {
    let error
    try {
      await db.run(`
        UPDATE users
        SET ${key} = :value
        WHERE email = :email
        `, {
        ':value': updateObject[key],
        ':email': email
      }
      )
    } catch (err) {
      fail = true
      error = err
    } finally {
      results.push({
        key,
        error,
        value: updateObject[key]
      })
    }
  })

  db.close()
  const errors = results.map(item => item.error)
  if (callback) {
    if (fail) {
      callback(errors, results)
    } else {
      callback(undefined, results)
    }
  } else {
    if (fail) { throw errors } else { return results }
  }
}

/**
 * deletes user
 * @param {String} email - user email address
 * @param {Function} callback - (optiona) call back: function signiture callback(Error error)
 * @returns {Error} errors encountered
 */
async function deleteUser (email, callback) {
  const db = await connect()
  let error
  try {
    await db.run(`
        DELETE FROM users
        WHERE email = :email
        `, {
      ':email': email
    })
  } catch (err) {
    error = err
  } finally {
    db.close()
  }
  if (callback) {
    callback(error)
  } else {
    if (error) { throw error } else { return error }
  }
}

/**
* queries database for a specified user
* @param {String} email - user email address
**/
async function fetchUserFromDB (email) {
  const db = await connect()
  let fails = false; let result
  const stmt = await db.prepare('SELECT email, username, hash FROM users WHERE email = :email')
  try {
    await stmt.bind({ ':email': email })
    result = await stmt.get()
  } catch (error) {
    fails = true
  } finally {
    stmt.finalize()
    db.close()
  }

  if (fails) {
    return undefined
  } else {
    return result
  }
}

module.exports = ({
  createUser,
  getUser,
  updateUser,
  deleteUser
})
