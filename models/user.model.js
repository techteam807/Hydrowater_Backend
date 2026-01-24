const mongoose = require("mongoose");
const { UserRoleEnum } = require("../utils/global");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    mobile_number: { type: String },
    profile_picture: { type: String },
    userRole: {
      type: String,
      enum: Object.values(UserRoleEnum),
    },
    userParentId: { type: String },
    userParentType: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    securityPin: { type: String },
    isActive: {type:Boolean, default: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
