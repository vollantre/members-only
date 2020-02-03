const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/sign-up')
})

router.get('/sign-up', userController.create_get)

router.post('/sign-up', userController.create_post)

//router.get('/log-in', userController.login_get)

//router.post('/log-in', userController.login_post)

module.exports = router
