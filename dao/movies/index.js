const { connect } = require('..')
const { escape } = require('validator')
const axios = require('axios')

async function putMoviesData (movieId, email) {
  if (!movieId || !(movieId.length < 12) || !movieId.startsWith('tt')) {
    throw new Error('Invalid movidId')
  } else {
    movieId = escape(movieId)
    console.log(movieId)
  }

  const moviedataurl =
    'https://imdb-api.com/en/API/Title/k_lt7pi174/' + movieId
  const moviedata = await axios.get(moviedataurl)

  try {
    const db = await connect()
    const sql = 'INSERT INTO movielog values(?,?,?,?)'
    await db.run(sql, [
      movieId,
      email,
      moviedata.data.title,
      moviedata.data.genres
    ])
  } catch (error) {
    console.log(error)
  }
}

async function getMoviesData (email) {
  try {
    const db = await connect()
    const sql = 'SELECT * from movielog where email = ?'
    const data = await db.all(sql, [email])
    return data
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  putMoviesData,
  getMoviesData
}
