const express = require('express')
const statsRouter = require('./stats')
const router = express.Router()

router.use('/stats', statsRouter)

module.exports = router
