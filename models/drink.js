const mongoose = require('mongoose')
const Schema = mongoose.Schema

const drinkSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'categorys',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
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

const Drink = mongoose.model('Drink', drinkSchema, 'Drink')

module.exports = Drink