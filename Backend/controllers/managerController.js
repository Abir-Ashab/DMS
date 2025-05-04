// controllers/managerController.js
const Doctor = require('../models/Doctor');
const Broker = require('../models/Broker');
const Patient = require('../models/Patient');
const Test = require('../models/test');

// @route   POST api/manager/doctors
// @desc    Create doctor
// @access  Private/Manager
exports.createDoctor = async (req, res) => {
  const { name, specialization, contactNumber, email, address } = req.body;

  try {
    // Create new doctor
    const doctor = new Doctor({
      name,
      specialization,
      contactNumber,
      email,
      address,
      createdBy: req.user.id
    });

    await doctor.save();
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/manager/doctors
// @desc    Get all doctors
// @access  Private/Manager
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/manager/brokers
// @desc    Create broker
// @access  Private/Manager
exports.createBroker = async (req, res) => {
  const { name, contactNumber, email, address } = req.body;

  try {
    // Create new broker
    const broker = new Broker({
      name,
      contactNumber,
      email,
      address,
      createdBy: req.user.id
    });

    await broker.save();
    res.json(broker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/manager/brokers
// @desc    Get all brokers
// @access  Private/Manager
exports.getAllBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find();
    res.json(brokers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/manager/patients
// @desc    Register patient
// @access  Private/Manager
exports.registerPatient = async (req, res) => {
  const { name, age, gender, contactNumber, email, address } = req.body;

  try {
    // Create new patient
    const patient = new Patient({
      name,
      age,
      gender,
      contactNumber,
      email,
      address,
      registeredBy: req.user.id
    });

    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/manager/patients
// @desc    Get all patients
// @access  Private/Manager
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/manager/tests
// @desc    Create test
// @access  Private/Manager
exports.createTest = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    // Check if test already exists
    let test = await Test.findOne({ name });
    if (test) {
      return res.status(400).json({ msg: 'Test already exists' });
    }

    // Create new test
    test = new Test({
      name,
      price,
      description,
      createdBy: req.user.id
    });

    await test.save();
    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/manager/tests
// @desc    Get all tests
// @access  Private/Manager
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

