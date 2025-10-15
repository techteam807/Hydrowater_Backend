const { errorResponse } = require("../utils/response");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message).join(', ');
    return errorResponse(res, errors ||"Validation failed", 400, null);
  }

  next();
};

module.exports = validate;
