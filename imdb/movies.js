const { httpsRequest } = require('../utils')
const top250MoviesMock = require('./mock/top250Movies.json')

async function getTop250Movies () {
  if (process.env.NODE_ENV) {
    return httpsRequest('imdb-api.com', '/en/API/Top250Movies/k_qukpmeuf')
      .catch(error => {
        throw error
      })
  } else {
    return new Promise((resolve, reject) => {
      resolve(JSON.stringify(top250MoviesMock))
    })
  }
}

module.exports = {
  getTop250Movies
}
