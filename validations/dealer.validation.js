const Joi = require("joi");

const createDealerValidation = Joi.object({
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
      "string.pattern.base": "Mobile number must be 10 digits (optional +91 country code)",
    }),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  distributorId: Joi.string().optional(),
   });

   module.exports = {createDealerValidation};