// routes/hospital.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdminOrManager } = require('../middleware/role');
const Hospital = require('../models/Hospital');
const Bill = require('../models/Bill');

// @route   GET api/hospital
// @desc    Get hospital profile
// @access  Private/Admin & Manager
router.get('/', [auth, isAdminOrManager], async (req, res) => {
  try {
    const hospital = await Hospital.findOne();
    
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    
    // Get latest bills
    const recentBills = await Bill.find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ billDate: -1 })
      .limit(10);
    
    res.json({
      hospital,
      recentBills
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;