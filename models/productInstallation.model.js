const mongoose = require("mongoose");

const productInstallationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    email: { type: String },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    installation_date: { type: Date, required: true },
    approval_date: { type: Date },
    installation_notes: { type: String },
    approval_notes: { type: String },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{ type: String }],
    geolocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] }, // [longitude, latitude]
      default: {},
    },
    productCode: { type: String, required: true },
    productModel: { type: String, required: true },
    productSize: { type: String, required: true },
    productVesselColor: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productInstallation",productInstallationSchema);