const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
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
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
})

const Category = mongoose.model('Category', categorySchema, 'Category')

module.exports = Category