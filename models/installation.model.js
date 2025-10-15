const mongoose = require('mongoose');

const InstallationSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  serialNumber: { type: String },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  installationDate: { type: Date, required: true },
  notes: { type: String },
  geoLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  warrantyExpiry: { type: Date, required: true },
  technicianId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Installation', InstallationSchema);