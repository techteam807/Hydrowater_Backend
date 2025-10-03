const successResponse = (res, data = null, message = 'Success', statusCode = 200, extras = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }
  
  if (extras) response.extras = extras;
  return res.status(statusCode).json(response);
};

const errorResponse = (res, message = "Something went wrong", statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      code: statusCode,
    },
  };

  if (details !== null) response.error.details = details;

  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };