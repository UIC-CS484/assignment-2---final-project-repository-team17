const express = require('express')
const router = express.Router()
const { getMoviesData } = require('../../dao/movies/index')

router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    try {
      const data = await getMoviesData(req.user.email)
      res.render('record', { data })
    } catch (error) {
      console.log(error)
    }
  } else {
    res.redirect('/login')
  }
})

module.exports = router
