const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tableSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  cafe_id: {
    type: Schema.Types.ObjectId,
    ref: 'cafes',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Table = mongoose.model('Table', tableSchema, 'Table')

module.exports = Table