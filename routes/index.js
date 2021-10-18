const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('root')
})

router.get('/login', function (req, res, next) {
  res.render('login')
})

router.post('/login', function (req, res, next) {
  res.render('login', { loginError: 'Invalid Credentials.' })
})

router.get('/settings', function (req, res, next) {
  res.render('settings')
})

router.get('/registration', function (req, res, next) {
  res.render('signup')
})

router.post('/registration', function (req, res, next) {
  res.render('signup', {
    unameError: 'Invalid Username',
    passwordError: 'Invalid Password',
    emailError: 'Invalid Email'
  })
})

module.exports = router
