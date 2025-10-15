const { default: mongoose } = require("mongoose");
const Distributor = require("../models/distributor.model");
const Dealer = require("../models/dealer.model");
const User = require("../models/user.model");
const generatePassword = require("../utils/generatePassword");
const { encryptPassword, decryptPassword } = require("../utils/encryption");
const { UserRoleEnum } = require("../utils/global");

const generateDistributor = async (userId, distributorData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Distributor.findOne({
      mobile_number: distributorData?.mobile_number,
    }).session(session);
    if (existing) {
      throw new Error(
        `Distributor Alredy Exits With Mobile ${distributorData?.mobile_number}`
      );
    }
    const distributor = new Distributor(distributorData);
    await distributor.save({ session });

    const plainPassword = generatePassword(distributor.name);
    const encryptedPassword = encryptPassword(plainPassword);

    const user = new User({
      name: distributor.name,
      email: distributor.email,
      password: encryptedPassword,
      userRole: UserRoleEnum.DISTRIBUTOR,
    });
    await user.save({ session });
    distributor.userId = user._id;
    await distributor.save({ session });

    await session.commitTransaction();
    session.endSession();

    return distributor;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getDistributor = async (distributorId = null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let distributor;
    if (distributorId) {
      distributor = await Distributor.findById(distributorId).session(session);
      if (!distributor) throw new Error("Distributor not found");
    } else {
      distributor = await Distributor.find().session(session);
    }

    // Single distributor
    if (distributorId) {
      const dealer = await Dealer.find({
        distributorId: distributor._id,
      }).session(session);
      const users = await User.find({
        userParentId: distributor._id,
        userParentType: UserRoleEnum.DISTRIBUTOR,
      }).session(session);
      const creditionalUser = await User.findById(distributor.userId).session(
        session
      );

      await session.commitTransaction();
      session.endSession();

      return {
        distributor,
        dealers: dealer,
        users,
        creditionalUser,
      };
    }

    // All distributors
    const allDistributorsWithDetails = await Promise.all(
      distributor.map(async (d) => {
        const dealer = await Dealer.find({ distributorId: d._id }).session(
          session
        );
        const users = await User.find({
          userParentId: d._id,
          userParentType: UserRoleEnum.DISTRIBUTOR,
        }).session(session);
        const creditionalUser = await User.findById(d.userId).session(session);
        if (creditionalUser && creditionalUser.password) {
          creditionalUser.password = decryptPassword(creditionalUser.password);
        }
        return { distributor: d, dealers: dealer, users, creditionalUser };
      })
    );

    await session.commitTransaction();
    session.endSession();

    return allDistributorsWithDetails;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getDistributors = async ({
  search = "",
  city,
  state,
  country,
  // filters = {},
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
        { company_name: { $regex: search, $options: "i" } },
      ];
    }

    if (city) query["address.city"] = { $in: city };
    if (state) query["address.state"] = { $in: state };
    if (country) query.country = { $in: country };
    if (isActive) query.isActive = isActive;

    // if (filters && Object.keys(filters).length > 0) {
    //   query = { ...query, ...filters };
    // }

    const skip = (page - 1) * limit;

    const distributors = await Distributor.find(query)
      .skip(skip)
      .sort({createdAt : -1})
      .limit(limit)
      .session(session);

    const total = await Distributor.countDocuments(query).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      data: distributors,
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

const distributorDropDown = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const distributor = await Distributor.find().select(
      "_id company_name name"
    );
    await session.commitTransaction();
    session.endSession();
    return distributor;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const distributorUpdate = async (distributorId, distributorData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const distributorFind = await Distributor.findById(distributorId).session(
      session
    );
    if (!distributorFind) {
      throw new Error("Distributor Not Found");
    }

    const distributor = await Distributor.findByIdAndUpdate(
      distributorId,
      distributorData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return distributor;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteDistributor = async (distributorId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const distributorFind = await Distributor.findById(distributorId).session(
      session
    );

    if (!distributorFind) {
      throw new Error("Distributor Not Found");
    }

    if ((distributorFind.isActive = false)) {
      throw new Error("Distributor Alredy Deleted");
    }

    const distributor = await Distributor.findByIdAndUpdate(
      distributorId,
      { isActive: false },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();
    return distributor;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  generateDistributor,
  getDistributor,
  getDistributors,
  distributorDropDown,
  distributorUpdate,
  deleteDistributor,
};
