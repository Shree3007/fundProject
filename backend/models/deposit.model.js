const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const depositSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  week: {
    type: Number,
    required: true,
    min: 1,
    max: 52
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  timestamps: true,
});

const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit;
