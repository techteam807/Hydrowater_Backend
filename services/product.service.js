const Product = require('../models/product.model');

const findByProductId = async (productId) => {
  return Product.findOne({ _id:productId });
};

const markRegistered = async (productId) => {
  return Product.findOneAndUpdate(
    { productId },
    { registered: true, registeredAt: new Date() },
    { new: true }
  );
};

const createIfNotExists = async ({ productId, model, serialNumber, warrantyPeriodMonths = 12 }) => {
  let product = await Product.findOne({ productId });
  if (!product) {
    product = await Product.create({ productId, model, serialNumber, warrantyPeriodMonths });
  }
  return product;
};

const listProducts = async () => {
  return Product.find().sort({ createdAt: -1 }).lean();
};

module.exports = { findByProductId, markRegistered, createIfNotExists, listProducts };
