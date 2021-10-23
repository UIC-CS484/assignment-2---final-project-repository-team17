const { connect, createAppTables } = require('../dao')
const validator = require('validator')
const fs = require('fs')
const path = require('path')
const sampleUser = ({
  email: 'email2@example.com',
  password: '1234theMostSe@$%#!@#curePa@$%#!@#sswordEv@$%#!@#rIsAlsoClearlyNotPlainText@$%#!@#',
  username: 'malakai'
})

const sampleInvalidUser = {
  email: '@example.com',
  username: 'hunter2',
  password: 'hunter2'
}
/**
* queries database for a specified user or the dafault test users
* @param {String} email - user email address
**/
async function getSampleUser (email) {
  if (email === undefined) {
    email = 'email@example.com'
  }

  const db = await connect()
  let fails = false; let result
  const stmt = await db.prepare('SELECT * FROM users WHERE email = ?')
  try {
    await stmt.bind({ 1: sampleUser.email })
    result = await stmt.get()
  } catch (error) {
    fails = true
  } finally {
    stmt.finalize()
    db.close()
  }

  return ({
    fails,
    result
  })
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
 * Delete test database and recreates ignores errors
 *
 */
async function resetTestDB () {
  const testDbPath = path.join(__dirname, '..', 'dao', 'test.sqlite')
  try {
    fs.unlinkSync(testDbPath)
  } catch (e) {
    console.warning('error deleting database')
  }
  await createAppTables()
}

module.exports = {
  sampleUser,
  sampleInvalidUser,
  getSampleUser,
  validateEmail,
  validateUsername,
  validatePassword,
  resetTestDB
}
