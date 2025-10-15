const Installation = require('../models/installation.model');
const productService = require('./product.service');

const registerInstallation = async (data) => {
  // data contains productId, installationDate, etc.
  // Fetch product to get warrantyPeriodMonths
  const product = await productService.findByProductId(data.productId);
  if (!product) {
    throw new Error('Product not found - verify QR / product id');
  }
  if (product.registered) {
    throw new Error('Product already registered');
  }

  // calculate expiry
  const warrantyMonths = product.warrantyPeriodMonths || 12;
  const installDate = new Date(data.installationDate);
  const warrantyExpiry = new Date(installDate);
  warrantyExpiry.setMonth(warrantyExpiry.getMonth() + warrantyMonths);

  const installation = await Installation.create({
    ...data,
    serialNumber: data.serialNumber || product.serialNumber,
    warrantyExpiry
  });

  // mark product registered
  await productService.markRegistered(data.productId);

  return installation;
};

const listInstallations = async (filter = {}) => {
  return Installation.find(filter).sort({ createdAt: -1 }).lean();
};

module.exports = { registerInstallation, listInstallations };
