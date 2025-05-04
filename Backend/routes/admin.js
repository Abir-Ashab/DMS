// routes/admin.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const adminController = require('../controllers/adminController');

// @route   POST api/admin/managers
// @desc    Create manager account
// @access  Private/Admin
router.post(
  '/managers',
  [
    auth,
    isAdmin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  adminController.createManager
);

// @route   GET api/admin/managers
// @desc    Get all managers
// @access  Private/Admin
router.get('/managers', [auth, isAdmin], adminController.getAllManagers);

// @route   GET api/admin/dashboard
// @desc    Get dashboard data
// @access  Private/Admin
router.get('/dashboard', [auth, isAdmin], adminController.getDashboardData);

// @route   PUT api/admin/hospital
// @desc    Update hospital settings
// @access  Private/Admin
router.put(
  '/hospital',
  [
    auth,
    isAdmin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty(),
      check('contactNumber', 'Contact number is required').not().isEmpty(),
      check('hospitalSharePercentage', 'Hospital share percentage is required').isNumeric(),
      check('doctorSharePercentage', 'Doctor share percentage is required').isNumeric(),
      check('brokerSharePercentage', 'Broker share percentage is required').isNumeric()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  adminController.updateHospitalSettings
);

// create a new route for admin registration
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  adminController.registerAdmin
);

// sample data for admin registration

// route for registering a new admin
// @route   POST api/admin/register
module.exports = router;