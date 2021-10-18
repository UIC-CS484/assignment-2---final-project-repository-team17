const { connect } = require('../dao')

const sampleUser = ({
  email: 'email@example.com',
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

module.exports = {
  sampleUser,
  sampleInvalidUser,
  getSampleUser
}
