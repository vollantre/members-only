const router = require('express').Router()

const messageController = require('../controllers/messageController')

router.get('/', messageController.list)

router.get('/new', messageController.create_get)

router.post('/new', messageController.create_post)

module.exports = router