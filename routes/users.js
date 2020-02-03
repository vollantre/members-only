const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
/* GET users listing. */
router.post('/', (req, res) => {
  res.send('aaaaaa')
})

module.exports = router
