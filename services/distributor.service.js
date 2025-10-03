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
    return { error: error.message };
  }
};

const distributorDropDown = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const distributor = await Distributor.find().select("_id name");
    await session.commitTransaction();
    session.endSession();
    return distributor;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { error: error.message };
  }
};

module.exports = { generateDistributor, getDistributor, distributorDropDown };
