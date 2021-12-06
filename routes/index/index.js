const express = require('express')
const registrationRouter = require('./registration')
const settingsRouter = require('./settings')
const loginRouter = require('./login')
const logoutRouter = require('./logout')
const homeRouter = require('./home')
const recordRouter = require('./record')
const savedRouter = require('./saved')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login')
})

router.get('/chart', function (req, res, next) {
  res.render('chart')
})

router.use('/login', loginRouter)

router.use('/logout', logoutRouter)

router.use('/settings', settingsRouter)

router.use('/registration', registrationRouter)

router.use('/home', homeRouter)
router.use('/record', recordRouter)
router.use('/saved', savedRouter)

module.exports = router
