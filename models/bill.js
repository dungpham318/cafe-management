const mongoose = require('mongoose')
const Schema = mongoose.Schema
let Drink = require('../models/drink')

const billInformation = new Schema({
  drink_id: {
    type: Schema.Types.ObjectId,
    ref: 'drinks',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})
const billSchema = new Schema({
  cafe_id: {
    type: Schema.Types.ObjectId,
    ref: 'cafes',
    required: true
  },
  table_id: {
    type: Schema.Types.ObjectId,
    ref: 'tables',
    required: true
  },
  billInformation: [billInformation],
  totalPrice: {
    type: Number,
    required: true,
  },
  startedTime: {
    type: Date,
    default: Date.now
  },
  endedTime: {
    type: Date,
    default: null
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  }
})

const Bill = mongoose.model('Bill', billSchema, 'Bill')

module.exports = Bill