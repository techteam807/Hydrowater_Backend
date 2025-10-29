const mongoose = require("mongoose");

const DealerSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, },
    name: { type: String },
    email: { type: String },
    mobile_number: { type: String },
address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
    country: { type: String, default: "India" },
    distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor" },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    isActive: {type:Boolean, default: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dealer", DealerSchema);