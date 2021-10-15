const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('root')
})

router.post('/login', function (req, res, next) {
  res.render('login')
})

router.get('/settings', function (req, res, next) {
  res.render('settings')
})

router.get('/registration', function (req, res, next) {
  res.render('signup')
})

module.exports = router
