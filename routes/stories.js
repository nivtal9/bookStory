const express = require('express')
const router = express.Router()
const {ensureAuth}  =require('../middleware/auth')
const Story = require('../models/Story')

router.use(ensureAuth)

router.get('/add', (req,res)=>{
    res.render('stories/add')
})

router.post('/', async (req, res) => {
    try {
      req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
    }
  })

  router.get('/', async (req, res) => {
    try {
      const stories = await Story.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean()
      res.render('stories/index', {
        stories
      })
    } catch (err) {
      console.error(err)
    }
  })
module.exports = router