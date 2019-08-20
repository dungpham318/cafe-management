const mongoose = require('mongoose');
const Schema = mongoose.Schema

const accountSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
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
  email: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    required: true
  },
  cafe_id: {
    type: Schema.Types.ObjectId,
    ref: 'cafes',
    require: true
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
})

const Account = mongoose.model('Account', accountSchema, 'Account')

module.exports = Account;
