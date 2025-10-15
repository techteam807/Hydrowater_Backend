const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true }, // from QR
  model: { type: String },
  serialNumber: { type: String },
  warrantyPeriodMonths: { type: Number, default: 12 },
  registered: { type: Boolean, default: false },
  registeredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);