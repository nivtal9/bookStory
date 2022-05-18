const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const connectDB= require('./config/db')
const exphbs = require('express-handlebars')
const PORT =process.env.PORT||3000

//environment configuration
dotenv.config({path: './config/config.env'})

const app=express()

connectDB()

// viewes and hbs
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout:`main`}));
app.set('view engine', '.hbs');
app.set('views', './views');

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require ('./routes/index'))

app.get('/', (req,res) =>{
    res.send('hello world')
})

app.listen(PORT) 