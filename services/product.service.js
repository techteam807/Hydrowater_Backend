const Product = require('../models/product.model');

const findByProductId = async (productId) => {
  return Product.findOne({ productId });
};

const markRegistered = async (productId) => {
  return Product.findOneAndUpdate({ productId }, { registered: true, registeredAt: new Date() }, { new: true });
};

const createIfNotExists = async ({ productId, model, serialNumber, warrantyPeriodMonths = 12 }) => {
  let p = await Product.findOne({ productId });
  if (!p) {
    p = await Product.create({ productId, model, serialNumber, warrantyPeriodMonths });
  }
  return p;
};

module.exports = { findByProductId, markRegistered, createIfNotExists };