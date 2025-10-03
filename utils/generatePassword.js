const generatePassword = (name) => {
  if (!name || name.length < 1) throw new Error("Name must have at least 1 character");

  // Take first 4 characters of the name (or full name if shorter)
  const namePart = name.substring(0, 4);

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  return `${namePart}${randomDigits}`;
};

module.exports = generatePassword;
