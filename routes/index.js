const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', (req, res) => res.send('NICE'))

router.get('/signup', userController.register_get)

router.post('/signup', userController.register_post)

router.get('/login', userController.login_get)

router.post('/login', userController.login_post)

module.exports = router
