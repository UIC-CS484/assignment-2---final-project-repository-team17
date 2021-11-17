const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('login')
  } else {
    res.render('settings')
  }
})

module.exports = router
