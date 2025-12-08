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
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  address: Joi.object({
    line1: Joi.string().trim().required().messages({
      "string.empty": "Address line 1 is required",
    }),
    line2: Joi.string().trim().allow(null, "").optional(),
    city: Joi.string().trim().required().messages({
      "string.empty": "City is required",
    }),
    state: Joi.string().trim().required().messages({
      "string.empty": "State is required",
    }),
    pincode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.empty": "Pincode is required",
        "string.pattern.base": "Pincode must be 6 digits",
      }),
  })
    .required()
    .messages({
      "object.base": "Address must be an object with line1, city, and state",
    }),
  country: Joi.string().trim().optional(),
  gst_number: Joi.string().required().messages({
    "string.empty": "GST number is required",
  }),
  msme_number: Joi.string().optional().allow(null, ""),
  additional_notes: Joi.string().allow(null, ""),
  terms_conditions: Joi.string().allow(null, ""),
  distributorId: Joi.string().required().messages({
    "string.empty": "Dealer distributorId is required",
  }),
});

const updateDealerValidation = Joi.object({
  company_name: Joi.string().trim().optional(),
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  address: Joi.object({
    line1: Joi.string().trim().required().messages({
      "string.empty": "Address line 1 is required",
    }),
    line2: Joi.string().trim().allow(null, "").optional(),
    city: Joi.string().trim().required().messages({
      "string.empty": "City is required",
    }),
    state: Joi.string().trim().required().messages({
      "string.empty": "State is required",
    }),
    pincode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.empty": "Pincode is required",
        "string.pattern.base": "Pincode must be 6 digits",
      }),
  })
    .required()
    .messages({
      "object.base": "Address must be an object with line1, city, and state",
    }),
  country: Joi.string().trim().optional(),
  gst_number: Joi.string().trim().optional(),
  msme_number: Joi.string().trim().optional(),
  additional_notes: Joi.string().trim().optional(),
  terms_conditions: Joi.string().trim().optional(),
  distributorId: Joi.string().optional().messages({
    "string.empty": "Dealer distributorId is required",
  }),
}).min(1);

module.exports = { createDealerValidation, updateDealerValidation };
