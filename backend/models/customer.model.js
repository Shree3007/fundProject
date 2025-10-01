const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  customerID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
}, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
