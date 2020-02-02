var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/sign-up')
})

router.get('/sign-up', (req, res) => {
  res.render('signup_form', { title: "Sign up" })
})

module.exports = router
