const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest}  =require('../middleware/auth')
const Story = require('../models/Story')

router.get('/', ensureGuest, (req,res)=>{
    res.render('login', {
        layout: 'login'
    })
})

router.get('/dashboard',ensureAuth, async (req,res)=>{
    try {
        //.lean is to "stringify" mongooseDocument to JS compatiable
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
          name: req.user.firstName,
          stories,
        })
      } catch (err) {
        console.error(err)
      }
    })

module.exports = router