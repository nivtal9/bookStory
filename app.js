const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
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
const {formatDate} = require('./helpers/hbs')

// viewes and hbs
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: `main`,
  helpers: { formatDate }
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

//static folder
app.use(express.static(path.join(__dirname, 'public')))

// Body parser (accept the stories after post request from stories/add)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

//adding users and dealing with sessions are in /config/passport and app.js in sessions(line 32)

app.listen(PORT)