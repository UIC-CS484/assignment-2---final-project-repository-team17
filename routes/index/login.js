const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('settings')
  } else {
    res.render('login')
  }
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureMessage: true
}))

module.exports = router
