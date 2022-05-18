const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const connectDB= require('./config/db')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const PORT = process.env.PORT||3000

const app=express()

//environment configuration
dotenv.config({path: './config/config.env'})

//passport configuration 
require('./config/passport')(passport);

connectDB()

// viewes and hbs
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout:`main`}));
app.set('view engine', '.hbs');
app.set('views', './views');

//sessions : https://www.npmjs.com/package/express-session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require ('./routes/index'))
app.use('/auth', require ('./routes/auth'))

app.get('/', (req,res) =>{
    res.send('hello world')
})

app.listen(PORT) 