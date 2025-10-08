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

const getAllUsers = async ({
  userType,
  search = "",
  userParentType,
  userParentId,
  page = 1,
  limit = 10,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let query = {};
    if (search) {
      query.$or = [
        { mobile_number: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    if (userType) {
      query.userRole = userType;
    }

    if (userParentId) query.userParentId = userParentId;
    if (userParentType) query.userParentType = userParentType;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .session(session);

    const total = await User.countDocuments(query).session(session);

    if (users && users.password) {
      users.password = decryptPassword(users.password);
    }

    await session.commitTransaction();
    session.endSession();

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateTechnician = async (technicianId, userData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const technicianFind = await User.findById(technicianId).session(session);

    if (!technicianFind) {
      throw new Error("Technicaian Not Found");
    }

    const technician = await User.findByIdAndUpdate(technicianId, userData, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return technician;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const deleteTechnician = async (technicianId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const technicianFind = await User.findById(technicianId).session(session);
    
    if (!technicianFind) {
      throw new Error("Technician Not Found");
    }

    if ((technicianFind.isActive = false)) {
      throw new Error("Technician Alredy Deleted");
    }

    const technician = await User.findByIdAndUpdate(
      technicianId,
      { isActive: false },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();
    return technician;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  genrateAdminUsers,
  genrateTechnicianUsers,
  getAllUsers,
  updateTechnician,
  deleteTechnician,
};
