const User = require('../models/user')
const validator = require('express-validator')
const bcrypt = require('bcryptjs')

exports.create_get = (req, res) => {
  res.render('signup_form', { title: "Register to Members Only" })
}

exports.create_post = [
  //Validate fields
  validator.check('firstName', 'First name required').isLength({ min: 1 }).trim(),
  validator.check('lastName', 'Last name required').isLength({ min: 1 }).trim(),
  validator.check('username', 'Username required')
    .isLength({ min: 1 }).trim()
    .custom(async value => {
      const userExists = await User.findOne({ 'username':  value})
      if(userExists) {
        throw new Error('Username already in use')
      }
    }),
  validator.check("password")
    .isLength({ min: 4 }).withMessage('Password must be at least 5 chars long'),
  validator.check("confirmPassword")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            // trow error if passwords do not match
            throw new Error("Password confirmation does not match password");
        } else {
            return value;
        }
    }),

  //Sanitize fields
  validator.body('*').escape(),

  //Hash password with bcrypt
  async (req, res, next) => {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    next()
  },

  //Process request after validation and sanitization
  async (req, res, next) => {
    try {
      //Extract the validation errors from a request.
      const errors = validator.validationResult(req)

      //Create a user with escaped and trimmed data
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
      })

      //Checking if there is error
      if(!errors.isEmpty()){//Proceed to rerender the form with some data and error messages
        res.render('signup_form', { title: 'Register to Members Only', user, errors: errors.array() })
      } else {
        await user.save()

        res.redirect('/')
      }
    } catch(e) {
      next(e)
    }
  }
]
