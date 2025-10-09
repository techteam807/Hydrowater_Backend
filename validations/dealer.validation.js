const Joi = require("joi");

const createDealerValidation = Joi.object({
  company_name: Joi.string().required().messages({
    "string.empty": "Dealer Company name is required",
  }),
  name: Joi.string().required().messages({
    "string.empty": "Dealer name is required",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email",
  }),
  mobile_number: Joi.string()
    .pattern(/^(\+91)?[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be 10 digits (optional +91 country code)",
    }),
  address: Joi.string().allow(null, ""),
  city: Joi.string().allow(null, ""),
  state: Joi.string().allow(null, ""),
  country: Joi.string().allow(null, ""),
  distributorId: Joi.string().required().messages({
    "string.empty": "Dealer distributorId is required",
  }),
});

const updateDealerValidation = Joi.object({
  company_name: Joi.string().trim().optional(),
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  mobile_number: Joi.string()
    .pattern(/^(\+91)?[0-9]{10}$/)
    .optional()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be 10 digits (optional +91 country code)",
    }),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
}).min(1);

module.exports = { createDealerValidation, updateDealerValidation };
