const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  if (req.isNotAuthenticated()) {
    return res.render('signup')
  } else {
    res.render('settings')
  }
})

module.exports = router
