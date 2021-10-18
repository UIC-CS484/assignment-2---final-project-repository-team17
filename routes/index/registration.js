const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('signup')
})

router.post('/', function (req, res, next) {
  res.render('signup', {
    unameError: 'Invalid Username',
    passwordError: 'Invalid Password',
    emailError: 'Invalid Email'
  })
})

module.exports = router
