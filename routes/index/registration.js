const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const { createUser } = require('../../dao/users')
router.get('/', function (req, res, next) {
  res.render('signup')
})

router.post('/', function (req, res, next) {
  createUser(req.email, req.password, req.username, (error, status) => {
    if (status) {
      res.status(201).render('settings')
    } else {
      res.render(createError(406))
    }

    if (error) {
      console.error(error)
    }
  })
})

module.exports = router
