const { verifyToken } = require("../config/jwt");
const { errorResponse } = require("../utils/response");
const User = require("../models/user.model");

module.exports = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return errorResponse(res, "Unauthorized", 401, "NO_TOKEN");

  try {
    const decoded = verifyToken(token);

    console.log("decoded:",decoded);
    

    const user = await User.findById(decoded.userId).select("_id");
    console.log("user",user);

    if(!user) {
      return errorResponse(res, "User not found", 404, "USER_NOT_FOUND");
    }
    
    req.user = decoded; // attach user to request
    next();
  } catch (e) {
    return errorResponse(res, "Invalid token", 403, "INVALID_TOKEN");
  }
};
