const mongoose = require("mongoose");

const DistributorSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    mobile_number: { type: String },
    office_address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    wareHouse_address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    other_address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    country: { type: String, default: "India" },
    gst_number: { type: String },
    msme_number: { type: String},
    additional_notes: { type: String },
    terms_conditions: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    default: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Distributor", DistributorSchema);