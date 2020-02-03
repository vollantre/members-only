const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', (req, res) => res.redirect('/sign-up'))

router.get('/sign-up', userController.register_get)

router.post('/sign-up', userController.register_post)

router.get('/login', (req, res) => res.redirect('/log-in'))

router.get('/log-in', userController.login_get)

router.post('/log-in', userController.login_post)

module.exports = router
