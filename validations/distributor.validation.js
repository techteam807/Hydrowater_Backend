const Joi = require("joi");

const createDistributorValidation = Joi.object({
  company_name: Joi.string().required().messages({
    "string.empty": "Distributor Company name is required",
  }),
  name: Joi.string().required().messages({
    "string.empty": "Distributor name is required",
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
  office_address: Joi.object({
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
      "object.base":
        "Office Address must be an object with line1, city, and state",
    }),
  wareHouse_address: Joi.object({
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
      "object.base":
        "Warehouse Address must be an object with line1, city, and state",
    }),
  other_address: Joi.object({
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
    .optional()
    .allow(null)
    .messages({
      "object.base":
        "Other Address must be an object with line1, city, and state",
    }),
  country: Joi.string().allow(null, ""),
  gst_number: Joi.string().required().messages({
    "string.empty": "GST number is required",
  }),
  additional_notes: Joi.string().allow(null, ""),
  terms_conditions: Joi.string().allow(null, ""),
});

const updateDistributorValidation = Joi.object({
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
  office_address: Joi.object({
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
      "object.base":
        "Office Address must be an object with line1, city, and state",
    }),
  wareHouse_address: Joi.object({
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
      "object.base":
        "Warehouse Address must be an object with line1, city, and state",
    }),
  other_address: Joi.object({
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
    .optional()
    .allow(null)
    .messages({
      "object.base":
        "Other Address must be an object with line1, city, and state",
    }),
  country: Joi.string().trim().optional(),
  gst_number: Joi.string().trim().optional(),
  additional_notes: Joi.string().trim().optional(),
  terms_conditions: Joi.string().trim().optional(),
}).min(1);

module.exports = { createDistributorValidation, updateDistributorValidation };
