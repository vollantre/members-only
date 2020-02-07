const Message = require('../models/message')

const { check, body, validationResult } = require('express-validator')

exports.list = async (req, res) => {
  const messages = await Message.find({}).populate('user')
  messages.reverse()

  res.locals = { 
    title: 'Latest messages', 
    messages,
    currentUser: req.user,
    member: req.user ? (req.user.type === 'member' || req.user.type === 'admin') : false 
  }
  res.render('message_list')
}

//Display message form
exports.create_get = (req, res) => {
  if (req.user) {
    res.locals = {
      title: 'Create new message',
      currentUser: req.user
    }
    return res.render('new-msg_form')
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
        res.locals = {
          title: 'Create new message',
          errors: errors.array(),
          msg
        }
        res.render('new-msg_form')
      } else {
        await msg.save()

        res.redirect('/messages')
      }
    } catch (e) {
      next(e)
    }
  }
]

//Display message delete form on GET
exports.delete_get = async (req, res, next) => {
  try {
    if(req.user) {
      const msg = await Message.findById(req.params.id).populate('user')
      if (msg && req.user.type === 'admin') {
        return res.render('msg_delete', { title: 'Delete Message', msg })
      }
      return res.redirect('/messages')
    }
    res.redirect('/login')
  } catch (e) {
    next(e)
  }
}

//Handle message delete on POST
exports.delete_post = async (req, res, next) => {
  try {
    await Message.findByIdAndRemove(req.body.msg_id)

    res.redirect('/messages')
  } catch (e) {
    next(e)
  }
}