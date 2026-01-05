const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const Distributor = require("../models/distributor.model");
const Dealer = require("../models/dealer.model");
const { UserRoleEnum } = require("../utils/global");
const { decryptPassword, encryptPassword } = require("../utils/encryption");

const genrateAdminUsers = async (name, email, password, userRole) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await User.findOne({ email, userRole }).session(session);
    if (existing) {
      throw new Error(`User Alredy Exits With Email ${email}`);
    }
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
  profile_picture,
  userParentId,
  userParentType,
  userId
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await User.findOne({
      mobile_number,
      userRole: UserRoleEnum.SUPERTECHNICIAN || UserRoleEnum.TECHNICIAN,
    }).session(session);
    if (existing) {
      throw new Error(`User Alredy Exits With Mobile ${mobile_number}`);
    }
    const user = new User({
      name,
      mobile_number,
      userRole,
      profile_picture:profile_picture || "",
      userParentId: userParentId || userId,
      userParentType: userParentType || UserRoleEnum.ADMIN,
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
      .sort({ createdAt: -1 })
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

const getTechnicians = async ({
  search = "",
  userParentType,
  userParentId,
  page = 1,
  limit = 10,
  isActive,
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

    query.userRole = UserRoleEnum.TECHNICIAN || UserRoleEnum.SUPERTECHNICIAN;

    if (userParentId) query.userParentId = userParentId;
    if (userParentType) query.userParentType = userParentType;
    if (isActive) query.isActive = isActive;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .skip(skip)
      .sort({ createdAt: -1 })
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

const restoreTechnician = async (technicianId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const technicianFind = await User.findById(technicianId).session(session);

    if (!technicianFind) {
      throw new Error("Technician Not Found");
    }

    // if ((technicianFind.isActive = false)) {
    //   throw new Error("Technician Alredy Deleted");
    // }

    const technician = await User.findByIdAndUpdate(
      technicianId,
      { isActive: true },
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

const getUserCount = async () => {
  try {
    // Run all counts in parallel for efficiency
    const [technicianCount, distributorCount, dealerCount] = await Promise.all([
      // Count technicians from User model
      User.countDocuments({
        userRole: UserRoleEnum.TECHNICIAN,
        isActive: true,
      }),

      // Count distributors from Distributor model
      Distributor.countDocuments({ isActive: true }),

      // Count dealers from Dealer model
      Dealer.countDocuments({ isActive: true }),
    ]);

    // Return unified response object
    return {
      technician: technicianCount,
      distributor: distributorCount,
      dealer: dealerCount,
    };
  } catch (error) {
    console.error("Error getting user counts:", error);
    throw error;
  }
};

const getTechniciansDropdown = async ({ parentType, parentId } = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let query = { isActive: true, userRole: UserRoleEnum.TECHNICIAN };

    if (parentType) {
      query.userParentType = parentType;
    }
    
    if(parentId) {
      query.userParentId = parentId;
    }

    const technicians = await User.find(query).select("_id name userRole userParentType userParentId").sort({name:1}).session(session);
    await session.commitTransaction();
    session.endSession();
    return technicians;
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
  getTechnicians,
  updateTechnician,
  deleteTechnician,
  getUserCount,
  restoreTechnician,
  getTechniciansDropdown
};
