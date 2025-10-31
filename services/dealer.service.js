const { default: mongoose } = require("mongoose");
const Dealer = require("../models/dealer.model");
const Distributor = require("../models/distributor.model");
const User = require("../models/user.model");
const generatePassword = require("../utils/generatePassword");
const { encryptPassword, decryptPassword } = require("../utils/encryption");
const { UserRoleEnum } = require("../utils/global");

const generateDealer = async (userId, dealerData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Dealer.findOne({
      mobile_number: dealerData?.mobile_number,
    }).session(session);
    if (existing) {
      throw new Error(
        `Dealer Alredy Exits With Mobile ${dealerData?.mobile_number}`
      );
    }
    const dealer = new Dealer(dealerData);
    await dealer.save({ session });

    const plainPassword = generatePassword(dealer?.name);
    const encryptedPassword = encryptPassword(plainPassword);

    const user = new User({
      name: dealer.name,
      email: dealer.email,
      isActive: true,
      password: encryptedPassword,
      userRole: UserRoleEnum.DEALER,
    });
    await user.save({ session });
    dealer.userId = user._id;
    await dealer.save({ session });
    await session.commitTransaction();
    session.endSession();

    return dealer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getDealer = async (dealerId = null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let dealer;
    if (dealerId) {
      dealer = await Dealer.findById(dealerId).session(session);
      if (!dealer) throw new Error("Dealer not found");
    } else {
      dealer = await Dealer.find().session(session);
    }

    // If fetching a single dealer, get related distributor and users
    if (dealerId) {
      const distributor = await Distributor.findById(
        dealer.distributorId
      ).session(session);
      const users = await User.find({
        userParentId: dealer._id,
        userRole: UserRoleEnum.DEALER,
      }).session(session);
      const creditionalUser = await User.findById(dealer.userId).session(
              session
            );
            if (creditionalUser?.password) {
              creditionalUser.password = decryptPassword(creditionalUser.password);
            }

      await session.commitTransaction();
      session.endSession();

      return {
        dealer,
        distributors:distributor,
        users,
        creditionalUser,
      };
    }

    // For all dealers
    const allDealersWithDetails = await Promise.all(
      dealer.map(async (d) => {
        const distributor = await Distributor.findById(d.distributorId).session(
          session
        );
        const users = await User.find({
          userParentId: d._id,
          userParentType: UserRoleEnum.DEALER,
        }).session(session);
                const creditionalUser = await User.findById(d.userId).session(session);
                if (creditionalUser?.password) {
                creditionalUser.password = decryptPassword(creditionalUser.password);
              }
        return { dealer: d, distributors:distributor, users, creditionalUser };
      })
    );

    await session.commitTransaction();
    session.endSession();

    return allDealersWithDetails;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getDealers = async ({
  search = "",
  // city,
  state,
  // country,
  distributorId,
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
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    // if (city) query["address.city"] = { $in: city };
    if (state) query["address.state"] = { $in: state };
    // if (country) query.country = { $in: country };
    if (distributorId) query.distributorId = distributorId;
    if (isActive) query.isActive = isActive;

    // if (filters && Object.keys(filters).length > 0) {
    //   query = { ...query, ...filters };
    // }

    const skip = (page - 1) * limit;

    const dealers = await Dealer.find(query)
      .populate({
        path: "distributorId",
        select: "name company_name",
      })
      .skip(skip)
      .limit(limit)
      .sort({createdAt : -1})
      .session(session);

    const total = await Dealer.countDocuments(query).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      data: dealers,
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

const dealerDropDown = async (distributorId = null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let query = {};
    if (distributorId) {
      query.distributorId = distributorId;
    }
    const dealer = await Dealer.find(query).select(
      "_id company_name name distributorId"
    );
    await session.commitTransaction();
    session.endSession();
    return dealer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateDealer = async (dealerId, dealerData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const dealerFind = await Dealer.findById(dealerId).session(session);
    if (!dealerFind) {
      throw new Error("Dealer Not Found");
    }

    const dealer = await Dealer.findByIdAndUpdate(dealerId, dealerData, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return dealer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteDealer = async (dealerId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const dealerFind = await Dealer.findById(dealerId).session(session);

    if (!dealerFind) {
      throw new Error("Dealer Not Found");
    }

    if ((dealerFind.isActive = false)) {
      throw new Error("Dealer Alredy Deleted");
    }

    const dealer = await Dealer.findByIdAndUpdate(
      dealerId,
      { isActive: false },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();
    return dealer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const restoreDealer = async (dealerId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const dealerFind = await Dealer.findById(dealerId).session(session);

    if (!dealerFind) {
      throw new Error("Dealer Not Found");
    }

    // if ((dealerFind.isActive = true)) {
    //   throw new Error("Dealer Alredy Restored");
    // }

    const dealer = await Dealer.findByIdAndUpdate(
      dealerId,
      { isActive: true },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();
    return dealer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  generateDealer,
  getDealer,
  getDealers,
  dealerDropDown,
  updateDealer,
  deleteDealer,
  restoreDealer
};
