// routes/broker.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdminOrManager } = require('../middleware/role');
const Broker = require('../models/Broker');
const Bill = require('../models/Bill');

// @route   GET api/broker/:id
// @desc    Get broker profile
// @access  Private/Admin & Manager
router.get('/:id', [auth, isAdminOrManager], async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id);
    
    if (!broker) {
      return res.status(404).json({ msg: 'Broker not found' });
    }
    
    // Get broker's bills
    const bills = await Bill.find({ broker: req.params.id })
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ billDate: -1 });
    
    res.json({
      broker,
      bills
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Broker not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;