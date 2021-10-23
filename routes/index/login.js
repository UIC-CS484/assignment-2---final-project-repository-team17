const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('settings')
  } else {
    res.render('login', { layout: 'main' })
  }
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/settings',
  failureRedirect: '/login',
  failureMessage: true
}))

module.exports = router
