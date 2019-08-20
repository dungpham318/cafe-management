const mongoose = require('mongoose');
const Schema = mongoose.Schema

const cafeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  cafeName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Cafe = mongoose.model('Cafe', cafeSchema, 'Cafe');

module.exports = Cafe;
