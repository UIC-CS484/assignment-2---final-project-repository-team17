const express = require('express')
const router = express.Router()
const MostPopularMovies = require('../../dao/movies/mostPopularMovies.json')
router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    res.render('home', { response: MostPopularMovies })
  } else {
    res.redirect('signin')
  }
})

module.exports = router
