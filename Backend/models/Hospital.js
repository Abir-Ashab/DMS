// models/Hospital.js
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
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
  totalEarnings: {
    type: Number,
    default: 0
  },
  // Configuration values for share percentages
  hospitalSharePercentage: {
    type: Number,
    required: true,
    default: 60 // Default 60%
  },
  doctorSharePercentage: {
    type: Number,
    required: true,
    default: 30 // Default 30%
  },
  brokerSharePercentage: {
    type: Number,
    required: true,
    default: 10 // Default 10%
  }
});

module.exports = mongoose.model('Hospital', HospitalSchema);