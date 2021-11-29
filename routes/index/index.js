const express = require('express')
const registrationRouter = require('./registration')
const settingsRouter = require('./settings')
const loginRouter = require('./login')
const logoutRouter = require('./logout')
const cors=require('cors')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login')
})


router.get('/chart', cors(),function (req, res, next) {
  res.render('chart')
})


const whitelist = ['http://localhost:3000/*', 'https://trackitup.net/*']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  }
}

const corsConfig = {
  origin: ["https://trackitup.net/*", "http://localhost:3000/*"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type']
};

router.use(cors(corsConfig));

router.use('/login', loginRouter)

router.use('/logout', logoutRouter)

router.use('/settings', settingsRouter)

router.use('/registration', registrationRouter)

module.exports = router
