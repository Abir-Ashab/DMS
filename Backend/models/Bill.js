// models/Bill.js
const mongoose = require('mongoose');

const TestItemSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const BillSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broker'
  },
  tests: [TestItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  hospitalShare: {
    type: Number,
    required: true
  },
  doctorShare: {
    type: Number,
    required: true
  },
  brokerShare: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  billDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bill', BillSchema);
