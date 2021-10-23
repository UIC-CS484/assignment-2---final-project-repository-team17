const express = require('express')
const router = express.Router()
// const createError = require('http-errors')
const { createUser } = require('../../dao/users')

router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/settings')
  } else {
    return res.render('signup')
  }
})

router.post('/', async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/settings')
  }

  await createUser(req.body.email, req.body.password, req.body.username, (error) => {
    if (error === undefined) {
      const user = {
        email: req.body.email,
        username: req.body.username
      }
      req.login(user, function (err) {
        if (err) { return next(err) }
        res.status(201).redirect('/settings')
      })
    } else if (error.error && error.error === 'User Error') {
      res.status(406).render('signup', {
        body: JSON.stringify(req.body),
        ...error
      })
    } else {
      const displayErrors = {}

      if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email') {
        displayErrors.emailError = 'This username is not available for use'
      } else if (error.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username') {
        displayErrors.emailError = 'This email is not available for use'
      } else {
        displayErrors.generalError = 'Something went wrong. Please refresh and try again.'
      }

      res.status(406).render('signup', {
        ...displayErrors
      })
    }
  })
})

module.exports = router
