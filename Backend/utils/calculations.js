// utils/calculations.js
/**
 * Calculate bill shares based on hospital configuration
 * @param {Number} subtotal - Total amount before distribution
 * @param {Object} config - Share configuration percentages
 * @param {Boolean} hasBroker - Whether broker is involved
 * @returns {Object} Calculated shares
 */
const calculateShares = (subtotal, config, hasBroker) => {
  let { hospitalSharePercentage, doctorSharePercentage, brokerSharePercentage } = config;
  
  // If no broker, redistribute broker's share to hospital
  if (!hasBroker) {
    hospitalSharePercentage += brokerSharePercentage;
    brokerSharePercentage = 0;
  }
  
  const hospitalShare = (subtotal * hospitalSharePercentage) / 100;
  const doctorShare = (subtotal * doctorSharePercentage) / 100;
  const brokerShare = (subtotal * brokerSharePercentage) / 100;
  
  return {
    hospitalShare: parseFloat(hospitalShare.toFixed(2)),
    doctorShare: parseFloat(doctorShare.toFixed(2)),
    brokerShare: parseFloat(brokerShare.toFixed(2)),
    totalAmount: parseFloat(subtotal.toFixed(2))
  };
};

/**
 * Generate unique bill number
 * @returns {String} Unique bill number
 */
const generateBillNumber = () => {
  const prefix = 'BILL';
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp.slice(-6)}-${random}`;
};

module.exports = {
  calculateShares,
  generateBillNumber
};