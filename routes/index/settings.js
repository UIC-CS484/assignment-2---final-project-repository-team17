const express = require('express')
const router = express.Router()
const { getUser} = require('../../dao/users')
const bcrypt = require('bcrypt')

router.get('/', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('login')
  } else {
    res.render('settings')
  }
})

router.post('/', (req, res) => {
  res.set({ 'content-type': 'application/json; charset=utf-8' })
  if (req.isAuthenticated()) {
    getUser(req.user.email, (err, user) => {
      if (err || !user) {
        res.status(500).end()
      } else if (bcrypt.compareSync(req.body.user.oldpassword, user.hash)) {
        res.status(200).end()
      } else {
        res.status(500).end()
      }
    })
  } else {
    res.status(401).end()
  }
})

module.exports = router
