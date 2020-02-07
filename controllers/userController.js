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
        return done(null, false, { message: "Incorrect username" })
      }

      const match = await bcrypt.compare(password, user.password)

      if (match) {
        return done(null, user)
      } else {
        return done(null, false, { message: "Incorrect password" })
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
  if(req.user) {
    return res.redirect('/')
  }
  res.render('register_form', { title: "Register to Members Only" })
} 

//Handle user registration on POST
exports.register_post = [
  (req, res, next) => {
    if(!req.user) {
      next()
    } else {
      res.status(400).redirect('/messages')
    }
  },
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
        res.locals = {
          user: user,
          errors: errors.array(),
          title: 'Register to Members Only'
        }
        
        res.render('register_form')
      } else {
        await user.save()
        
        res.redirect('/login')
      }
    } catch(e) {
      next(e)
    }
  }
]

exports.login_get = (req, res) => {
  if(req.user) {
    return res.redirect('/')
  }
  res.locals = {
    error_msg: req.flash('error')[0],
    title: 'Log in'
  }
  res.render('login_form')
}

exports.login_post = passport.authenticate("local", {
  successRedirect: "/messages",
  failureRedirect: "/login",
  failureFlash: 'Invalid username or password.'
})

exports.join_get = (req, res) => {
  if (req.user) {
    if(req.user.type === 'user') {
      return res.render('upgrade_form', { title: 'Join club' })
    }
    return res.redirect('/messages')
  }
  res.redirect('/login')
}

exports.join_post = [
  (req, res, next) => {
    if(req.user) {
      next()
    } else {
      res.status(400).redirect('/login')
    }
  },

  validator.check('secretCode')
    .custom(value => {
      if(value !== process.env.MEMBER_CODE) {
        throw new Error("Incorrect ultra-secret passcode")
      }
      return value
    }),

  async (req, res, next) => {
    try {
      const { currentUser } = res.locals
      const errors = validator.validationResult(req)

      if(!errors.isEmpty()) {
        return res.render('upgrade_form', { title: 'Join Club', error: errors.array()[0] })
      }

      const user = new User({
        ...currentUser,
        _id: currentUser._id,
        type: 'member'
      })

      console.log(user)

      await User.findByIdAndUpdate(currentUser._id, user)

      return res.render('upgrade_form', { title: 'Welcome', welcome: true })
    } catch(e) {
      next(e)
    }
  }
]

exports.become_admin_get = (req, res) => {
  if (req.user) {
    if(req.user.type !== 'admin') {
      return res.render('upgrade_form', { title: 'Become Admin', to_admin: true })
    }
    return res.redirect('/messages')
  }
  res.redirect('/login')
}

exports.become_admin_post = [
  (req, res, next) => {
    if(req.user) {
      next()
    } else {
      res.status(400).redirect('/login')
    }
  },

  validator.check('secretCode')
    .custom(value => {
      if(value !== process.env.ADMIN_CODE) {
        throw new Error("Incorrect ultra-secret code")
      }
      return value
    }),

  async (req, res, next) => {
    try {
      const { currentUser } = res.locals
      const errors = validator.validationResult(req)

      if(!errors.isEmpty()) {
        return res.render('upgrade_form', { title: 'Become Admin', to_admin: true, error: errors.array()[0] })
      }

      const user = new User({
        ...currentUser,
        _id: currentUser._id,
        type: 'admin'
      })

      console.log(user)

      await User.findByIdAndUpdate(currentUser._id, user)

      return res.redirect('/messages')
    } catch(e) {
      next(e)
    }
  }
]
exports.logout = (req, res, next) => {
  req.logout()
  res.redirect('/login')
}