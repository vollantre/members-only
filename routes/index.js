const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/sign-up')
})

router.get('/sign-up', (req, res) => {
  res.render('signup_form', { title: "Register to Members Only" })
})

router.post('/sign-up', userController.create)

module.exports = router
