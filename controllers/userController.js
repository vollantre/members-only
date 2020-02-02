const User = require('../models/user')
const validator = require('express-validator')
const bcrypt = require('bcryptjs')

exports.create = [
  //Validate fields
  validator.body('first_name', 'First name required').isLength({ min: 1 }).trim(),
  validator.body('last_name', 'Last name required').isLength({ min: 1 }).trim(),
  validator.body('username', 'Username required').isLength({ min: 1 }).trim(),
  validator.body('password', 'Password required').isLength({ min: 5 }),
  validator.body('confirm_password','Password confirmation required').isLength({ min: 5 }),

  //Sanitize fields
  validator.sanitizeBody('first_name').escape(),
  validator.sanitizeBody('last_name').escape(),

  async (req, res, next) => {
    try {
      console.log(req.body)
      User.findOne({'username': req.body.username})
      res.redirect('/')
    } catch(e) {
      next(e)
    }
  }
]
