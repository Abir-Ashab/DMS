
// routes/billing.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { isManager, isAdminOrManager } = require('../middleware/role');
const billingController = require('../controllers/billingController');

// @route   POST api/billing
// @desc    Generate new bill
// @access  Private/Manager
router.post(
  '/',
  [
    auth,
    isManager,
    [
      check('patientId', 'Patient ID is required').not().isEmpty(),
      check('doctorId', 'Doctor ID is required').not().isEmpty(),
      check('testIds', 'Test IDs are required').isArray().notEmpty()
    ]
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  billingController.generateBill
);

// @route   GET api/billing
// @desc    Get all bills
// @access  Private/Manager & Admin
router.get('/', [auth, isAdminOrManager], billingController.getAllBills);

// @route   GET api/billing/:id
// @desc    Get bill by ID
// @access  Private/Manager & Admin
router.get('/:id', [auth, isAdminOrManager], billingController.getBillById);

// @route   GET api/billing/search
// @desc    Search bills
// @access  Private/Manager & Admin
router.get('/search', [auth, isAdminOrManager], billingController.searchBills);

module.exports = router;