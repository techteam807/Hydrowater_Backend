const Joi = require("joi");
const { UserRoleEnum } = require("../utils/global");

const adminValidation = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  userRole: Joi.string()
    .valid(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    .required(),
});

const technicianValidation = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
  }),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be 10 digits",
    }),
  profile_picture:Joi.string().optional().empty(""),
  userRole: Joi.string()
    .valid(UserRoleEnum.TECHNICIAN, UserRoleEnum.SUPERTECHNICIAN)
    .required(),
  userParentId: Joi.string().optional().empty(""),
  userParentType: Joi.string().optional().empty(""),
});

const updateTechnicianValidation = Joi.object({
  name: Joi.string().trim().optional(),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base":
        "Mobile number must be 10 digits",
    }),
  profile_picture:Joi.string().trim().optional()
}).min(1);

module.exports = { adminValidation, technicianValidation, updateTechnicianValidation };
