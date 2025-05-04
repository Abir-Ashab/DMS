
// routes/manager.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { isManager, isAdminOrManager } = require('../middleware/role');
const managerController = require('../controllers/managerController');

// Doctor routes
// @route   POST api/manager/doctors
// @desc    Create doctor
// @access  Private/Manager
router.post(
  '/doctors',
  [
    auth,
    isManager,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('specialization', 'Specialization is required').not().isEmpty(),
      check('contactNumber', 'Contact number is required').not().isEmpty()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  managerController.createDoctor
);

// @route   GET api/manager/doctors
// @desc    Get all doctors
// @access  Private/Manager
router.get('/doctors', [auth, isAdminOrManager], managerController.getAllDoctors);

// Broker routes
// @route   POST api/manager/brokers
// @desc    Create broker
// @access  Private/Manager
router.post(
  '/brokers',
  [
    auth,
    isManager,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('contactNumber', 'Contact number is required').not().isEmpty()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  managerController.createBroker
);

// @route   GET api/manager/brokers
// @desc    Get all brokers
// @access  Private/Manager
router.get('/brokers', [auth, isAdminOrManager], managerController.getAllBrokers);

// Patient routes
// @route   POST api/manager/patients
// @desc    Register patient
// @access  Private/Manager
router.post(
  '/patients',
  [
    auth,
    isManager,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('age', 'Age is required').isNumeric(),
      check('gender', 'Gender is required').isIn(['Male', 'Female', 'Other']),
      check('contactNumber', 'Contact number is required').not().isEmpty()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  managerController.registerPatient
);

// @route   GET api/manager/patients
// @desc    Get all patients
// @access  Private/Manager
router.get('/patients', [auth, isAdminOrManager], managerController.getAllPatients);

// Test routes
// @route   POST api/manager/tests
// @desc    Create test
// @access  Private/Manager
router.post(
  '/tests',
  [
    auth,
    isManager,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  managerController.createTest
);

// @route   GET api/manager/tests
// @desc    Get all tests
// @access  Private/Manager
router.get('/tests', [auth, isAdminOrManager], managerController.getAllTests);

module.exports = router;