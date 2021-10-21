const express = require('express')
const registrationRouter = require('./registration')
const settingsRouter = require('./settings')
const loginRouter = require('./login')

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('root')
})

router.use('/login', loginRouter)

router.use('/settings', settingsRouter)

router.use('/registration', registrationRouter)

module.exports = router
