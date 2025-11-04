const jwt = require("jsonwebtoken");

// function generateToken(payload) {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "1d",
//   });
// }

function generateToken(payload, isAdmin = false) {
  const options = isAdmin
    ? {} // ❌ No expiration for admin token
    : { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }; // default expiry for others

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };