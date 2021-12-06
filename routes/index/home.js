const express = require('express')
const router = express.Router()
const MostPopularMovies = require('../../dao/movies/mostPopularMovies.json')
router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    try {
      res.render('home', { response: MostPopularMovies })
    } catch (error) {
      return console.log(error)
    }
  } else {
    res.redirect('signin')
  }
})

module.exports = router
