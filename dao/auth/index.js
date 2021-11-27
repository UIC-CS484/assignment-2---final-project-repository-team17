const { connect } = require('..')
const { lockoutTime, maxLoginAttempts } = require('../../config/config')
/**
 * Creates log entry
 * @param {String} email - user email address
 * @param {Boolean} status - success status
 * @param {Function} callback - (optiona) call back: function signiture callback(Error error, Boolean status)
 */
async function createLog (email, status, callback) {
  let errors

  const db = await connect()

  await db.run(`
      INSERT INTO login_logs(email,status,timestamp)
      VALUES( :email, :status, :timestamp)`, {
    ':email': email,
    ':status': status ? 1 : 0,
    ':timestamp': new Date().getTime() + lockoutTime
  })
    .catch(err => { errors = err })
    .finally(() => {
      db.close()
    })

  if (callback) {
    callback(errors)
  } else {
    if (errors) {
      throw errors
    }
  }
}

/**
 * gets revelevant logs that might trigger a lockout
 * @param {String} email - user email address
 * @param {Function} callback - (optiona) call back that returns results function signiture callback(Error error, Object user)
 */
async function getLogs (email) {
  const timeout = new Date().getTime()
  const db = await connect()
  let fails = false; let result
  const stmt = await db.prepare(`
    SELECT email, status, timestamp
    FROM login_logs
    WHERE email = :email
    AND status = 0
    AND timestamp > :timeout
    LIMIT :attemptCount
  `)
  try {
    await stmt.bind({
      ':email': email,
      ':timeout': timeout,
      ':attemptCount': maxLoginAttempts
    })
    result = await stmt.all()
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
  createLog,
  getLogs
})
