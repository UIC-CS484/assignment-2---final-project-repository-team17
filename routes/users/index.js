const express = require('express')
const router = express.Router()
const { updateUser } = require('../../dao/users')

router.post('/', (req, res) => {
  if (req.isAuthenticated()) {
    updateUser(req.user.username, req.body, (errors) => {
      if (!errors) {
        res.status(200)
      } else {
        // TODO add error message
        res.status(500)
      }
      res.redirect('settings')
    })
  } else {
    res.render('login')
  }
})

module.exports = router
