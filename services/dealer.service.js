const { default: mongoose } = require("mongoose");
const Dealer = require("../models/dealer.model");
const Distributor = require("../models/distributor.model");
const User = require("../models/user.model");
const generatePassword = require("../utils/generatePassword");
const { encryptPassword } = require("../utils/encryption");
const { UserRoleEnum } = require("../utils/global");

const generateDealer = async (userId, dealerData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const dealer = new Dealer(dealerData);
    await dealer.save({ session });

    const plainPassword = generatePassword(dealer?.name);
    const encryptedPassword = encryptPassword(plainPassword);

    const user = new User({
      name: dealer.name,
      email: dealer.email,
      password: encryptedPassword,
      userRole: UserRoleEnum.DEALER,
    });
    await user.save({ session });

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

      await session.commitTransaction();
      session.endSession();

      return {
        dealer,
        distributor,
        users,
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
        return { dealer: d, distributor, users };
      })
    );

    await session.commitTransaction();
    session.endSession();

    return allDealersWithDetails;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { error: error.message };
  }
};

const dealerDropDown = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const dealer = await Dealer.find().select("_id name");
    await session.commitTransaction();
    session.endSession();
    return dealer;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { error: error.message };
  }
};

module.exports = { generateDealer, getDealer, dealerDropDown };
