const express = require('express')
const router = express.Router()

const user_controller = require('../controllers/userController')
/* GET users listing. */
router.post('/create', user_controller.create)

module.exports = router
