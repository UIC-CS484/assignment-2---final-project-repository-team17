const { connect } = require('..')
const { escape } = require('validator')
const axios = require('axios')

async function putMoviesData (movieId, email) {
  if (!movieId || !(movieId.length < 12) || !movieId.startsWith('tt')) {
    throw new Error('Invalid movidId')
  } else {
    movieId = escape(movieId)
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

async function getMoviesData (email, callback) {
  let error, data

  try {
    const db = await connect()
    const sql = 'SELECT * from movielog where email = ?'
    data = await db.all(sql, [email])
  } catch (err) {
    console.error(err)
    error = err
  }

  if (callback) {
    callback(error, data)
  } else {
    if (error) {
      throw (error)
    } else {
      return data
    }
  }
}

async function getAllMoviesData (email, callback) {
  let error, data

  try {
    const db = await connect()
    const sql = 'SELECT * from movielog'
    data = await db.all(sql)
  } catch (err) {
    console.error(err)
    error = err
  }

  if (callback) {
    callback(error, data)
  } else {
    if (error) {
      throw (error)
    } else {
      return data
    }
  }
}

module.exports = {
  putMoviesData,
  getMoviesData,
  getAllMoviesData
}
