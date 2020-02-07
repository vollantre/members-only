const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', (req, res) => res.render('index', { title: 'Members only' }))

//GET request for user registration
router.get('/register', userController.register_get)

//POST request for user registration
router.post('/register', userController.register_post)

//GET request to login
router.get('/login', userController.login_get)

//POST request to login
router.post('/login', userController.login_post)

//GET request to join club
router.get('/join_club', userController.join_get)

//POST request to join club
router.post('/join_club', userController.join_post)

//GET request to become admin
router.get('/become_admin', userController.become_admin_get)

//POST request to become admin
router.post('/become_admin', userController.become_admin_post)

//GET request to log out
router.get('/logout', userController.logout)

module.exports = router
