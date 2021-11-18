const express = require('express')
const router = express.Router()
const { updateUser, deleteUser } = require('../../dao/users')

router.post('/', (req, res) => {
  if (req.isAuthenticated()) {
    updateUser(req.user.email, req.body, (errors, results) => {
      if (!errors) {
        res.send({
          success: true,
          updateCount: results.length
        })
        res.status(200)
      } else {
        res.send({
          success: false,
          updateCount: results.length
        })
        // TODO add error message
        res.status(500)
      }
      res.end()
    })
  } else {
    res.status(500)
    res.send({
      success: false
    })
  }
})

router.delete('/', (req, res) => {
  if (req.isAuthenticated()) {
    deleteUser(req.user.email, (error) => {
      if (!error) {
        req.session.destroy()
        req.logout()
        res.status(200)
        res.send({
          success: true
        })
      } else {
        res.status(500)
        res.send({
          success: false
        })
        // TODO add error message
      }
      res.end()
    })
  } else {
    res.status(500)
    res.send({
      success: false
    })
  }
})

module.exports = router
