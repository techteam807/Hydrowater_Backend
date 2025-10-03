const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const { UserRoleEnum } = require("../utils/global");
const { decryptPassword, encryptPassword } = require("../utils/encryption");

const genrateAdminUsers = async (name, email, password, userRole) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const encryptedPassword = encryptPassword(password);
    const user = new User({
      name,
      email,
      password: encryptedPassword,
      userRole,
    });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const genrateTechnicianUsers = async (
  name,
  mobile_number,
  userRole,
  userParentId,
  userParentType,
  userId
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await User.findOne({ mobile_number }).session(session);
    if (existing) {
      throw new Error(`User Alredy Exits With Mobile ${mobile_number}`);
    }
    const user = new User({
      name,
      mobile_number,
      userRole,
      userParentId: userParentId || userId,
      userParentType: userParentType || UserRoleEnum.SUPERADMIN,
    });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllUsers = async (userType = null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let query = {};
    if (userType) {
      query.userRole = userType; // filter by userRole only if provided
    }
    const users = await User.find(query).session(session);
    if (users && users.password) {
      users.password = decryptPassword(users.password);
    }

    await session.commitTransaction();
    session.endSession();

    return users;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = { genrateAdminUsers, genrateTechnicianUsers, getAllUsers };
