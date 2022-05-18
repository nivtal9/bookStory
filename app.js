const express = require('express')
const dotenv = require('dotenv')
const app=express()
const connectDB= require('./config/db')
const PORT =process.env.PORT||3000

dotenv.config({path: './config/config.env'})

connectDB()

app.get('/', (req,res) =>{
    res.send('hello world')
})

app.listen(PORT) 