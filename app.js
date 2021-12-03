const createError = require('http-errors')
const fs = require('fs')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const homeRouter = require('./routes/movies/home')
const recordRouter = require('./routes/movies/record')
const savedRouter = require('./routes/movies/saved')
const { sessionSecret } = require('./config/config')

fs.mkdir(path.join(__dirname, 'logger'), { recursive: false }, (err) => {
  if (err && err.message && !err.message.includes('EEXIST: file already exists,')) {
    console.error(err)
  }
})

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logger', 'connections.log'), { flags: 'a' })

const app = express()
const dbChoice = process.env.JEST_WORKER_ID === undefined
  ? 'app.sqlite'
  : 'test.sqlite'

const sess = {
  secret: process.env.SESH_SECRET || sessionSecret,
  cookie: {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30
  },
  resave: true,
  saveUninitialized: true,
  store: new SQLiteStore({
    path: path.join(__dirname, 'dao', dbChoice)
  })
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
    res.locals.messages = msgs.join('<br/>')
    req.session.messages = []

    // allows accessing user from view
    res.locals.user = req.user || undefined
    next()
  })
} catch (error) {
  console.error(error)
}

app.use(express.static('public'))

// view engine setup
const viewPath = path.join(__dirname, 'views')
app.set('views', viewPath)
app.set('view engine', 'hbs')
app.set('view options', { layout: 'main.layout.hbs' })
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// setup routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/home', homeRouter)
app.use('/record',recordRouter)
app.use('/saved', savedRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  //console.log(req.url)
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
