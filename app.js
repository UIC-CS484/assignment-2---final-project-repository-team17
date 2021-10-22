const createError = require('http-errors')
const fs = require('fs')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

fs.mkdir(path.join(__dirname, 'logger'), { recursive: false }, (err) => {
  if (err.message && !err.message.includes('EEXIST: file already exists,')) {
    console.error(err)
  }
})

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logger', 'connections.log'), { flags: 'a' })

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
  // middleware to parse session messages
  app.use(function (req, res, next) {
    const msgs = req.session.messages || []
    console.log('msms', msgs)
    res.locals.messages = msgs.join('<br/>')
    req.session.messages = []
    next()
  })
} catch (error) {
  console.error(error)
}

app.use(express.static("public"));

// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'hbs')

app.use(morgan('combined', { stream: accessLogStream }))

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
