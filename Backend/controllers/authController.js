// controllers/authController.js
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: config.get('jwtExpiration') },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/billing
// @desc    Get all bills
// @access  Private/Manager & Admin
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .populate('generatedBy', 'name')
      .sort({ billDate: -1 });
    
    res.json(bills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/billing/:id
// @desc    Get bill by ID
// @access  Private/Manager & Admin
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name age gender contactNumber')
      .populate('doctor', 'name specialization')
      .populate('broker', 'name')
      .populate('tests.test', 'name price description')
      .populate('generatedBy', 'name');
    
    if (!bill) {
      return res.status(404).json({ msg: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Bill not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/billing/search
// @desc    Search bills by patient name, doctor name, or date range
// @access  Private/Manager & Admin
exports.searchBills = async (req, res) => {
  const { patientName, doctorName, startDate, endDate } = req.query;
  
  try {
    let query = {};
    
    // Find patients by name if provided
    if (patientName) {
      const patients = await Patient.find({ 
        name: { $regex: patientName, $options: 'i' } 
      });
      const patientIds = patients.map(patient => patient._id);
      query.patient = { $in: patientIds };
    }
    
    // Find doctors by name if provided
    if (doctorName) {
      const doctors = await Doctor.find({ 
        name: { $regex: doctorName, $options: 'i' } 
      });
      const doctorIds = doctors.map(doctor => doctor._id);
      query.doctor = { $in: doctorIds };
    }
    
    // Add date range if provided
    if (startDate && endDate) {
      query.billDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else if (startDate) {
      query.billDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.billDate = { $lte: new Date(endDate) };
    }
    
    const bills = await Bill.find(query)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .sort({ billDate: -1 });
    
    res.json(bills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

