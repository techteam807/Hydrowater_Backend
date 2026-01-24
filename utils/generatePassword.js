// const generatePassword = (name) => {
//   if (!name || name.length < 1) throw new Error("Name must have at least 1 character");

//   // Take first 4 characters of the name (or full name if shorter)
//   let namePart = name;

//   if(namePart.length < 4)
//   {
//     const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
//     namePart = (namePart + randomDigits).substring(0, 4);
//   }
//   else
//   {
//     namePart = namePart.substring(0, 4);
//   }
//   // Generate 4 random digits
//   const randomDigits = Math.floor(1000 + Math.random() * 9000);

//   return `${namePart}${randomDigits}`;
// };

// module.exports = generatePassword;
const User = require("../models/user.model");

const generatePassword = (name) => {
  if (!name || name.length < 1) throw new Error("Name must have at least 1 character");

  // Take first 4 characters of the name (or full name if shorter)
  let namePart = name;

  if(namePart.length < 4) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    namePart = (namePart + randomDigits).substring(0, 4);
  } else {
    namePart = namePart.substring(0, 4);
  }

  // Calculate remaining digits to make password length 8
  const remainingLength = 8 - namePart.length;
  const min = Math.pow(10, remainingLength - 1);
  const max = Math.pow(10, remainingLength) - 1;
  const randomDigits = Math.floor(min + Math.random() * (max - min + 1));

  return `${namePart}${randomDigits}`;
};

const generateUniquePin = async (session) => {
  while (true) {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    const pinExists = await User.findOne({
      securityPin: { $exists: true }, 
    }).session(session);

    // Since PIN is hashed, we must compare
    if (!pinExists) {
      return { plainPin: pin};
    }

    const usersWithPin = await User.find({ securityPin: { $exists: true } }).session(session);

    let duplicate = false;
    for (const user of usersWithPin) {
      if (user.securityPin === pin) {
        duplicate = true;
        break;
      }
    }

    if (!duplicate) {
      return { plainPin: pin};
    }
  }
};

module.exports = { generatePassword, generateUniquePin };