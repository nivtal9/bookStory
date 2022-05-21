const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
/* 
method override is to help us do multiple post requests to the DB 
(if we create a story and if we edit a story we will come to the same DB so thats why we need the override)
*/
const methodOverride= require('method-override')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const PORT = process.env.PORT || 3000
const app = express()

//environment configuration
dotenv.config({
  path: './config/config.env'
})

//passport configuration 
require('./config/passport')(passport);

connectDB()

// hbs Helpers
const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/hbs')

// viewes and hbs
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: `main`,
  helpers: { formatDate, truncate, stripTags, editIcon, select }
}));
app.set('view engine', '.hbs');
app.set('views', './views');

//sessions : https://www.npmjs.com/package/express-session
//store: is for saving sessions in mongoDB 
//(if server refreshing the user gets to the login page when he use already logged in)
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  })
)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var (also middleware)
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))

// Body parser (accept the stories after post request from stories/add)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

//adding users and dealing with sessions are in /config/passport and app.js in sessions(line 32)

app.listen(PORT)