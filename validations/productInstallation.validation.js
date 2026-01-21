const Joi = require("joi");

const registerProductInstallationValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),

  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

  email: Joi.string().email().allow(null, "").optional().messages({
    "string.email": "Email must be a valid email address",
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
      "object.base": "Address must be a valid object",
    }),

  installation_notes: Joi.string().allow(null, "").optional(),

product_images: Joi.array()
  .items(
    Joi.string().uri().messages({
      "string.uri": "Each image must be a valid URL",
    })
  )
  .max(5)
  .messages({
    "array.max": "You can upload a maximum of 5 images",
  })
  .optional(),

installation_checkList_images: Joi.array()
  .items(
    Joi.string().uri().messages({
      "string.uri": "Each image must be a valid URL",
    })
  )
  .max(5)
  .messages({
    "array.max": "You can upload a maximum of 5 images",
  })
  .optional(),

  geolocation: Joi.object({
    type: Joi.string().valid("Point").optional(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional().messages({
      "array.length": "Coordinates must contain [longitude, latitude]",
    }),
  })
    .optional()
    .messages({
      "object.base": "Geolocation must be a valid object",
    }),

  productCode: Joi.string().trim().required().messages({
    "string.empty": "Product code is required",
  }),

  productModel: Joi.string().trim().required().messages({
    "string.empty": "Product model is required",
  }),

  productSize: Joi.string().trim().required().messages({
    "string.empty": "Product size is required",
  }),

  productVesselColor: Joi.string().trim().required().messages({
    "string.empty": "Product vessel color is required",
  }),
});

module.exports = {
  registerProductInstallationValidation,
};
