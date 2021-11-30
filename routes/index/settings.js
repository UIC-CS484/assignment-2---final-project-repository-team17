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
  console.log("req body before authenticated");
  console.log(req.body);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    getUser(req.user.email, (err, result) => {
      console.log("result")
      console.log(result);
      if (err || !result) {
        error = err
        return callback(error, user, message)
      }
      if (bcrypt.compareSync(req.body.user.oldpassword, result.hash)) {
        user = {
          email: result.email,
          username: result.username
        }
        message = null
      }
      return res.send(200);
    })
  } else {
    res.status(500)
    res.send({
      success: false
    })
  }
})

module.exports = router
