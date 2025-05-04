// models/Broker.js
const mongoose = require('mongoose');

const BrokerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalCommission: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Broker', BrokerSchema);
