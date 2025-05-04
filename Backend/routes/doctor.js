
// routes/doctor.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdminOrManager } = require('../middleware/role');
const Doctor = require('../models/Doctor');
const Bill = require('../models/Bill');

// @route   GET api/doctor/:id
// @desc    Get doctor profile
// @access  Private/Admin & Manager
router.get('/:id', [auth, isAdminOrManager], async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    // Get doctor's bills
    const bills = await Bill.find({ doctor: req.params.id })
      .populate('patient', 'name')
      .sort({ billDate: -1 });
    
    res.json({
      doctor,
      bills
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;