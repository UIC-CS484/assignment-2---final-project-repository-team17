const { connect } = require('..')
const bcrypt = require('bcrypt')
const validator = require('validator')
/**
 * Generates a table head
 * @param {String} email - user email address
 * @param {String} passwordHash - hashed user password
 * @param {String} username - (optional) username
 * @param {Function} callback - (optiona) call back: function signiture callback(Error error, Boolean status)
 * @returns {Boolean} returns true if succesful; throws and exception or returns false otherwise
 */
async function createUser (email, password, username, callback) {
  try {
    if (!validateEmail(email)) {
      throw new Error({
        error: 'User creation error',
        message: 'Invalid email',
        data: {
          email
        }
      })
    }
    if (!validateUsername(username)) {
      throw new Error({
        error: 'User creation error',
        message: 'Invalid username',
        data: {
          username
        }
      })
    }
    if (!validatePassword(password)) {
      throw new Error({
        error: 'User creation error',
        message: 'Invalid password',
        data: {
          password: 'hidden value for security'
        }
      })
    }
  } catch (error) {
    return false
  }
  const db = await connect()
  let error
  username = username ? username !== '' : null

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    await db.run(`
    INSERT INTO users(email,hash,username)
    VALUES( :email, :hash, :username)`, {
      ':email': email,
      ':hash': passwordHash,
      ':username': username
    }
    )
  } catch (err) {
    error = err
  } finally {
    db.close()
  }

  if (callback) {
    callback(error, true)
  } else {
    if (error) { throw error } else { return true }
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
      throw new Error({
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

  if (updateObject.password) {
    updateObject.hash = await bcrypt.hash(updateObject.password, 10)
    delete updateObject.password
  }

  let fail = false; const results = []
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
 * turns true if an email is acceptable. False if not
 * based on rfc 5321 https://www.rfc-editor.org/rfc/rfc5321#section-4.5.3
 * @param {String} email - user email address
 */
function validateEmail (email) {
  if (typeof email !== 'string') {
    return false
  }

  // validate uniqueness
  if (email.length > 320) { return false }

  const emailParts = email.split('@')

  if (emailParts.length > 2) { return false }

  if (emailParts[0] > 64) { return false }

  if (emailParts[1] > 256) { return false }

  const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

  if (email.match(emailRegex)) {
    return true
  } else {
    return false
  }
}

/**
 * Validates username
 * @param {String} username - user email address
 */
function validateUsername (username) {
  if (username === null) {
    return true
  }

  if (typeof username !== 'string') {
    return false
  }
  // validate uniqueness

  // regex copied from https://stackoverflow.com/questions/3028642/regular-expression-for-letters-numbers-and#3028646
  const usernameRegex = /^[a-zA-Z0-9_.-]*$/

  if (username.length > 26) { return false }

  if (username.match(usernameRegex)) {
    return true
  } else {
    return false
  }
}

/**
 * Validates password
 * @param {String} password - user email address
 */
function validatePassword (password) {
  if (typeof password !== 'string') {
    return false
  }
  return (validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }))
}

/**
* queries database for a specified user
* @param {String} email - user email address
**/
async function fetchUserFromDB (email) {
  const db = await connect()
  let fails = false; let result
  const stmt = await db.prepare('SELECT * FROM users WHERE email = ?')
  try {
    await stmt.bind({ 1: email })
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
