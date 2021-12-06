const express = require('express')
const router = express.Router()
const { getAllMoviesData } = require('../../dao/movies')

function parseData(data) {
  const genres = {}

  data.forEach(entry => {
    entry.genre.split(',').forEach(genre => {
      // strip string
      genre = genre.replace(/^\s+|\s+$/g, '')

      const upperGenre = genre.toUpperCase()
      if (!genres[upperGenre]) {
        genres[upperGenre] = {
          name: genre,
          count: 1
        }
      } else {
        genres[upperGenre].count += 1
      }
    })
  })
  return Object.values(genres)
}

router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    getAllMoviesData(req.user.email, (error, data) => {
      if (!error) {
        res.status(200).json(parseData(data))
      } else {
        res.status(500).end()
      }
    })
  } else {
    res.redirect('signin')
  }
})

module.exports = router
