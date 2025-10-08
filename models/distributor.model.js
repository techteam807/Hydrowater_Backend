const mongoose = require("mongoose");

const DistributorSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, },
    name: { type: String },
    email: { type: String },
    mobile_number: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    isActive: {type:Boolean, default: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Distributor", DistributorSchema);