const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    try {
      const apiurl = 'https://imdb-api.com/en/API/MostPopularMovies/k_lt7pi174'
      const response = await axios.get(apiurl)

      res.render('home', { response: response.data })
    } catch (error) {
      return console.log(error)
    }
  } else {
    res.redirect('signin')
  }
})

module.exports = router
