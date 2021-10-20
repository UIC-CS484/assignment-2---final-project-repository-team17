const express = require('express')
const router = express.Router()
// const createError = require('http-errors')
const { createUser } = require('../../dao/users')

router.get('/', function (req, res, next) {
  res.render('signup')
})

router.post('/', async (req, res, next) => {
  await createUser(req.body.email, req.body.password, req.body.username, (error) => {
    if (error === undefined) {
      res.status(201).render('settings')
    } else if (error.error && error.error === 'User Error') {
      console.error('user error', error)
      res.status(406).render('signup', {
        body: JSON.stringify(req.body),
        ...error
      })
    } else {
      console.error('sql error', error)
      const displayErrors = parseSQlErrors(error)
      res.status(406).render('signup', {
        ...displayErrors
      })
    }
  })
})

function parseSQlErrors (error) {
  const display = {}

  if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email') {
    display.emailError = 'This username is not available for use'
  } else if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username') {
    display.emailError = 'This email is not available for use'
  } else {
    display.generalError = 'Something went wrong. Please refresh and try again.'
  }

  return display
}
module.exports = router
