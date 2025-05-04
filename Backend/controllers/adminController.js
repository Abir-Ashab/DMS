// controllers/adminController.js
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Bill = require('../models/Bill');

// @route   POST api/admin/managers
// @desc    Create manager account
// @access  Private/Admin
exports.createManager = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      userType: 2 // Manager
    });

    await user.save();

    res.json({ msg: 'Manager account created successfully', user: { id: user.id, name, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/admin/managers
// @desc    Get all managers
// @access  Private/Admin
exports.getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ userType: 2 }).select('-password');
    res.json(managers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/admin/dashboard
// @desc    Get dashboard data
// @access  Private/Admin
exports.getDashboardData = async (req, res) => {
  try {
    // Get hospital info
    const hospital = await Hospital.findOne();
    
    // Get today's bills
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayBills = await Bill.find({
      billDate: { $gte: todayStart, $lte: todayEnd }
    });
    
    // Get total bills count
    const totalBills = await Bill.countDocuments();
    
    // Get today's revenue
    const todayRevenue = todayBills.reduce((acc, bill) => acc + bill.totalAmount, 0);
    
    // Get total revenue
    const totalRevenue = await Bill.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]);
    
    res.json({
      hospitalEarnings: hospital ? hospital.totalEarnings : 0,
      todayBillsCount: todayBills.length,
      totalBillsCount: totalBills,
      todayRevenue,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/admin/hospital
// @desc    Update hospital settings
// @access  Private/Admin
exports.updateHospitalSettings = async (req, res) => {
  const { 
    name, 
    address, 
    contactNumber, 
    email, 
    hospitalSharePercentage, 
    doctorSharePercentage, 
    brokerSharePercentage 
  } = req.body;

  try {
    // Check if percentages add up to 100
    if (hospitalSharePercentage + doctorSharePercentage + brokerSharePercentage !== 100) {
      return res.status(400).json({ msg: 'Share percentages must add up to 100%' });
    }

    let hospital = await Hospital.findOne();
    
    if (hospital) {
      // Update existing hospital
      hospital.name = name;
      hospital.address = address;
      hospital.contactNumber = contactNumber;
      hospital.email = email;
      hospital.hospitalSharePercentage = hospitalSharePercentage;
      hospital.doctorSharePercentage = doctorSharePercentage;
      hospital.brokerSharePercentage = brokerSharePercentage;
    } else {
      // Create new hospital
      hospital = new Hospital({
        name,
        address,
        contactNumber,
        email,
        hospitalSharePercentage,
        doctorSharePercentage,
        brokerSharePercentage
      });
    }

    await hospital.save();
    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// implement registerAdmin function to register a new admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    } 
    // Create new user
    user = new User({
      name,
      email,
      password,
      userType: 1 // Admin
    });

    await user.save();
    res.json({ msg: 'Admin account created successfully', user: { id: user.id, name, email } });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}