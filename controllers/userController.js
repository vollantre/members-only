const User = require('../models/user')
const validator = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//Setting up the LocalStrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username })

      if(!user){
        return done(null, false, { msg: "Incorrect username" })
      }

      const match = await bcrypt.compare(password, user.password)

      if (match) {
        return done(null, user)
      } else {
        return done(null, false, { msg: "Incorrect password" })
      }
    } catch (e) {
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

exports.passport = passport

//Display sign-up form
exports.register_get = (req, res) => {
  res.render('signup_form', { title: "Register to Members Only" })
}

//Handle user registration on POST
exports.register_post = [
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

exports.login_get = (req, res) => {
  res.render('login_form', { title: 'Log in' })
}

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
})