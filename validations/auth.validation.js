const Joi = require("joi");

const loginAdminValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
});

const loginTechnicianValidation = Joi.object({
  mobile_number: Joi.string()
    .pattern(/^(\+91)?[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be 10 digits (optional +91 country code)",
    }),
});

const verifyOtpValidation = Joi.object({
  mobile_number: Joi.string()
    .pattern(/^(\+91)?[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be 10 digits (optional +91 country code)",
    }),
  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.pattern.base": "OTP must be 6 digits",
    }),
});

module.exports = {
  loginAdminValidation,
  loginTechnicianValidation,
  verifyOtpValidation,
};
