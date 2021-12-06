const express = require('express')
const { putMoviesData } = require('../../dao/movies/index')
const router = express.Router()

router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    try {
      putMoviesData(req.query.mid, req.user.email)
      res.redirect('home')
    } catch (error) {
      res.status(500).redirect('home')
    }
  } else {
    res.redirect('signin')
  }
})

module.exports = router
