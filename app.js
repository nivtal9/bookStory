const express = require('express')
const dotenv = require('dotenv')
const app=express()
const PORT =process.env.PORT||3000

dotenv.config({path: './config/config.env'})

app.get('/', (req,res) =>{
    res.send('hello world')
})

app.listen(PORT) 