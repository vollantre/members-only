const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

//Setting up schema for message model
const messageSchema = new Schema({
  title: {
    required: true,
    type: String
  },
  text: {
    required: true,
    type: String
  },
  timestamp: {
    type: Date,
    default: moment()
  }
})

module.exports = mongoose.model('Message', messageSchema)