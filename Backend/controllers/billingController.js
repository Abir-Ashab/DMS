// controllers/billingController.js
const Bill = require('../models/Bill');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Broker = require('../models/Broker');
const Test = require('../models/test');
const { calculateShares, generateBillNumber } = require('../utils/calculations');

// @route   POST api/billing
// @desc    Generate new bill
// @access  Private/Manager
exports.generateBill = async (req, res) => {
  const { patientId, doctorId, brokerId, testIds } = req.body;

  try {
    // Get hospital configuration
    const hospital = await Hospital.findOne();
    if (!hospital) {
      return res.status(400).json({ msg: 'Hospital configuration not found' });
    }

    // Get tests details
    const tests = await Test.find({ _id: { $in: testIds } });
    if (tests.length !== testIds.length) {
      return res.status(400).json({ msg: 'One or more tests not found' });
    }

    // Calculate subtotal
    let subtotal = 0;
    const testItems = tests.map(test => {
      subtotal += test.price;
      return {
        test: test._id,
        price: test.price
      };
    });

    // Calculate shares
    const hasBroker = brokerId ? true : false;
    const shares = calculateShares(subtotal, hospital, hasBroker);

    // Generate bill number
    const billNumber = generateBillNumber();

    // Create new bill
    const bill = new Bill({
      patient: patientId,
      doctor: doctorId,
      broker: brokerId || null,
      tests: testItems,
      subtotal,
      hospitalShare: shares.hospitalShare,
      doctorShare: shares.doctorShare,
      brokerShare: shares.brokerShare,
      totalAmount: shares.totalAmount,
      generatedBy: req.user.id,
      billNumber
    });

    await bill.save();

    // Update hospital earnings
    hospital.totalEarnings += shares.hospitalShare;
    await hospital.save();

    // Update doctor earnings
    const doctor = await Doctor.findById(doctorId);
    doctor.totalEarnings += shares.doctorShare;
    await doctor.save();

    // Update broker commission if applicable
    if (hasBroker) {
      const broker = await Broker.findById(brokerId);
      broker.totalCommission += shares.brokerShare;
      await broker.save();
    }

    // Populate the bill with related data for the response
    const populatedBill = await Bill.findById(bill._id)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .populate('tests.test', 'name price');

    res.json(populatedBill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .populate('tests.test', 'name price')
      .sort({ billDate: -1 });

    res.json(bills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .populate('tests.test', 'name price');

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
exports.updateBill = async (req, res) => {
  const { patientId, doctorId, brokerId, testIds } = req.body;

  try {
    // Get hospital configuration
    const hospital = await Hospital.findOne();
    if (!hospital) {
      return res.status(400).json({ msg: 'Hospital configuration not found' });
    }

    // Get tests details
    const tests = await Test.find({ _id: { $in: testIds } });
    if (tests.length !== testIds.length) {
      return res.status(400).json({ msg: 'One or more tests not found' });
    }

    // Calculate subtotal
    let subtotal = 0;
    const testItems = tests.map(test => {
      subtotal += test.price;
      return {
        test: test._id,
        price: test.price
      };
    });

    // Calculate shares
    const hasBroker = brokerId ? true : false;
    const shares = calculateShares(subtotal, hospital, hasBroker);

    // Update bill
    const bill = await Bill.findByIdAndUpdate(req.params.id, {
      patient: patientId,
      doctor: doctorId,
      broker: brokerId || null,
      tests: testItems,
      subtotal,
      hospitalShare: shares.hospitalShare,
      doctorShare: shares.doctorShare,
      brokerShare: shares.brokerShare,
      totalAmount: shares.totalAmount
    }, { new: true });

    if (!bill) {
      return res.status(404).json({ msg: 'Bill not found' });
    }

    // Update hospital earnings
    hospital.totalEarnings += shares.hospitalShare;
    await hospital.save();

    // Update doctor earnings
    const doctor = await Doctor.findById(doctorId);
    doctor.totalEarnings += shares.doctorShare;
    await doctor.save();

    // Update broker commission if applicable
    if (hasBroker) {
      const broker = await Broker.findById(brokerId);
      broker.totalCommission += shares.brokerShare;
      await broker.save();
    }

    // Populate the updated bill with related data for the response
    const populatedBill = await Bill.findById(bill._id)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .populate('tests.test', 'name price');

    res.json(populatedBill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  } 
};

exports.searchBills = async (req, res) => {
  const { query } = req.query; // Get the search query from the request

  try {
    // Search for bills based on patient name, doctor name, or bill number
    const bills = await Bill.find({
      $or: [
        { 'patient.name': { $regex: query, $options: 'i' } },
        { 'doctor.name': { $regex: query, $options: 'i' } },
        { billNumber: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('broker', 'name')
      .populate('tests.test', 'name price')
      .sort({ billDate: -1 });

    res.json(bills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}