const express = require('express')
const router = express.Router()
const {ensureAuth}  =require('../middleware/auth')
const Story = require('../models/Story')

router.use(ensureAuth)
//show add story page
router.get('/add', (req,res)=>{
    res.render('stories/add')
})
//get the story and insert into DB and redirect to /dashboard
router.post('/', async (req, res) => {
    try {
      req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
    }
  })
  //show public stories page
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
  //show edit page according to storyid
  router.get('/edit/:id', async (req, res) => {
    try {
      const story = await Story.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!story) {
        return res.send('Story wasent found')
      }

      //checking if someone unautherized is trying to manipulate
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        res.render('stories/edit', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
    }
  })
  //showing single story (read more) page
  router.get('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate('user').lean()
  
      if (!story) {
        return res.send('Story wasent found')
      }

      //checking if someone unautherized is trying to manipulate to see private story
      if (story.user._id != req.user.id && story.status == 'private') {
        return res.send('Story wasent found')
      } else {
        res.render('stories/show', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
    }
  })

  //get the updated story and insert into DB and redirect to /dashboard
  router.put('/:id', async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.send('Story wasent found')
      }
  
      //checking if someone unautherized is trying to manipulate
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
  })  
  //delete a story
  router.delete('/:id', async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.send('Story wasent found')
      }

      //checking if someone unautherized is trying to manipulate
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
    }
  })

  //show "more from 'user'" page
  router.get('/user/:userId', async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
    }
  })

module.exports = router