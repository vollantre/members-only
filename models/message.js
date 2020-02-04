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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: moment()
  }
})

messageSchema
  .virtual('time_ago')
  .get(function() {
    return moment(this.timestamp).fromNow()
  })

module.exports = mongoose.model('Message', messageSchema)