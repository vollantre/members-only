const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Setting up the schema for user model
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  admin: { type: Boolean },
  member: { type: Boolean }
})

//Virtual for user's fullname
userSchema
  .virtual('fullname')
  .get(function() {
    return this.firstName + ' ' + this.lastName
  })

//Export model
module.exports = mongoose.model('User', userSchema)