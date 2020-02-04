const Message = require('../models/message')

const { check, body, validationResult } = require('express-validator')

exports.list = async (req, res) => {
  const messages = await Message.find({}).populate('user')

  console.log(messages)

  res.render('message_list', { 
    title: 'Latest messages', 
    messages, 
    member: req.user ? (req.user.type === 'member' || req.user.type === 'admin') : false 
  })
}

//Display message form
exports.create_get = (req, res) => {
  if (req.user) {
    return res.render('new-msg_form', { title: 'Create new message' })
  }
  res.redirect('/login')
} 

//Handle message creation on POST
exports.create_post = [
  (req, res, next) => {
    if(req.user) {
      next()
    } else {
      res.status(401).send('Please log in to create message')
    }
  },

  //Validate and sanitize text
  check('text', 'Text required').isLength({ min: 1 }).trim().escape(),

  //Process request ater validation and sanitization
  async (req, res, next) => {
    try {
      const errors = validationResult(req)

      const msg = new Message({
        text: req.body.text,
        user: req.user.id
      })

      //There's error, rerender the form with some error messages to the user
      if(!errors.isEmpty()) {
        res.render('new-msg_form', { title: 'Create new message', errors: errors.array(), msg })
      } else {
        await msg.save()

        res.redirect('/messages')
      }
    } catch (e) {
      next(e)
    }
  }
]