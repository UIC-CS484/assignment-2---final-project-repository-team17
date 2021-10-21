const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const session = require('express-session')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

const sess = {
  secret: '97p]_>y~#G#[dCS/',
  cookie: {}
}

app.use(session(sess))
// setup passport
try {
  app.use(passport.initialize())
  app.use(passport.session())
  require('./passport')()
} catch (error) {
  console.error(error)
}
// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
